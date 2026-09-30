import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";
import { COOKIE_NAME, verifyJwt } from "@/lib/auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const locale = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (!locale) { req.nextUrl.pathname = `/${defaultLocale}${pathname}`; return NextResponse.redirect(req.nextUrl); }

  // Authentication gate for protected areas. Fine-grained role checks happen server-side (requirePageRole / requireApiRole).
  if (pathname.startsWith(`/${locale}/dashboard`)) {
    const session = await verifyJwt(req.cookies.get(COOKIE_NAME)?.value);
    if (!session) { req.nextUrl.pathname = `/${locale}/signin/customer`; return NextResponse.redirect(req.nextUrl); }
  }
}
export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
