import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { categories } from "@/data/categories";
import { cities } from "@/data/cities";

const updateSchema = z
  .object({
    firstName: z.string().trim().min(2).max(60).optional(),
    lastName: z.string().trim().min(2).max(60).optional(),
    email: z.string().trim().toLowerCase().email().optional(),
    phone: z
      .string()
      .transform((s) => s.replace(/[\s()-]/g, ""))
      .pipe(z.string().regex(/^\+?\d{9,15}$/))
      .optional(),
    categoryId: z.string().optional(),
    subcategory: z.string().optional(),
    city: z.string().optional(),
    bio: z.string().max(500).optional(),
    price: z.number().int().min(0).max(99999).optional(),
  })
  .superRefine((d, ctx) => {
    if (d.categoryId) {
      const cat = categories.find((c) => c.id === d.categoryId);
      if (!cat) ctx.addIssue({ code: "custom", path: ["categoryId"], message: "invalid category" });
      else if (d.subcategory && !cat.subs.includes(d.subcategory))
        ctx.addIssue({ code: "custom", path: ["subcategory"], message: "invalid subcategory" });
    }
    if (d.city && !cities.some((c) => c.id === d.city))
      ctx.addIssue({ code: "custom", path: ["city"], message: "invalid city" });
  });

export async function GET() {
  const r = await requireApiRole("HANDYMAN");
  if (!r.ok) return r.res;

  const user = await prisma.user.findUnique({
    where: { id: r.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      handyman: true,
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const r = await requireApiRole("HANDYMAN");
  if (!r.ok) return r.res;

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );

  const d = parsed.data;

  // Separate user fields from handyman profile fields
  const userUpdate: Record<string, unknown> = {};
  const profileUpdate: Record<string, unknown> = {};

  if (d.firstName) userUpdate.firstName = d.firstName;
  if (d.lastName) userUpdate.lastName = d.lastName;
  if (d.email !== undefined) userUpdate.email = d.email;
  if (d.phone !== undefined) userUpdate.phone = d.phone;

  if (d.categoryId) profileUpdate.categoryId = d.categoryId;
  if (d.subcategory) profileUpdate.subcategory = d.subcategory;
  if (d.city) profileUpdate.city = d.city;
  if (d.bio !== undefined) profileUpdate.bio = d.bio;
  if (d.price !== undefined) profileUpdate.price = d.price;

  // Run both updates in a transaction
  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: r.user.id },
      data: {
        ...userUpdate,
        ...(Object.keys(profileUpdate).length > 0 && {
          handyman: { update: profileUpdate },
        }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        handyman: true,
      },
    }),
  ]);

  return NextResponse.json(updatedUser);
}
