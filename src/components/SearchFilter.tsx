"use client";
import { useState } from "react";
import { categories } from "@/data/categories";
import { cities } from "@/data/cities";
import { tr, type Dict } from "@/lib/i18n";
type Init = { q?: string; category?: string; sub?: string; city?: string; minPrice?: string; maxPrice?: string };
export default function SearchFilter({ locale, t, init = {} }: { locale: string; t: Dict; init?: Init }) {
  const [cat, setCat] = useState(init.category ?? "");
  const subs = categories.find((c) => c.id === cat)?.subs ?? [];
  const sel = "rounded-xl border border-primary-border bg-white px-3 py-3 text-[15px] text-text-secondary";
  return (
    <form action={`/${locale}/handymans`} className="flex flex-wrap items-center gap-2 rounded-2xl border border-primary-border bg-white p-2.5 shadow-card">
      <input name="q" defaultValue={init.q} placeholder={t.hero.placeholder} className="min-w-[220px] flex-1 bg-transparent px-4 py-3 text-[15px] outline-none" />
      <select name="category" value={cat} onChange={(e) => setCat(e.target.value)} className={sel}>
        <option value="">{t.hero.allCats}</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {tr(c.name, locale)}</option>)}
      </select>
      <select name="sub" defaultValue={init.sub ?? ""} key={cat} className={sel} disabled={!subs.length}>
        <option value="">{t.hero.allSubs}</option>
        {subs.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <select name="city" defaultValue={init.city ?? ""} className={sel}>
        <option value="">{t.hero.allCities}</option>
        {cities.map((c) => <option key={c.id} value={c.id}>{tr(c, locale)}</option>)}
      </select>
      <input name="minPrice" type="number" min="0" defaultValue={init.minPrice} placeholder={t.hero.minPrice} className={`${sel} w-32`} />
      <input name="maxPrice" type="number" min="0" defaultValue={init.maxPrice} placeholder={t.hero.maxPrice} className={`${sel} w-32`} />
      <button className="rounded-xl bg-primary-blue px-8 py-3.5 font-semibold text-white hover:bg-primary-hover">{t.hero.search}</button>
    </form>
  );
}
