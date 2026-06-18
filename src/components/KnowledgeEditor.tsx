import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, HelpCircle } from "lucide-react";

export type QA = { q: string; a: string };

// Serialize Q&A pairs into the `faqs` text blob using a stable, parseable format.
// Free-form notes can live above/below the Q&A block and round-trip cleanly.
const START = "<!-- QA_START -->";
const END = "<!-- QA_END -->";

export function serializeKnowledge(notes: string, qa: QA[]): string {
  const clean = qa.filter((p) => p.q.trim() || p.a.trim());
  const block = clean.length
    ? `${START}\n${clean
        .map((p) => `Q: ${p.q.trim()}\nA: ${p.a.trim()}`)
        .join("\n\n")}\n${END}`
    : "";
  return [notes.trim(), block].filter(Boolean).join("\n\n");
}

export function parseKnowledge(raw: string): { notes: string; qa: QA[] } {
  if (!raw) return { notes: "", qa: [] };
  const start = raw.indexOf(START);
  const end = raw.indexOf(END);
  if (start === -1 || end === -1 || end < start) {
    return { notes: raw, qa: [] };
  }
  const before = raw.slice(0, start).trim();
  const after = raw.slice(end + END.length).trim();
  const inner = raw.slice(start + START.length, end).trim();
  const qa: QA[] = [];
  for (const chunk of inner.split(/\n\s*\n/)) {
    const m = chunk.match(/^Q:\s*([\s\S]*?)\n+A:\s*([\s\S]*)$/);
    if (m) qa.push({ q: m[1].trim(), a: m[2].trim() });
  }
  return { notes: [before, after].filter(Boolean).join("\n\n"), qa };
}

export function KnowledgeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [{ notes, qa }, setState] = useState(() => parseKnowledge(value));

  function update(next: { notes: string; qa: QA[] }) {
    setState(next);
    onChange(serializeKnowledge(next.notes, next.qa));
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium flex items-center gap-1.5">
            <HelpCircle className="size-4 text-primary" />
            Q&amp;A knowledge base
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => update({ notes, qa: [...qa, { q: "", a: "" }] })}
          >
            <Plus className="size-4" /> Add Q&amp;A
          </Button>
        </div>

        {qa.length === 0 ? (
          <p className="text-xs text-muted-foreground border border-dashed rounded-md p-4 text-center">
            No Q&amp;A pairs yet. Add common customer questions and the AI will
            answer using your exact wording.
          </p>
        ) : (
          <div className="space-y-3">
            {qa.map((pair, i) => (
              <div key={i} className="rounded-md border p-3 space-y-2 bg-muted/30">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Question (e.g. What are your prices?)"
                      value={pair.q}
                      onChange={(e) => {
                        const next = [...qa];
                        next[i] = { ...pair, q: e.target.value };
                        update({ notes, qa: next });
                      }}
                    />
                    <Textarea
                      rows={2}
                      placeholder="Answer the AI should give…"
                      value={pair.a}
                      onChange={(e) => {
                        const next = [...qa];
                        next[i] = { ...pair, a: e.target.value };
                        update({ notes, qa: next });
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      update({ notes, qa: qa.filter((_, j) => j !== i) })
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="text-sm font-medium">Additional notes (free text)</div>
        <Textarea
          rows={6}
          value={notes}
          onChange={(e) => update({ notes: e.target.value, qa })}
          placeholder={
            "Opening hours: Mon–Fri 9–18\nAddress: 12 rue de Paris\nAnything else the AI should know…"
          }
        />
        <p className="text-xs text-muted-foreground">
          Both the Q&amp;A list and these notes are sent to the AI as its
          knowledge base. The AI auto-replies in English or French.
        </p>
      </div>
    </div>
  );
}
