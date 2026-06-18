import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { extractTextFromFile } from "@/lib/document-extract";

type Extracted = { name: string; chars: number };

export function DocumentImporter({
  onAppend,
}: {
  onAppend: (text: string, sourceName: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [recent, setRecent] = useState<Extracted[]>([]);

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        if (file.size > 15 * 1024 * 1024) {
          toast.error(`${file.name} is larger than 15 MB`);
          continue;
        }
        try {
          const text = await extractTextFromFile(file);
          if (!text) {
            toast.error(`No text found in ${file.name}`);
            continue;
          }
          onAppend(text, file.name);
          setRecent((r) => [{ name: file.name, chars: text.length }, ...r].slice(0, 5));
          toast.success(`Added ${file.name} to knowledge`);
        } catch (e) {
          toast.error(`${file.name}: ${(e as Error).message}`);
        }
      }
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="rounded-md border-2 border-dashed p-6 text-center bg-muted/20"
      >
        <Upload className="size-6 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium">Drop a PDF, .docx, or .txt here</p>
        <p className="text-xs text-muted-foreground mb-3">
          Text is extracted in your browser and added to the knowledge base.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Choose file
        </Button>
      </div>

      {recent.length > 0 && (
        <ul className="space-y-1">
          {recent.map((r, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <FileText className="size-3.5" />
              <span className="flex-1 truncate">{r.name}</span>
              <span>{r.chars.toLocaleString()} chars added</span>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => setRecent([])}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <X className="size-3" /> Clear list
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
