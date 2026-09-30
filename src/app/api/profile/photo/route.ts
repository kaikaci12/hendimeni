import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { uploadPhoto } from "@/lib/s3";

export async function POST(req: NextRequest) {
  const r = await requireApiRole("HANDYMAN");
  if (!r.ok) return r.res;

  const formData = await req.formData();
  const file = formData.get("photo") as File | null;
  if (!file || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "invalid_file" }, { status: 400 });
  }

  // Limit file size to 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const key = `photos/${r.user.id}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const photoUrl = await uploadPhoto(buffer, key, file.type);

  // Save the URL to the handyman profile
  await prisma.handymanProfile.update({
    where: { userId: r.user.id },
    data: { photoUrl },
  });

  return NextResponse.json({ photoUrl });
}
