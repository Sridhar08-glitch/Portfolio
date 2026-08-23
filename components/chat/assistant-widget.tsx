"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TerminalSquare, X } from "lucide-react";
import { answer, greet, type AssistantReply } from "@/lib/assistant";
import { cn } from "@/lib/utils";

type Entry =
  | { kind: "cmd"; text: string }
  | { kind: "out"; reply: AssistantReply };

const PROMPT = "sridhar@portfolio";

/**
 * The portfolio assistant as a real terminal session. Commands echo on a
 * prompt line, replies render as command output — deterministic retrieval
 * over the validated content layer; never a guess.
 */
export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && entries.length === 0) {
      setEntries([{ kind: "out", reply: greet() }]);
    }
    if (open) inputRef.current?.focus();
  }, [open, entries.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries]);

  function run(text: string) {
    const clean = text.trim();
    if (!clean) return;
    if (/^(clear|cls)$/i.test(clean)) {
      setEntries([{ kind: "out", reply: greet() }]);
      setInput("");
      return;
    }
    setEntries((e) => [
      ...e,
      { kind: "cmd", text: clean },
      { kind: "out", reply: answer(clean) },
    ]);
    setInput("");
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close terminal assistant" : "Open terminal assistant — ask anything about Sridhar"}
        className={cn(
          "fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full border transition-all ease-systems",
          open
            ? "border-line bg-panel text-muted"
            : "border-gold/60 bg-surface text-gold shadow-[0_0_30px_-6px_rgb(var(--c-gold)/0.5)] hover:-translate-y-1",
        )}
      >
        {open ? <X size={20} /> : <TerminalSquare size={20} />}
      </button>

      {/* Terminal window */}
      {open && (
        <div
          role="dialog"
          aria-label="Terminal assistant"
          className="fixed bottom-20 right-5 z-50 flex max-h-[72vh] w-[min(26rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-lg border border-[#2e2e2e] bg-[#0c0c0c] font-mono shadow-2xl shadow-black/70"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-[#242424] bg-[#161616] px-3.5 py-2.5">
            <span className="flex gap-1.5" aria-hidden>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close terminal"
                className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-70"
              />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </span>
            <p className="flex-1 text-center text-[0.66rem] text-[#8a8a8a]">
              {PROMPT}: ~ — bash
            </p>
          </div>

          {/* Session */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3.5 py-3 text-[0.78rem] leading-relaxed"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Boot banner */}
            <p className="text-[#5c5c5c]">
              SM-shell v2.0 · deterministic — answers from real portfolio data
              <br />
              Type a question, or run one of the suggested commands. `clear` resets.
            </p>

            {entries.map((e, i) =>
              e.kind === "cmd" ? (
                <p key={i} className="mt-3 break-words">
                  <span className="text-[#28c840]">{PROMPT}</span>
                  <span className="text-[#8a8a8a]">:~$</span>{" "}
                  <span className="text-[#e8e6df]">{e.text}</span>
                </p>
              ) : (
                <div key={i} className="mt-1.5 whitespace-pre-line break-words text-[#b9c4b9]">
                  {e.reply.text}
                  {e.reply.links && e.reply.links.length > 0 && (
                    <span className="mt-1.5 block">
                      {e.reply.links.map((l) =>
                        l.href.startsWith("/") && !l.href.endsWith(".pdf") ? (
                          <Link
                            key={l.href + l.label}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="block text-[#4ec9b0] underline decoration-dotted underline-offset-4 hover:text-[#6fe0c8]"
                          >
                            → {l.label}
                          </Link>
                        ) : (
                          <a
                            key={l.href + l.label}
                            href={l.href}
                            target={l.href.startsWith("http") || l.href.endsWith(".pdf") ? "_blank" : undefined}
                            rel="noreferrer noopener"
                            className="block text-[#4ec9b0] underline decoration-dotted underline-offset-4 hover:text-[#6fe0c8]"
                          >
                            → {l.label}
                          </a>
                        ),
                      )}
                    </span>
                  )}
                  {e.reply.chips && (
                    <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {e.reply.chips.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => run(c)}
                          className="text-[#c9a057] hover:text-[#e5c078] hover:underline"
                        >
                          [{c.toLowerCase()}]
                        </button>
                      ))}
                    </span>
                  )}
                </div>
              ),
            )}

            {/* Live prompt line */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(input);
              }}
              className="mt-3 flex items-baseline"
            >
              <span className="shrink-0 text-[#28c840]">{PROMPT}</span>
              <span className="shrink-0 text-[#8a8a8a]">:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Type a command or question"
                autoComplete="off"
                spellCheck={false}
                className="ml-2 min-w-0 flex-1 bg-transparent text-[#e8e6df] caret-[#28c840] outline-none"
              />
              {!input && (
                <span aria-hidden className="term-cursor -ml-1 inline-block h-[1.05em] w-[0.55em] translate-y-[2px] bg-[#28c840]/80" />
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
