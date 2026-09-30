import Header from "@/components/Header";
import ChatWidget from "@/components/ChatWidget";
import { getDict } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth/session";

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDict(locale);
  const user = await getCurrentUser();
  return (<><Header locale={locale} t={t} user={user} />{children}<ChatWidget t={t} /></>);
}
