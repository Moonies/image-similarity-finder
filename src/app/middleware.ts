import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of supported languages
const languages = ['en', 'ja']

export function middleware(request: NextRequest) {
  // Check if there is any supported language in the pathname
  const pathname = request.nextUrl.pathname

  // Check if the pathname already has a language
  const pathnameHasLanguage = languages.some(
    lang => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  )

  if (pathnameHasLanguage) return

  // Redirect if there is no language
  const language = request.headers.get('accept-language')?.split(',')[0].split('-')[0] || 'en'

  // Check if the language is supported
  const defaultLanguage = languages.includes(language) ? language : 'en'

  // Redirect to the same path with language
  return NextResponse.redirect(new URL(`/${defaultLanguage}${pathname}`, request.url))
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}
