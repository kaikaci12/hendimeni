"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/data/categories";
import { cities } from "@/data/cities";
import { tr, type Dict } from "@/lib/i18n";

type HandymanData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  role: string;
  handyman: {
    id: string;
    categoryId: string;
    subcategory: string;
    city: string;
    bio: string | null;
    photoUrl: string | null;
    price: number;
    isVip: boolean;
  } | null;
};

export default function ProfileForm({ locale, t }: { locale: string; t: Dict }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<HandymanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [price, setPrice] = useState(0);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        router.push(`/${locale}/signin/customer`);
        return;
      }
      const d: HandymanData = await res.json();
      setData(d);
      setFirstName(d.firstName);
      setLastName(d.lastName);
      setEmail(d.email || "");
      setPhone(d.phone || "");
      setCategoryId(d.handyman?.categoryId || categories[0].id);
      setSubcategory(d.handyman?.subcategory || "");
      setCity(d.handyman?.city || "");
      setBio(d.handyman?.bio || "");
      setPrice(d.handyman?.price || 0);
      setPhotoUrl(d.handyman?.photoUrl || null);
    } finally {
      setLoading(false);
    }
  }, [locale, router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      const res = await fetch("/api/profile/photo", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMsg({ type: "err", text: err.error === "file_too_large" ? pT("photoTooLarge") : pT("error") });
        setPhotoPreview(null);
        return;
      }
      const { photoUrl: url } = await res.json();
      setPhotoUrl(url);
      setMsg({ type: "ok", text: pT("photoUploaded") });
    } catch {
      setMsg({ type: "err", text: pT("error") });
      setPhotoPreview(null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: email || undefined,
          phone: phone || undefined,
          categoryId,
          subcategory,
          city,
          bio,
          price,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMsg({
          type: "err",
          text: err.error === "validation" ? pT("validationError") : pT("error"),
        });
        return;
      }
      const updated: HandymanData = await res.json();
      setData(updated);
      setMsg({ type: "ok", text: pT("saved") });
      router.refresh();
    } catch {
      setMsg({ type: "err", text: pT("error") });
    } finally {
      setSaving(false);
    }
  }

  // Profile-page specific translations helper
  function pT(key: string): string {
    const map: Record<string, Record<string, string>> = {
      ka: {
        title: "ჩემი პროფილი",
        photoLabel: "პროფილის ფოტო",
        changePhoto: "ფოტოს შეცვლა",
        uploading: "იტვირთება...",
        personalInfo: "პირადი ინფორმაცია",
        professionInfo: "პროფესიული ინფორმაცია",
        bioLabel: "ჩემს შესახებ",
        bioPlaceholder: "მოკლედ აღწერეთ თქვენი გამოცდილება...",
        priceLabel: "ფასი (₾)",
        save: "შენახვა",
        saving: "ინახება...",
        saved: "წარმატებით შეინახა!",
        error: "მოხდა შეცდომა",
        validationError: "გთხოვთ შეამოწმოთ მონაცემები",
        photoUploaded: "ფოტო წარმატებით აიტვირთა!",
        photoTooLarge: "ფოტო ძალიან დიდია (მაქს. 5MB)",
        logout: "გასვლა",
        back: "მთავარი",
      },
      en: {
        title: "My Profile",
        photoLabel: "Profile Photo",
        changePhoto: "Change Photo",
        uploading: "Uploading...",
        personalInfo: "Personal Information",
        professionInfo: "Professional Information",
        bioLabel: "About Me",
        bioPlaceholder: "Briefly describe your experience...",
        priceLabel: "Price (₾)",
        save: "Save Changes",
        saving: "Saving...",
        saved: "Saved successfully!",
        error: "Something went wrong",
        validationError: "Please check the entered data",
        photoUploaded: "Photo uploaded successfully!",
        photoTooLarge: "Photo is too large (max 5MB)",
        logout: "Log out",
        back: "Home",
      },
    };
    return (map[locale] || map.en)[key] || key;
  }

  const currentCat = categories.find((c) => c.id === categoryId);
  const inp =
    "w-full rounded-xl border border-primary-border bg-white px-4 py-3 text-[15px] outline-none transition-colors focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20";
  const label = "block text-sm font-semibold text-text-secondary mb-1.5";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-blue/20 border-t-primary-blue" />
      </div>
    );
  }

  if (!data) return null;

  const displayPhoto = photoPreview || photoUrl;

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-8 sm:py-12">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{pT("title")}</h1>
          <p className="mt-1 text-text-muted">
            {data.firstName} {data.lastName}
            {data.handyman?.isVip && (
              <span className="ml-2 inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                ★ VIP
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/${locale}`}
            className="rounded-xl border border-primary-border px-4 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:bg-bg-main"
          >
            ← {pT("back")}
          </a>
          <button
            className="rounded-xl border border-primary-border px-4 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push(`/${locale}`);
              router.refresh();
            }}
          >
            {pT("logout")}
          </button>
        </div>
      </div>

      {/* Status message */}
      {msg && (
        <div
          className={`rounded-xl px-5 py-3 text-sm font-medium transition-all ${
            msg.type === "ok"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Photo section */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border-subtle bg-white p-6 shadow-card">
            <p className={`${label} text-center`}>{pT("photoLabel")}</p>
            <div className="group relative mx-auto mt-3 h-48 w-48">
              {displayPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayPhoto}
                  alt={data.firstName}
                  className="h-full w-full rounded-2xl border-2 border-primary-border object-cover shadow-sm transition-transform group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-2xl border-2 border-dashed border-primary-border bg-bg-main">
                  <svg
                    className="h-16 w-16 text-text-muted/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary-blue/20 border-t-primary-blue" />
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="mt-4 w-full rounded-xl bg-soft-blue px-4 py-2.5 text-sm font-semibold text-primary-blue transition-colors hover:bg-primary-blue hover:text-white disabled:opacity-50"
            >
              {uploading ? pT("uploading") : pT("changePhoto")}
            </button>
          </div>
        </div>

        {/* Form section */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Info Card */}
          <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-card">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft-blue text-sm">
                👤
              </span>
              {pT("personalInfo")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>{t.auth.firstName}</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className={inp}
                />
              </div>
              <div>
                <label className={label}>{t.auth.lastName}</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className={inp}
                />
              </div>
              <div>
                <label className={label}>{t.auth.email}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className={label}>{t.auth.mobile}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inp}
                />
              </div>
            </div>
          </div>

          {/* Professional Info Card */}
          <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-card">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft-blue text-sm">
                🛠️
              </span>
              {pT("professionInfo")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>{t.auth.profession}</label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    const cat = categories.find((c) => c.id === e.target.value);
                    if (cat) setSubcategory(cat.subs[0]);
                  }}
                  className={inp}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {tr(c.name, locale)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>{t.auth.subcategory}</label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className={inp}
                >
                  {currentCat?.subs.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>{t.auth.city}</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inp}
                >
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {tr(c, locale)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>{pT("priceLabel")}</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min={0}
                  max={99999}
                  className={inp}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className={label}>{pT("bioLabel")}</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={pT("bioPlaceholder")}
                maxLength={500}
                rows={4}
                className={`${inp} resize-none`}
              />
              <p className="mt-1 text-right text-xs text-text-muted">
                {bio.length}/500
              </p>
            </div>
          </div>

          {/* Save button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-primary-blue px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md disabled:opacity-60 sm:w-auto"
          >
            {saving ? pT("saving") : pT("save")}
          </button>
        </form>
      </div>
    </main>
  );
}
