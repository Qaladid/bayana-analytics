import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // IMPORTANT: the entire Supabase client construction AND getUser() must be
  // inside the try/catch. If createServerClient() throws (e.g. undefined env
  // vars at Edge cold-start, malformed URL), the error would propagate
  // unhandled out of middleware, causing Vercel's Edge runtime to fall through
  // to the SSR handler — serving the dashboard HTML to unauthenticated users
  // (fail-open). Wrapping everything ensures we always fail closed: any error
  // → user = null → redirect to /auth/login.
  let user = null
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // Write to both the request and response so the refreshed token
            // propagates to both the current handler and the browser.
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )
    // getUser() refreshes the session token if expired.
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Any failure (missing env vars, network error, invalid token) →
    // fall through with user = null (unauthenticated behaviour, fail closed)
  }

  const { pathname } = request.nextUrl

  // Unauthenticated users cannot access /dashboard
  if (!user && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Authenticated users don't need the login page
  if (user && pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
