"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MessageSquareCode, Send, X } from "lucide-react";
import { answer, greet, type AssistantReply } from "@/lib/assistant";
import { cn } from "@/lib/utils";

type Message = { from: "user" | "bot"; reply: AssistantReply };

/**
 * Terminal-styled portfolio assistant. Deterministic retrieval over the
 * validated content layer — every reply is real data, never a guess.
 */
export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ from: "bot", reply: greet() }]);
    }
    if (open) inputRef.current?.focus();
  }, [open, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  function ask(text: string) {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [
      ...m,
      { from: "user", reply: { text: clean } },
      { from: "bot", reply: answer(clean) },
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
        aria-label={open ? "Close portfolio assistant" : "Open portfolio assistant — ask anything about Sridhar"}
        className={cn(
          "fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full border transition-all ease-systems",
          open
            ? "border-line bg-panel text-muted"
            : "border-gold/60 bg-surface text-gold shadow-[0_0_30px_-6px_rgb(var(--c-gold)/0.5)] hover:-translate-y-1",
        )}
      >
        {open ? <X size={20} /> : <MessageSquareCode size={20} />}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Portfolio assistant"
          className="fixed bottom-20 right-5 z-50 flex max-h-[70vh] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-theme border border-line bg-surface shadow-2xl shadow-black/50"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-line bg-panel px-4 py-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold/15 text-gold">
              <MessageSquareCode size={15} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-semibold">sm-assistant</p>
              <p className="font-mono text-[0.6rem] text-muted">
                deterministic · answers from real portfolio data
              </p>
            </div>
            <span className="node-pulse h-1.5 w-1.5 rounded-full bg-mineral" aria-hidden />
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[88%] rounded-theme px-3.5 py-2.5 text-[0.82rem] leading-relaxed",
                    m.from === "user"
                      ? "self-end bg-mineral/15 text-ink"
                      : "self-start border border-line bg-panel",
                  )}
                >
                  {m.from === "bot" && (
                    <span aria-hidden className="mr-1.5 font-mono text-gold">
                      &gt;
                    </span>
                  )}
                  <span className="whitespace-pre-line">{m.reply.text}</span>
                  {m.reply.links && m.reply.links.length > 0 && (
                    <span className="mt-2.5 flex flex-col gap-1.5">
                      {m.reply.links.map((l) =>
                        l.href.startsWith("/") && !l.href.endsWith(".pdf") ? (
                          <Link
                            key={l.href + l.label}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="font-mono text-[0.72rem] text-gold underline underline-offset-2 hover:text-clay"
                          >
                            {l.label} →
                          </Link>
                        ) : (
                          <a
                            key={l.href + l.label}
                            href={l.href}
                            target={l.href.startsWith("http") || l.href.endsWith(".pdf") ? "_blank" : undefined}
                            rel="noreferrer noopener"
                            className="font-mono text-[0.72rem] text-gold underline underline-offset-2 hover:text-clay"
                          >
                            {l.label} →
                          </a>
                        ),
                      )}
                    </span>
                  )}
                  {m.from === "bot" && m.reply.chips && (
                    <span className="mt-2.5 flex flex-wrap gap-1.5">
                      {m.reply.chips.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => ask(c)}
                          className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.64rem] text-muted transition-colors hover:border-gold hover:text-gold"
                        >
                          {c}
                        </button>
                      ))}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 border-t border-line bg-panel px-3 py-2.5"
          >
            <span aria-hidden className="font-mono text-sm text-gold">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects, skills, experience…"
              aria-label="Ask the portfolio assistant"
              className="min-w-0 flex-1 bg-transparent font-mono text-[0.8rem] text-ink outline-none placeholder:text-muted/60"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={!input.trim()}
              className="grid h-8 w-8 place-items-center rounded-md bg-gold text-surface transition-opacity disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
