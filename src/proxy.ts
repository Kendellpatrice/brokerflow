import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("session");
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/login";
  const isInvitePath = pathname.startsWith("/invite/");
  const isApiRoute = pathname.startsWith("/api/");

  if (!session && !isLoginPage && !isInvitePath && !isApiRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (session && isLoginPage) {
    const isBroker = session.value === "broker";
    const hasUid = request.cookies.has("uid");
    // For client sessions, only redirect away from login if uid cookie is also present.
    // If uid is missing (e.g. expired or stale session), let them re-authenticate
    // rather than bouncing between /login and the fact-find layout redirect.
    if (isBroker || hasUid) {
      const url = request.nextUrl.clone();
      url.pathname = isBroker ? "/broker" : "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
