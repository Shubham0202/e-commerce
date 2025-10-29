// src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data?.error || "Login failed");
        setBusy(false);
        return;
      }
      const role = data.role as string;
      if (role === "admin") router.push("/admin");
      else router.push("/dashboard");
    } catch (e: any) {
      console.error(e);
      setErr("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center rounded-full bg-primary p-3">
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none" className="text-white" aria-hidden>
              <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">Sign in</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Enter username and password</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            {err && <div className="text-sm text-rose-600">{err}</div>}

            <label className="block">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="pl-10 pr-3 py-2 w-full rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>
            </label>

            <label className="block">
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="pl-10 pr-3 py-2 w-full rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>
            </label>

            <button disabled={busy} className="w-full rounded-lg bg-blue-500   text-white py-2 text-sm font-medium hover:opacity-95">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-4 text-sm text-slate-500">
            Demo accounts: <br />
            <strong>admin / admin123</strong> (admin) — <strong>user / user123</strong> (user)
          </div>
        </div>
      </div>
    </div>
  );
}
