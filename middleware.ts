import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Create a response object
  const res = NextResponse.next()

  // Create a Supabase client for the middleware
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    console.error("Middleware auth error:", error)
  }

  const pathname = req.nextUrl.pathname
  const host = req.headers.get("host") || ""

  console.log(`Middleware processing: ${host}${pathname}, Session exists: ${!!session}`)

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.includes("/favicon.ico") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)
  ) {
    return res
  }

  // Define protected routes that require authentication
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/bets") ||
    pathname.startsWith("/wallet") ||
    pathname.startsWith("/groups") ||
    pathname.startsWith("/my-bets")

  // Define auth routes (login/signup)
  const isAuthRoute = pathname === "/login" || pathname === "/signup"

  // Define public routes that don't require auth checks
  const isPublicRoute = pathname === "/" || pathname === "/auth/callback"

  // If accessing a protected route without a session, redirect to login
  if (isProtectedRoute && !session) {
    console.log(`Redirecting to login: ${pathname} (no session)`)
    const redirectUrl = new URL("/login", req.url)
    // Store the original URL to redirect back after login
    redirectUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing login/signup pages with a session, redirect to dashboard
  if (isAuthRoute && session) {
    console.log(`Redirecting to dashboard: ${pathname} (has session)`)
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Special handling for root path "/"
  if (pathname === "/" && session) {
    console.log("Root path with session, redirecting to dashboard")
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  // Match all paths except static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
