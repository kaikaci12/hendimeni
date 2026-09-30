import { requirePageRole } from "@/lib/auth/session";
import { getDict } from "@/lib/i18n";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requirePageRole(locale, "HANDYMAN");
  const t = getDict(locale);

  return <ProfileForm locale={locale} t={t} />;
}
