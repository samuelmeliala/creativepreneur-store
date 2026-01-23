// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/productlist"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as "admin" | "mahasiswa" | undefined;

    if (!role) {
      return NextResponse.next();
    }

    // mahasiswa can ONLY access the public product list
    if (role === "mahasiswa") {
      const allowed = PUBLIC_PATHS.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
      );
      if (!allowed) {
        return NextResponse.redirect(new URL("/productlist", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        const isPublic = PUBLIC_PATHS.some(
          (path) => pathname === path || pathname.startsWith(`${path}/`)
        );
        if (isPublic) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)"],
};
