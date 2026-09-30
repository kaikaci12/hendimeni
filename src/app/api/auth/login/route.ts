import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DUMMY_HASH, verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { loginSchema, normalizeLogin } from "@/lib/auth/validation";

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "validation" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: normalizeLogin(parsed.data.login) as { email: string } | { phone: string } });
  const ok = await verifyPassword(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) return NextResponse.json({ error: "invalid_credentials" }, { status: 401 }); // same answer for both cases
  await createSession(user);
  return NextResponse.json({ user: { id: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role } });
}
