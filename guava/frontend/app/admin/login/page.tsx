"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@guavastores.com");
  const [password, setPassword] = useState("admin123");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // No real authentication yet—just a placeholder interaction.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3FCE1] via-white to-[#E2F0CB] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl border border-gray-100 p-8 space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-14 w-14 rounded-2xl bg-[#A7E059]/20 text-[#4B6A11] flex items-center justify-center">
            <ShieldCheckIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">Guavastores Admin</p>
            <h1 className="text-2xl font-semibold text-gray-900">Sign in to continue</h1>
            <p className="text-sm text-gray-500 mt-1">
              Use the placeholder credentials below, then proceed to the dashboard.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          <p className="font-medium text-gray-900 mb-2">Demo credentials</p>
          <p>Email: <span className="font-semibold">admin@guavastores.com</span></p>
          <p>Password: <span className="font-semibold">admin123</span></p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full bg-[#A7E059] hover:bg-[#92D343] text-gray-900 font-semibold">
            Sign in (Mock)
          </Button>
        </form>

        <div className="text-center">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center w-full py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Continue to dashboard →
          </Link>
        </div>
        <p className="text-xs text-center text-gray-400">
          Authentication isn&apos;t wired yet. This screen is purely visual.
        </p>
      </div>
    </div>
  );
}

