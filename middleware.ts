import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that anyone can access without being logged in
const PUBLIC_PATHS = ["/login", "/api/auth"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow public paths and static files
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  // 2. Get JWT token from NextAuth (contains role)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 3. If not logged in → redirect to /login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as "admin" | "mahasiswa" | undefined;

  // 4. Role-based access:
  //    mahasiswa can ONLY access /newproduct
  if (role === "mahasiswa") {
    const allowedForMahasiswa = ["/newproduct"];

    const isAllowed = allowedForMahasiswa.some((p) =>
      pathname.startsWith(p)
    );

    if (!isAllowed) {
      // If mahasiswa tries /dashboard, /productlist, /print, etc.
      return NextResponse.redirect(new URL("/newproduct", req.url));
    }
  }

  // 5. admin can access everything
  return NextResponse.next();
}

// 6. Apply middleware to (almost) all routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};