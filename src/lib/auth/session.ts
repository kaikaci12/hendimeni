import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { COOKIE_NAME, SESSION_TTL, signJwt, verifyJwt, type Role, type SessionPayload } from "./jwt";
import { prisma } from "@/lib/db";

export async function createSession(user: { id: string; role: Role }) {
  const token = await signJwt({ sub: user.id, role: user.role });
  (await cookies()).set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_TTL });
}
export async function destroySession() { (await cookies()).delete(COOKIE_NAME); }
export async function getSession(): Promise<SessionPayload | null> {
  return verifyJwt((await cookies()).get(COOKIE_NAME)?.value);
}
/** Current user from DB (role is re-read so demotions/deletions take effect immediately). */
export async function getCurrentUser() {
  const s = await getSession();
  if (!s) return null;
  return prisma.user.findUnique({ where: { id: s.sub }, select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true, handyman: { select: { id: true, categoryId: true, subcategories: true, portfolio: true, city: true, bio: true, photoUrl: true, price: true, isVip: true } } } });
}
/** Server components: redirect to sign-in / home if not allowed. */
export async function requirePageRole(locale: string, ...roles: Role[]) {
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/signin/customer`);
  if (roles.length && !roles.includes(user.role)) redirect(`/${locale}`);
  return user;
}
/** Route handlers: `const r = await requireApiRole("HANDYMAN"); if (!r.ok) return r.res;` */
export async function requireApiRole(...roles: Role[]) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, res: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  if (roles.length && !roles.includes(user.role)) return { ok: false as const, res: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  return { ok: true as const, user };
}
