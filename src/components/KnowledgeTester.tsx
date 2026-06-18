import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { testKnowledge } from "@/lib/chat.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export function KnowledgeTester({ draftFaqs }: { draftFaqs: string }) {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const test = useServerFn(testKnowledge);

  const m = useMutation({
    mutationFn: (question: string) =>
      test({ data: { question, faqs_override: draftFaqs } }),
    onSuccess: (r) => setAnswer(r.text),
    onError: (e: Error) => toast.error(e.message),
  });

  function submit() {
    const text = q.trim();
    if (!text) return;
    setAnswer(null);
    m.mutate(text);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Ask anything a customer might ask…"
          disabled={m.isPending}
        />
        <Button onClick={submit} disabled={m.isPending || !q.trim()}>
          {m.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          Test
        </Button>
      </div>
      {answer !== null && (
        <div className="rounded-md border bg-muted/30 p-3 text-sm prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Tests against your <strong>currently edited</strong> knowledge (no need
        to save first).
      </p>
    </div>
  );
}
