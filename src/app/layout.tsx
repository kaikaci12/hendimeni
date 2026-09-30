import "./globals.css";
export const metadata = { title: "ProLink Georgia", description: "Find trusted handymen in Georgia" };
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html><body className="min-h-screen bg-bg-main font-sans text-text-primary antialiased">{children}</body></html>);
}
