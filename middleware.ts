// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    const role = token?.role as "admin" | "mahasiswa" | undefined;

    // mahasiswa can ONLY access /newproduct
    if (role === "mahasiswa") {
      const allowedForMahasiswa = ["/newproduct"];

      const isAllowed = allowedForMahasiswa.some((p) =>
        pathname.startsWith(p)
      );

      if (!isAllowed) {
        // redirect mahasiswa away from any other page (dashboard, productlist, print, etc.)
        return NextResponse.redirect(new URL("/newproduct", req.url));
      }
    }

    // admin can access everything
    return NextResponse.next();
  },
  {
    callbacks: {
      // If there's no token, user is not logged in → NextAuth will send them to /login (since you set pages.signIn = "/login")
      authorized: ({ token }) => !!token,
    },
  }
);

// Apply middleware to all routes except static, login, and auth API
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|login|api/auth).*)",
  ],
};
