import { notFound } from "next/navigation";
import { getHandyman } from "@/lib/handymen";
import { categories } from "@/data/categories";
import { cities } from "@/data/cities";
import { getDict, tr } from "@/lib/i18n";

export default async function Profile({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = getDict(locale);
  const h = await getHandyman(id);
  if (!h) notFound();

  const cat = categories.find((c) => c.id === h.categoryId);
  const city = cities.find((c) => c.id === h.city);

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-8 py-12">
      <section className="flex items-start gap-8 rounded-2xl border border-border-subtle bg-white p-8 shadow-card">
        {h.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={h.photoUrl} alt={h.firstName} className="h-40 w-40 rounded-2xl border border-primary-border object-cover" />
        ) : (
          <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl border border-primary-border bg-soft-blue text-4xl font-bold text-primary-blue">
            {h.firstName[0]}{h.lastName[0]}
          </div>
        )}
        <div className="flex-1 space-y-3">
          <h1 className="text-2xl font-extrabold">
            {h.firstName} {h.lastName}
            {h.isVip && <span className="ml-2 rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-600">★ VIP</span>}
          </h1>
          <p className="font-medium text-text-secondary">
            {cat ? tr(cat.name, locale) : h.categoryId} · {h.subcategories.join(" · ")} · {city ? tr(city, locale) : h.city}
          </p>
          {h.bio && <p className="text-text-secondary">{h.bio}</p>}
          <p className="text-xl font-bold">{t.profile.from} {h.price} ₾ / 1 m²</p>
          <div><h2 className="font-bold">{locale === "ka" ? "შეფასებები" : "Ratings"}</h2><p className="text-sm text-text-muted">☆☆☆☆☆ · {locale === "ka" ? "შეფასებები მალე დაემატება" : "Ratings coming soon"}</p></div>
          <button className="rounded-xl bg-primary-blue px-6 py-3 font-semibold text-white hover:bg-primary-hover">{t.profile.contact}</button>
        </div>
      </section>
      {h.portfolio.length > 0 && <section className="space-y-4"><h2 className="text-2xl font-bold">{t.profile.portfolio}</h2><div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{h.portfolio.map((url) => <img key={url} src={url} alt={t.profile.portfolio} className="aspect-square w-full rounded-xl object-cover" />)}</div></section>}
    </main>
  );
}
