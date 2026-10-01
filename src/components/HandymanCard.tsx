import Link from "next/link";
import { categories } from "@/data/categories";
import { cities } from "@/data/cities";
import { tr, type Dict } from "@/lib/i18n";
import type { HandymanListing } from "@/lib/handymen";

export default function HandymanCard({ h, locale, t }: { h: HandymanListing; locale: string; t: Dict }) {
  const cat = categories.find((c) => c.id === h.categoryId);
  const city = cities.find((c) => c.id === h.city);

  return (
    <div className="flex flex-col justify-between space-y-4 rounded-xl border border-border-subtle bg-white p-5 shadow-sm transition hover:border-primary-border hover:shadow-card">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          {h.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={h.photoUrl} alt={h.firstName} className="h-14 w-14 rounded-full border border-primary-border object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary-border bg-soft-blue font-bold text-primary-blue">
              {h.firstName[0]}{h.lastName[0]}
            </div>
          )}
          {h.isVip && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">★ VIP</span>}
        </div>
        <div>
          <h3 className="font-bold">{h.firstName} {h.lastName}</h3>
          <p className="text-xs text-text-muted">{cat ? tr(cat.name, locale) : h.categoryId} · {city ? tr(city, locale) : h.city}</p>
        </div>
        <p className="line-clamp-2 text-xs text-text-secondary">{h.subcategories.join(" · ")}</p>
      </div>
      <div className="mt-4 flex items-end justify-between border-t border-border-subtle pt-4">
        <div><span className="text-xs text-text-muted">{t.profile.from}</span><p className="text-lg font-bold">{h.price} ₾ / m²</p></div>
        <Link href={`/${locale}/handyman/${h.id}`} className="rounded-lg border border-border-subtle bg-bg-main px-4 py-2 text-xs font-semibold hover:bg-soft-blue hover:text-primary-blue">→</Link>
      </div>
    </div>
  );
}
