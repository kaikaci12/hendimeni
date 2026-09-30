import Link from "next/link";
import SearchFilter from "@/components/SearchFilter";
import HandymanCard from "@/components/HandymanCard";
import { categories } from "@/data/categories";
import { getFeaturedHandymen } from "@/lib/handymen";
import { getDict, tr } from "@/lib/i18n";
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const t = getDict(locale);
  const handymen = await getFeaturedHandymen();
  return (
    <main className="mx-auto max-w-[1440px] space-y-20 px-8 py-16">
      <section className="max-w-4xl space-y-6">
        <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight">{t.hero.title}</h1>
        <p className="max-w-xl text-lg text-text-secondary">{t.hero.sub}</p>
        <SearchFilter locale={locale} t={t} />
      </section>
      <section className="space-y-8">
        <div><h2 className="text-3xl font-bold">★ {t.vip.title}</h2><p className="text-lg text-text-secondary">{t.vip.sub}</p></div>
        {handymen.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">{handymen.map((h) => <HandymanCard key={h.id} h={h} locale={locale} t={t} />)}</div>
        ) : <p>{t.profile.none}</p>}
        <Link href={`/${locale}/handymans`} className="inline-flex rounded-lg border border-border-subtle px-4 py-2 text-sm font-semibold hover:bg-soft-blue hover:text-primary-blue">{t.nav.find} →</Link>
      </section>
      <section id="categories" className="space-y-8">
        <h2 className="text-3xl font-bold">{t.cats.title}</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((c) => (
            <Link key={c.id} href={`/${locale}/handymans?category=${c.id}`} className="group space-y-3 rounded-xl border border-border-subtle bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-primary-border hover:shadow-card">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-border-subtle bg-bg-main text-2xl group-hover:bg-soft-blue">{c.icon}</div>
              <p className="text-sm font-semibold group-hover:text-primary-blue">{tr(c.name, locale)}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
