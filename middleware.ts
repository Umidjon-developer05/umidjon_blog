import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
	// Get the pathname
	const path = request.nextUrl.pathname

	// Define public paths that don't require authentication
	const publicPaths = ['/', '/login', '/register', '/api/auth']
	const isPublicPath = publicPaths.some(
		publicPath =>
			path === publicPath ||
			path.startsWith('/api/auth/') ||
			path.startsWith('/_next/')
	)

	// Check if the path is public
	if (isPublicPath) {
		return NextResponse.next()
	}

	// Get the token - this is more compatible with Edge runtime
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	})

	// Protected routes that require authentication
	const isProtectedPath = ['/dashboard', '/profile', '/create-post'].some(
		prefix => path.startsWith(prefix)
	)

	// Check if the path is protected and user is not authenticated
	if (isProtectedPath && !token) {
		const url = new URL('/login', request.url)
		url.searchParams.set('callbackUrl', path)
		return NextResponse.redirect(url)
	}

	// If user is already logged in and tries to access login/register page, redirect to home
	if ((path === '/login' || path === '/register') && token) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public (public files)
		 */
		'/((?!_next/static|_next/image|favicon.ico|public).*)',
	],
}
