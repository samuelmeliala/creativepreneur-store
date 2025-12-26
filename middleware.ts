// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as "admin" | "mahasiswa" | undefined;

    // mahasiswa can ONLY access /newproduct (and "/" for role-based redirect landing)
    if (role === "mahasiswa") {
      const allowed = pathname === "/" || pathname.startsWith("/newproduct");
      if (!allowed) {
        return NextResponse.redirect(new URL("/newproduct", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)"],
};