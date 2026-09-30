import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { registerSchema, normalizeLogin } from "@/lib/auth/validation";

function isUniqueConstraintError(error: unknown): error is { code: "P2002" } {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function POST(req: Request) {
  const parsed = registerSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "validation", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  const d = parsed.data;
  const contact = d.role === "customer" ? normalizeLogin(d.login) : { email: d.email, phone: d.phone };
  if (d.role === "customer" && "phone" in contact && !/^\+?\d{9,15}$/.test(contact.phone!))
    return NextResponse.json({ error: "validation", issues: { login: ["invalid"] } }, { status: 400 });
  try {
    const user = await prisma.user.create({
      data: {
        firstName: d.firstName, lastName: d.lastName, ...contact,
        passwordHash: await hashPassword(d.password),
        role: d.role === "handyman" ? "HANDYMAN" : "CUSTOMER", // role is never taken from client as ADMIN
        ...(d.role === "handyman" && { handyman: { create: { categoryId: d.category, subcategory: d.sub, city: d.city } } }),
      },
      select: { id: true, firstName: true, lastName: true, role: true },
    });
    await createSession(user);
    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    if (isUniqueConstraintError(e)) return NextResponse.json({ error: "already_exists" }, { status: 409 });
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
