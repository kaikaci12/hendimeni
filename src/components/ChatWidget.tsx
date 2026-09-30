"use client";
import { useState } from "react";
import type { Dict } from "@/lib/i18n";
// Design-only: RAG backend (embeddings + retrieval over handymen) comes later.
export default function ChatWidget({ t }: { t: Dict }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-4 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl border border-primary-border bg-white shadow-hover-card">
          <div className="flex items-center justify-between bg-primary-blue px-4 py-3 text-white"><b>{t.chat.title}</b><button onClick={() => setOpen(false)} aria-label="close">✕</button></div>
          <div className="flex-1 space-y-3 bg-bg-main p-4 text-sm"><p className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white p-3 shadow-sm">{t.chat.hello}</p></div>
          <div className="flex gap-2 border-t border-border-subtle p-3"><input placeholder={t.chat.placeholder} className="flex-1 rounded-xl border border-primary-border px-3 py-2 text-sm outline-none" /><button className="rounded-xl bg-primary-blue px-4 text-sm font-semibold text-white">{t.chat.send}</button></div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-blue text-2xl text-white shadow-hover-card hover:bg-primary-hover" aria-label="chat">💬</button>
    </div>
  );
}
