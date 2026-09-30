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
            {cat ? tr(cat.name, locale) : h.categoryId} · {h.subcategory} · {city ? tr(city, locale) : h.city}
          </p>
          {h.bio && <p className="text-text-secondary">{h.bio}</p>}
          <p className="text-xl font-bold">{t.profile.from} {h.price} ₾</p>
          <button className="rounded-xl bg-primary-blue px-6 py-3 font-semibold text-white hover:bg-primary-hover">{t.profile.contact}</button>
        </div>
      </section>
    </main>
  );
}
