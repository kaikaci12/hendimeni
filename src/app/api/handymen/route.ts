import { NextRequest, NextResponse } from "next/server";
import { searchHandymen, type Filters } from "@/lib/handymen";

function numberParam(value: string | null): number | undefined {
  if (value === null || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const vipParam = p.get("vip");
  const filters: Filters = {
    q: p.get("q") ?? undefined,
    category: p.get("category") ?? p.get("categoryId") ?? undefined,
    sub: p.get("sub") ?? p.get("subcategory") ?? undefined,
    city: p.get("city") ?? undefined,
    minPrice: numberParam(p.get("minPrice")),
    maxPrice: numberParam(p.get("maxPrice")),
    ...(vipParam === "true" || vipParam === "false" ? { vip: vipParam === "true" } : {}),
  };
  return NextResponse.json(await searchHandymen(filters));
}
