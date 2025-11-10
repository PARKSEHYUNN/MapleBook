// src/middleware.ts

import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;

  const isLoggedIn = !!session;
  const userAgreedToTerms = session?.user?.termsAgreed;

  const protectedRoutes = ["/mypage"];
  const authRoutes = ["/login"];
  const termsRoute = "/terms";

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isTermRoute = pathname.startsWith(termsRoute);

  if (isLoggedIn && !userAgreedToTerms) {
    if (isTermRoute) return NextResponse.next();

    return NextResponse.redirect(new URL(termsRoute, req.url));
  }

  if (isLoggedIn && isAuthRoute)
    return NextResponse.redirect(new URL("/mypage", req.url));

  if (!isLoggedIn && isProtectedRoute)
    return NextResponse.redirect(new URL("/login", req.url));

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|logo.svg|google.svg).*)",
  ],
};
