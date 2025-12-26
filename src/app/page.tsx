// src/app/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Not logged in -> go login
  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any)?.role as "admin" | "mahasiswa" | undefined;

  // Role-based landing
  if (role === "admin") redirect("/dashboard");
  if (role === "mahasiswa") redirect("/newproduct");

  // Fallback (if role missing)
  redirect("/login");
}