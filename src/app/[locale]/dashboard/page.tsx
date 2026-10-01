import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { requirePageRole } from "@/lib/auth/session";
import { getDict } from "@/lib/i18n";

export default async function Dashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const user = await requirePageRole(locale);
  const t = getDict(locale);
  const isHandyman = user.role === "HANDYMAN";

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-8 py-16">
      <div className="rounded-2xl border border-border-subtle bg-white p-8 shadow-card space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {user.firstName} {user.lastName}{" "}
              <span className="text-sm text-text-muted">({user.role})</span>
            </h1>
            <p className="text-text-secondary">{user.email ?? user.phone}</p>
            {user.handyman && (
              <p className="text-text-secondary">
                {user.handyman.subcategories.map((s) => s.subcategoryId).join(" · ")} · {user.handyman.city}
              </p>
            )}
          </div>
          {user.handyman?.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.handyman.photoUrl}
              alt={user.firstName}
              className="h-16 w-16 rounded-xl border border-primary-border object-cover"
            />
          )}
        </div>
        <div className="flex items-center gap-3 pt-2 border-t border-border-subtle">
          {isHandyman && (
            <Link
              href={`/${locale}/dashboard/profile`}
              className="rounded-xl bg-primary-blue px-5 py-2.5 font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              {locale === "ka" ? "პროფილის რედაქტირება" : "Edit Profile"}
            </Link>
          )}
          <LogoutButton locale={locale} label={locale === "ka" ? "გასვლა" : "Log out"} />
        </div>
      </div>
    </main>
  );
}

