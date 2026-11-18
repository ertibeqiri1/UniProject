import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/wishlist']
const ADMIN_ROUTES     = ['/admin']

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  const isAdmin     = ADMIN_ROUTES.some((r) => pathname.startsWith(r))

  if ((isProtected || isAdmin) && !token) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  if (isAdmin && token?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/wishlist/:path*', '/admin/:path*'],
}
