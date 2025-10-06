// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const locales = ["en", "uz"];
const defaultLocale = "en";

// Bu yo‘llar locale qo‘shilmasdan ishlashi kerak (rootda qoladi)
const NO_LOCALE_REGEXES = [
  /^\/sitemap\.xml$/,
  /^\/sitemap-\d+\.xml$/, // next-sitemap bo‘lsa, ko‘p bo‘linishi mumkin
  /^\/server-sitemap\.xml$/, // agar dynamic sitemap ishlatsang
  /^\/robots\.txt$/,
  /^\/favicon(\.ico|\.png)?$/,
];

function isNoLocalePath(pathname: string) {
  return NO_LOCALE_REGEXES.some((re) => re.test(pathname));
}

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;

  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameLocale) return pathnameLocale;

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferredLocale = locales.find((locale) =>
      acceptLanguage.toLowerCase().includes(locale)
    );
    if (preferredLocale) return preferredLocale;
  }

  return defaultLocale;
}

function getPathnameWithoutLocale(pathname: string): string {
  const segments = pathname.split("/");
  if (locales.includes(segments[1])) {
    return "/" + segments.slice(2).join("/");
  }
  return pathname;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 0) Bu yo‘llarni butunlay chetlab o‘t
  if (isNoLocalePath(pathname)) {
    return NextResponse.next();
  }

  // 1) Next.js ichki assetlari va auth’dan tashqari API’larni o‘tkazib yubor
  if (
    pathname.startsWith("/_next/") ||
    (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) ||
    pathname.startsWith("/public/")
  ) {
    return NextResponse.next();
  }

  // 2) Agar locale yo‘q bo‘lsa — locale qo‘shib redirect qil
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // 3) Auth tekshirishlari
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);
  const currentLocale = pathname.split("/")[1];

  const publicPaths = ["/", "/login", "/register"];
  const isPublicPath =
    publicPaths.some((p) => pathnameWithoutLocale === p) ||
    pathnameWithoutLocale.startsWith("/api/auth/");

  if (isPublicPath) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const protectedPaths = ["/dashboard", "/profile", "/create-post"];
  const isProtected = protectedPaths.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );

  if (isProtected && !token) {
    const url = new URL(`/${currentLocale}/login`, request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (
    (pathnameWithoutLocale === "/login" ||
      pathnameWithoutLocale === "/register") &&
    token
  ) {
    return NextResponse.redirect(new URL(`/${currentLocale}`, request.url));
  }

  return NextResponse.next();
}

// Muvofiq matcher: sitemap/robots ni matcher’dan ham chiqaramiz
export const config = {
  matcher: [
    // sitemap/robots/server-sitemap/favicon va _next/static|image, api/auth ni chetlab o‘tamiz
    "/((?!_next/static|_next/image|favicon.png|favicon.ico|public|api/auth|sitemap\\.xml|sitemap-\\d+\\.xml|server-sitemap\\.xml|robots\\.txt).*)",
  ],
};
