import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role as "admin" | "mahasiswa" | undefined;

  if (role === "admin") {
    redirect("/dashboard");
  }
  if (role === "mahasiswa") {
    redirect("/productlist");
  }
  
  redirect("/productlist");
}