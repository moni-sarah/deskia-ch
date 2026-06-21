import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { getReceptionistBySlug } from "@/lib/public.functions";
import { mintLiveToken } from "@/lib/live.functions";
import {
  PcmPlayer,
  base64ToInt16,
  downsampleTo16k,
  floatToPcm16,
  pcm16ToBase64,
} from "@/lib/live-audio";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import logoAsset from "@/assets/deskia-logo.png.asset.json";

export const Route = createFileRoute("/r/$slug/call")({
  loader: async ({ params }) => {
    const r = await getReceptionistBySlug({ data: { slug: params.slug } });
    if (!r) throw notFound();
    return r;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `Live call — ${loaderData.business_name}` },
          { name: "description", content: `Live voice & video call with the AI receptionist for ${loaderData.business_name}.` },
        ]
      : [{ title: "Live call" }],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <p>Receptionist not found.</p>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-xl font-semibold">Couldn't start call</h1>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
      </div>
    </div>
  ),
  component: CallPage,
});

type Status = "idle" | "connecting" | "live" | "ended" | "error";

function CallPage() {
  const r = Route.useLoaderData();
  const mintFn = useServerFn(mintLiveToken);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const playerRef = useRef<PcmPlayer | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const procNodeRef = useRef<ScriptProcessorNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const frameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mutedRef = useRef(false);
  const videoOnRef = useRef(true);

  useEffect(() => { mutedRef.current = muted; }, [muted]);
  useEffect(() => { videoOnRef.current = videoOn; }, [videoOn]);

  useEffect(() => () => { teardown(); }, []);

  function teardown() {
    frameTimerRef.current && clearInterval(frameTimerRef.current);
    frameTimerRef.current = null;
    procNodeRef.current?.disconnect();
    procNodeRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;
    videoStreamRef.current?.getTracks().forEach((t) => t.stop());
    videoStreamRef.current = null;
    if (wsRef.current && wsRef.current.readyState <= 1) wsRef.current.close();
    wsRef.current = null;
    playerRef.current?.close();
    playerRef.current = null;
  }

  async function startCall() {
    setStatus("connecting");
    setErrorMsg(null);
    try {
      // 1. Get camera + mic
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
      });
      micStreamRef.current = new MediaStream(stream.getAudioTracks());
      videoStreamRef.current = new MediaStream(stream.getVideoTracks());
      if (videoRef.current) {
        videoRef.current.srcObject = videoStreamRef.current;
        await videoRef.current.play().catch(() => {});
      }

      // 2. Mint ephemeral Gemini Live token
      const { token, model } = await mintFn({ data: { receptionist_id: r.id } });

      // 3. Open WebSocket
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?access_token=${encodeURIComponent(token)}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.binaryType = "arraybuffer";

      const player = new PcmPlayer();
      playerRef.current = player;

      ws.onopen = () => {
        // Setup message — config is locked server-side by ephemeral token
        ws.send(JSON.stringify({ setup: { model } }));
        startMicLoop();
        startVideoLoop();
        setStatus("live");
      };

      ws.onmessage = async (ev) => {
        let payload: unknown;
        if (typeof ev.data === "string") {
          payload = JSON.parse(ev.data);
        } else if (ev.data instanceof Blob) {
          payload = JSON.parse(await ev.data.text());
        } else if (ev.data instanceof ArrayBuffer) {
          payload = JSON.parse(new TextDecoder().decode(ev.data));
        } else return;
        handleServerMessage(payload, player);
      };

      ws.onerror = () => {
        setErrorMsg("Connection error");
        setStatus("error");
      };
      ws.onclose = (ev) => {
        if (status === "live") {
          setStatus("ended");
          if (!ev.wasClean && ev.code !== 1000) {
            setErrorMsg(`Disconnected (${ev.code})`);
          }
        }
      };
    } catch (e) {
      const msg = (e as Error).message;
      setErrorMsg(msg);
      setStatus("error");
      toast.error(msg);
      teardown();
    }
  }

  function handleServerMessage(payload: unknown, player: PcmPlayer) {
    const m = payload as {
      serverContent?: {
        modelTurn?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string }; text?: string }> };
        turnComplete?: boolean;
        interrupted?: boolean;
      };
      setupComplete?: unknown;
    };
    if (m.serverContent?.interrupted) {
      player.interrupt();
      setSpeaking(false);
      return;
    }
    const parts = m.serverContent?.modelTurn?.parts ?? [];
    for (const p of parts) {
      if (p.inlineData?.data && p.inlineData.mimeType?.startsWith("audio/pcm")) {
        const int16 = base64ToInt16(p.inlineData.data);
        player.enqueue(int16);
        setSpeaking(true);
      }
    }
    if (m.serverContent?.turnComplete) {
      // Allow the queued buffer to finish playing before clearing speaking state
      setTimeout(() => setSpeaking(false), 200);
    }
  }

  function startMicLoop() {
    if (!micStreamRef.current) return;
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    audioCtxRef.current = ctx;
    const src = ctx.createMediaStreamSource(micStreamRef.current);
    // ScriptProcessor: legacy but ubiquitous; AudioWorklet would be cleaner but adds setup
    const node = ctx.createScriptProcessor(4096, 1, 1);
    procNodeRef.current = node;
    src.connect(node);
    node.connect(ctx.destination);

    node.onaudioprocess = (e) => {
      if (mutedRef.current) return;
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const input = e.inputBuffer.getChannelData(0);
      const down = downsampleTo16k(input, ctx.sampleRate);
      const pcm = floatToPcm16(down);
      const b64 = pcm16ToBase64(pcm);
      ws.send(JSON.stringify({
        realtimeInput: { mediaChunks: [{ mimeType: "audio/pcm;rate=16000", data: b64 }] },
      }));
    };
  }

  function startVideoLoop() {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const c = canvas.getContext("2d");
    if (!c) return;
    frameTimerRef.current = setInterval(() => {
      const ws = wsRef.current;
      const v = videoRef.current;
      if (!videoOnRef.current || !ws || ws.readyState !== WebSocket.OPEN || !v || v.readyState < 2) return;
      c.drawImage(v, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
      const b64 = dataUrl.split(",")[1];
      ws.send(JSON.stringify({
        realtimeInput: { mediaChunks: [{ mimeType: "image/jpeg", data: b64 }] },
      }));
    }, 1000);
  }

  function endCall() {
    teardown();
    setStatus("ended");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <Link to="/r/$slug" params={{ slug: r.slug }} className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="size-4" /> Back to chat
          </Link>
          <div className="flex items-center gap-2">
            <img src={logoAsset.url} alt="Deskia" className="h-6 w-auto rounded-sm" />
            <span className="text-sm text-white/80">Deskia Live</span>
          </div>
        </div>

        <header className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">{r.business_name}</h1>
          <p className="text-sm text-white/60 mt-1">Live voice & video — powered by Gemini</p>
        </header>

        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          {!videoOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80">
              <VideoOff className="size-12 text-white/40" />
            </div>
          )}

          {/* AI presence indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur text-xs">
            <img src={logoAsset.url} alt="" className="h-4 w-auto rounded-sm" />
            <span>{status === "live" ? (speaking ? "AI speaking…" : "AI listening") : statusLabel(status)}</span>
            {speaking && <span className="inline-flex gap-0.5"><Dot /><Dot delay={150} /><Dot delay={300} /></span>}
          </div>

          {status === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/70 text-center px-6">
              <img src={logoAsset.url} alt="Deskia" className="h-16 w-auto rounded-lg" />
              <div>
                <h2 className="text-xl font-semibold">Ready when you are</h2>
                <p className="text-sm text-white/60 mt-1 max-w-sm">
                  You'll share your microphone and camera. The AI can see and hear you in real time.
                </p>
              </div>
              <Button size="lg" onClick={startCall} className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950">
                Start live call
              </Button>
            </div>
          )}

          {status === "connecting" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/70">
              <Loader2 className="size-8 animate-spin" />
              <p className="text-sm text-white/70">Connecting to Gemini Live…</p>
            </div>
          )}

          {(status === "ended" || status === "error") && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/80 text-center px-6">
              <h2 className="text-xl font-semibold">{status === "error" ? "Call failed" : "Call ended"}</h2>
              {errorMsg && <p className="text-sm text-red-300 max-w-md">{errorMsg}</p>}
              <Button size="lg" onClick={() => { setStatus("idle"); setErrorMsg(null); }}>
                Start a new call
              </Button>
            </div>
          )}
        </div>

        {status === "live" && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              size="lg"
              variant={muted ? "destructive" : "secondary"}
              onClick={() => setMuted((m) => !m)}
              className="rounded-full size-14 p-0"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
            </Button>
            <Button
              size="lg"
              variant={videoOn ? "secondary" : "destructive"}
              onClick={() => {
                const next = !videoOn;
                setVideoOn(next);
                videoStreamRef.current?.getVideoTracks().forEach((t) => (t.enabled = next));
              }}
              className="rounded-full size-14 p-0"
              aria-label={videoOn ? "Turn camera off" : "Turn camera on"}
            >
              {videoOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
            </Button>
            <Button
              size="lg"
              variant="destructive"
              onClick={endCall}
              className="rounded-full size-14 p-0"
              aria-label="End call"
            >
              <PhoneOff className="size-5" />
            </Button>
          </div>
        )}

        <p className="text-center text-xs text-white/40 mt-6">
          Audio & video are streamed live to Google Gemini for the duration of the call and are not stored by Deskia.
        </p>
      </div>
    </div>
  );
}

function statusLabel(s: Status) {
  switch (s) {
    case "idle": return "Idle";
    case "connecting": return "Connecting…";
    case "live": return "Live";
    case "ended": return "Ended";
    case "error": return "Error";
  }
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="inline-block size-1 rounded-full bg-emerald-400 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
