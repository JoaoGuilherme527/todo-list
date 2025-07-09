// import { NextRequest, NextResponse } from "next/server"

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./app/api/auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware"

const publicRoutes = [
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/dashboard", whenAuthenticated: "next" },
  { path: "/project", whenAuthenticated: "next" },
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login"

// export async function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname
//   const publicRoute = publicRoutes.find(route => path.includes(route.path))
//   const authToken =
//     request.cookies.get("next-auth.session-token")?.value ||
//     request.cookies.get("__Secure-next-auth.session-token")?.value

//   if (!authToken && publicRoute) {
//     return NextResponse.next()
//   }

//   if (!authToken && !publicRoute) {
//     console.log('AAAAAAAAAAAA');
//     const redirectUrl = request.nextUrl.clone()

//     redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

//     return NextResponse.redirect(redirectUrl)
//   }

//   if (authToken && publicRoute && publicRoute.whenAuthenticated === "redirect") {
//     const redirectUrl = request.nextUrl.clone()

//     redirectUrl.pathname = '/dashboard'

//     return NextResponse.redirect(redirectUrl)
//   }

//   if (authToken && !publicRoute) {
//     return NextResponse.next()
//   }

//   return NextResponse.next()
// }

// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname
//   // const publicRoute = publicRoutes.find(route => path.includes(route.path))

//   if (path ===  "/") {
//     const redirectUrl = request.nextUrl.clone()

//     redirectUrl.pathname = '/dashboard'

//     return NextResponse.redirect(redirectUrl)
//   }


//   return NextResponse.next()
// }

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/(.*)",
    "/dashboard(.*)",
    "/project(.*)",
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}