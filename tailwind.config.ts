import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    fontFamily: { sans: ["Inter", "Noto Sans Georgian", "sans-serif"] },
    colors: {
      "text-primary": "#1E293B", "text-secondary": "#475569", "text-muted": "#64748B",
      "primary-blue": "#3B82F6", "primary-hover": "#2563EB", "soft-blue": "#F0F9FF",
      "primary-border": "#E2E8F0", "border-subtle": "#F1F5F9", "bg-main": "#F8FAFC",
    },
    boxShadow: { card: "0 4px 12px -2px rgba(15,23,42,.05)", "hover-card": "0 12px 32px -4px rgba(15,23,42,.08)" },
  } },
} satisfies Config;
