"use client";
import { useRouter } from "next/navigation";
export default function LogoutButton({ locale, label }: { locale: string; label: string }) {
  const router = useRouter();
  return <button className="rounded-xl border border-primary-border px-5 py-2 font-semibold" onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push(`/${locale}`); router.refresh(); }}>{label}</button>;
}
