"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/data/categories";
import { cities } from "@/data/cities";
import { tr, type Dict } from "@/lib/i18n";
export default function AuthForm({ mode, role, locale, t }: { mode: "signin" | "signup"; role: "customer" | "handyman"; locale: string; t: Dict }) {
  const [cat, setCat] = useState(categories[0].id);
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const a = t.auth;
  const inp = "w-full rounded-xl border border-primary-border bg-white px-4 py-3 text-[15px] outline-none focus:border-primary-blue";
  const hm = role === "handyman";
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg("");
    const data = Object.fromEntries(new FormData(e.currentTarget) as any);
    const res = await fetch(`/api/auth/${mode === "signup" ? "register" : "login"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role, ...data }) });
    if (res.ok) { router.push(`/${locale}/dashboard`); router.refresh(); return; }
    const err = (await res.json().catch(() => ({}))).error;
    setMsg(err === "already_exists" ? a.exists : err === "invalid_credentials" ? a.invalid : a.error);
  }
  return (
    <div className="mx-auto max-w-md space-y-5 rounded-2xl border border-border-subtle bg-white p-8 shadow-card">
      <div className="flex gap-2 rounded-xl bg-bg-main p-1 text-sm font-semibold">
        {(["customer", "handyman"] as const).map((r) => (
          <a key={r} href={`/${locale}/${mode}/${r}`} className={`flex-1 rounded-lg py-2 text-center ${r === role ? "bg-white text-primary-blue shadow-sm" : "text-text-muted"}`}>{a[r]}</a>
        ))}
      </div>
      <h1 className="text-2xl font-bold">{mode === "signup" ? a.signupTitle : a.signinTitle}</h1>
      <form onSubmit={submit} className="space-y-3">
        {mode === "signup" && <div className="grid grid-cols-2 gap-3"><input name="firstName" required placeholder={a.firstName} className={inp} /><input name="lastName" required placeholder={a.lastName} className={inp} /></div>}
        {mode === "signup" && hm && (<>
          <select name="category" value={cat} onChange={(e) => setCat(e.target.value)} className={inp} aria-label={a.profession}>{categories.map((c) => <option key={c.id} value={c.id}>{tr(c.name, locale)}</option>)}</select>
          <select name="sub" key={cat} className={inp} aria-label={a.subcategory}>{categories.find((c) => c.id === cat)!.subs.map((s) => <option key={s}>{s}</option>)}</select>
          <select name="city" className={inp} aria-label={a.city}>{cities.map((c) => <option key={c.id} value={c.id}>{tr(c, locale)}</option>)}</select>
        </>)}
        {hm && mode === "signup" ? (<><input name="email" type="email" required placeholder={a.email} className={inp} /><input name="phone" type="tel" required placeholder={a.mobile} className={inp} /></>) : <input name="login" required placeholder={a.phoneOrEmail} className={inp} />}
        <input name="password" type="password" required placeholder={a.password} className={inp} />
        <button className="w-full rounded-xl bg-primary-blue py-3 font-semibold text-white hover:bg-primary-hover">{mode === "signup" ? a.signup : a.signin}</button>
      </form>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
      <p className="text-center text-sm text-text-muted">{mode === "signup" ? a.haveAcc : a.noAcc} <a className="font-semibold text-primary-blue" href={`/${locale}/${mode === "signup" ? "signin" : "signup"}/${role}`}>{mode === "signup" ? a.signin : a.signup}</a></p>
    </div>
  );
}
