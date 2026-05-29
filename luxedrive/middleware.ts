import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'ld_session'
const PROTECTED = ['/account', '/checkout']

function hasValidToken(token: string | undefined): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    return !!(payload.id && payload.exp && payload.exp * 1000 > Date.now())
  } catch {
    return false
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PROTECTED.some(p => pathname.startsWith(p))) {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!hasValidToken(token)) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*'],
}
