import { notFound } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getDict } from "@/lib/i18n";
export default async function Page({ params }: { params: Promise<{ locale: string; role: string }> }) {
  const { locale, role } = await params;
  if (role !== "customer" && role !== "handyman") notFound();
  return <main className="px-4 py-16"><AuthForm mode="signin" role={role} locale={locale} t={getDict(locale)} /></main>;
}
