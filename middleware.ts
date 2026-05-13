import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

  if (isAuthPage) return NextResponse.next();

  // ⚠️ TEMP FIX: don't rely on cookies for Amplify v6
  // let frontend handle auth redirect instead

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|auth).*)"],
};