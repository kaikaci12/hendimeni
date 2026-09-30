import Link from "next/link";
import type { Dict } from "@/lib/i18n";

type UserInfo = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  handyman?: {
    photoUrl?: string | null;
  } | null;
} | null;

export default function Header({ locale, t, user }: { locale: string; t: Dict; user?: UserInfo }) {
  const other = locale === "ka" ? "en" : "ka";
  const isHandyman = user?.role === "HANDYMAN";

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-8">
        <div className="flex items-center gap-10">
          <Link href={`/${locale}`} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-blue text-lg font-bold text-white">P</span>
            <span className="text-xl font-bold">{t.brand}</span>
          </Link>
          <nav className="hidden gap-8 text-[15px] font-medium text-text-secondary md:flex">
            <Link href={`/${locale}/handymans`} className="hover:text-primary-blue">{t.nav.find}</Link>
            <Link href={`/${locale}#categories`} className="hover:text-primary-blue">{t.nav.categories}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-6 text-[15px] font-medium text-text-secondary">
          {user ? (
            <>
              {isHandyman && (
                <Link
                  href={`/${locale}/dashboard/profile`}
                  className="hidden items-center gap-2 hover:text-primary-blue md:flex"
                >
                  {user.handyman?.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.handyman.photoUrl}
                      alt=""
                      className="h-7 w-7 rounded-full border border-primary-border object-cover"
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-soft-blue text-xs font-bold text-primary-blue">
                      {user.firstName[0]}
                    </span>
                  )}
                  <span className="text-sm">{locale === "ka" ? "პროფილი" : "Profile"}</span>
                </Link>
              )}
              <Link
                href={`/${locale}/dashboard`}
                className="rounded-xl bg-primary-blue px-5 py-2.5 font-semibold text-white hover:bg-primary-hover"
              >
                {user.firstName}
              </Link>
            </>
          ) : (
            <>
              <Link href={`/${locale}/signup/handyman`} className="hidden hover:text-primary-blue md:block">{t.nav.become}</Link>
              <Link href={`/${locale}/signin/customer`} className="hover:text-primary-blue">{t.nav.signin}</Link>
              <Link href={`/${locale}/signup/customer`} className="rounded-xl bg-primary-blue px-5 py-2.5 font-semibold text-white hover:bg-primary-hover">{t.nav.start}</Link>
            </>
          )}
          <Link href={`/${other}`} className="rounded-lg border border-primary-border px-2.5 py-1 text-sm uppercase">{other}</Link>
        </div>
      </div>
    </header>
  );
}
