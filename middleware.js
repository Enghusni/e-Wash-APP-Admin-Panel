import { NextResponse } from "next/server";

const cookieName = "rs-account";

function getCookieValue(cookie, name) {
  const value = `; ${cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export async function middleware(request) {
  const cookie = request.headers.get("cookie");
  const token = cookie ? getCookieValue(cookie, cookieName) : null;
  const path = request.nextUrl.pathname;

  console.log(token);

  // If user is not authenticated and trying to access a non-auth page, redirect to login
  if (!token && !path.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If user is authenticated and trying to access an auth page, redirect to home
  if (token && path.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Proceed to the next middleware or route handler
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
