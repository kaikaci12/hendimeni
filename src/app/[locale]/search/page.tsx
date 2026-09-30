import SearchFilter from "@/components/SearchFilter";
import HandymanCard from "@/components/HandymanCard";
import { searchHandymen } from "@/lib/handymen";
import { getDict } from "@/lib/i18n";
export default async function Search({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { locale } = await params; const sp = await searchParams; const t = getDict(locale);
  const numberParam = (value: string | undefined) => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };
  const list = await searchHandymen({
    q: sp.q,
    category: sp.category,
    sub: sp.sub,
    city: sp.city,
    minPrice: numberParam(sp.minPrice),
    maxPrice: numberParam(sp.maxPrice),
    vip: sp.vip === "true" ? true : sp.vip === "false" ? false : undefined,
  });
  return (
    <main className="mx-auto max-w-[1440px] space-y-8 px-8 py-12">
      <SearchFilter locale={locale} t={t} init={sp} />
      <p className="text-sm text-text-muted">{list.length} {t.profile.results}</p>
      {list.length ? <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">{list.map((h) => <HandymanCard key={h.id} h={h} locale={locale} t={t} />)}</div> : <p>{t.profile.none}</p>}
    </main>
  );
}
