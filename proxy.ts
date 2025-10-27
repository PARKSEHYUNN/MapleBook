// proxy.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req: NextRequest) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthRoute =
    nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  if (isLoggedIn) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});
