import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of supported languages
const languages = ['en', 'jp']
const defaultLanguage = 'en'

export function middleware(request: NextRequest) {
  console.log('Middleware - Current Pathname:', request.nextUrl.pathname)

  // Check if there is any supported language in the pathname
  const pathname = request.nextUrl.pathname

  // Check if the pathname already has a language
  const pathnameHasLanguage = languages.some(
    lang => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  )

  // If pathname already has a supported language, continue normally
  if (pathnameHasLanguage) return

  // Determine language from Accept-Language header or use default
  const language =
    request.headers.get('accept-language')?.split(',')[0].split('-')[0] || defaultLanguage

  // Validate and select language (fallback to default if not supported)
  const selectedLanguage = languages.includes(language) ? language : defaultLanguage

  // Redirect to the same path with language
  return NextResponse.redirect(new URL(`/${selectedLanguage}${pathname}`, request.url))
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static assets)
    '/((?!_next/static|_next/image|api|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
