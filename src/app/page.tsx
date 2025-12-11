"use client";

import { redirect } from "next/navigation";

export default function Home() {
  // Redirect root to the dashboard/product list page
  redirect("/login");
}
