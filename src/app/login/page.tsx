// app/login/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
      callbackUrl: "/dashboard", // admin → /dashboard, mahasiswa will be redirected to /addproduct by middleware
    });

    if (res?.ok && res.url) {
      router.push(res.url);
    } else {
      console.error(res?.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8"
      >
        <h1 className="text-xl font-semibold mb-4 text-center">
          Login Dashboard
        </h1>

        {error && (
          <p className="mb-3 text-sm text-red-600">
            Invalid username or password
          </p>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          className="w-full mb-4 border rounded px-3 py-2 text-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          className="w-full mb-6 border rounded px-3 py-2 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}