import { z } from "zod";
import { categories } from "@/data/categories";
import { cities } from "@/data/cities";
const name = z.string().trim().min(2).max(60);
const password = z.string().min(8).max(100);
const email = z.string().trim().toLowerCase().email();
const phone = z.string().transform((s) => s.replace(/[\s()-]/g, "")).pipe(z.string().regex(/^\+?\d{9,15}$/));
export const isEmail = (s: string) => s.includes("@");

const customer = z.object({ role: z.literal("customer"), firstName: name, lastName: name, login: z.string().trim().toLowerCase().min(5), password });
const handyman = z.object({
  role: z.literal("handyman"), firstName: name, lastName: name, email, phone, password,
  category: z.string(), sub: z.string(), city: z.string(),
});
export const registerSchema = z.discriminatedUnion("role", [customer, handyman]).superRefine((d, ctx) => {
  if (d.role === "handyman") {
    const cat = categories.find((c) => c.id === d.category);
    if (!cat) ctx.addIssue({ code: "custom", path: ["category"], message: "invalid category" });
    else if (!cat.subs.includes(d.sub)) ctx.addIssue({ code: "custom", path: ["sub"], message: "invalid subcategory" });
    if (!cities.some((c) => c.id === d.city)) ctx.addIssue({ code: "custom", path: ["city"], message: "invalid city" });
  }
});
export const loginSchema = z.object({ login: z.string().trim().toLowerCase().min(5), password: z.string().min(1).max(100) });
export const normalizeLogin = (login: string) => (isEmail(login) ? { email: login } : { phone: login.replace(/[\s()-]/g, "") });

