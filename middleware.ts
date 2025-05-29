import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const locales = ['en', 'uz']
const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
	const pathname = request.nextUrl.pathname

	// 1. Pathname'da locale borligini tekshirish
	const pathnameLocale = locales.find(
		locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	)
	if (pathnameLocale) return pathnameLocale

	// 2. Cookie'da saqlangan locale'ni tekshirish
	const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
	if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale

	// 3. Accept-Language header orqali aniqlash
	const acceptLanguage = request.headers.get('accept-language')
	if (acceptLanguage) {
		const preferredLocale = locales.find(locale =>
			acceptLanguage.toLowerCase().includes(locale)
		)
		if (preferredLocale) return preferredLocale
	}

	// 4. Standart til
	return defaultLocale
}

function getPathnameWithoutLocale(pathname: string): string {
	// Remove locale from pathname
	const segments = pathname.split('/')
	if (locales.includes(segments[1])) {
		return '/' + segments.slice(2).join('/')
	}
	return pathname
}

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	// Skip internal Next.js paths and API routes (except auth)
	if (
		pathname.startsWith('/_next/') ||
		(pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) ||
		pathname.includes('/favicon.ico') ||
		pathname.startsWith('/public/')
	) {
		return NextResponse.next()
	}

	// Check if pathname already has a locale
	const pathnameHasLocale = locales.some(
		locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	)

	// If no locale in pathname, redirect to locale-prefixed path
	if (!pathnameHasLocale) {
		const locale = getLocale(request)
		const newUrl = new URL(`/${locale}${pathname}`, request.url)
		return NextResponse.redirect(newUrl)
	}

	// Get the pathname without locale for auth checks
	const pathnameWithoutLocale = getPathnameWithoutLocale(pathname)
	const currentLocale = pathname.split('/')[1]

	// Define public paths that don't require authentication (without locale)
	const publicPaths = ['/', '/login', '/register']
	const isPublicPath =
		publicPaths.some(publicPath => pathnameWithoutLocale === publicPath) ||
		pathnameWithoutLocale.startsWith('/api/auth/')

	// Check if the path is public
	if (isPublicPath) {
		return NextResponse.next()
	}

	// Get the token for authentication
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	})

	// Protected routes that require authentication (without locale)
	const protectedPaths = ['/dashboard', '/profile', '/create-post']
	const isProtectedPath = protectedPaths.some(prefix =>
		pathnameWithoutLocale.startsWith(prefix)
	)

	// Check if the path is protected and user is not authenticated
	if (isProtectedPath && !token) {
		const url = new URL(`/${currentLocale}/login`, request.url)
		url.searchParams.set('callbackUrl', pathname)
		return NextResponse.redirect(url)
	}

	// If user is already logged in and tries to access login/register page, redirect to home
	if (
		(pathnameWithoutLocale === '/login' ||
			pathnameWithoutLocale === '/register') &&
		token
	) {
		return NextResponse.redirect(new URL(`/${currentLocale}`, request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)'],
}
