import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { uploadPhoto } from "@/lib/s3";

export async function POST(req: NextRequest) {
  const r = await requireApiRole("HANDYMAN");
  if (!r.ok) return r.res;
  const formData = await req.formData();
  const file = formData.get("photo");
  if (!(file instanceof File) || !file.type.startsWith("image/")) return NextResponse.json({ error: "invalid_file" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  const key = `portfolio/${r.user.id}/${Date.now()}-${crypto.randomUUID()}.${file.name.split(".").pop() || "jpg"}`;
  const url = await uploadPhoto(Buffer.from(await file.arrayBuffer()), key, file.type);
  const profile = await prisma.handymanProfile.findUniqueOrThrow({ where: { userId: r.user.id }, select: { id: true } });
  const image = await prisma.portfolioImage.create({ data: { handymanProfileId: profile.id, url }, select: { id: true, url: true } });
  return NextResponse.json(image, { status: 201 });
}
