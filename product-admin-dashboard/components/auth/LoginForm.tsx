"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { loginUser } from "@/services/authService";
import { setAuth } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (isSubmitting) return;

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const data = await loginUser({ username: username.trim(), password });
      const token = data.accessToken ?? data.token ?? "";
      setAuth(token, {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
      });
      router.replace("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="mb-6 flex flex-col items-center gap-1.5 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">
          <LogIn size={18} />
        </div>
        <h1 className="text-lg font-semibold text-slate-900">Product Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Sign in to manage products</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-slate-400">
        Demo credentials: <span className="font-medium text-slate-500">emilys</span> /{" "}
        <span className="font-medium text-slate-500">emilyspass</span>
      </p>
    </div>
  );
}
