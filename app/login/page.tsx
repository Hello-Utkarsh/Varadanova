"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { EyeIcon } from "@/components/Icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("aarav.mehta@verdanova.in");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-900 font-sans">
      {/* Left Column: Visual Brand Hero matching Image 2 */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#021422] via-[#04243b] to-[#02182b] p-8 sm:p-16 flex flex-col justify-between relative overflow-hidden text-white border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Glow orb in background */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Logo */}
        <div className="relative z-10">
          <Logo variant="dark" />
        </div>

        {/* Center Artwork & Tagline */}
        <div className="my-12 relative z-10 space-y-6 max-w-lg">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Welcome Back!
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed">
            Manage waste risks, track progress, and build a safer, more sustainable environment.
          </p>

          {/* Glowing recycle bin illustration container */}
          <div className="relative pt-6 flex items-center justify-center">
            <div className="w-56 h-56 rounded-3xl bg-gradient-to-tr from-cyan-900/60 to-emerald-950/60 border border-cyan-400/30 flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm relative group">
              <div className="w-24 h-24 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-4xl shadow-inner animate-pulse">
                ♻️
              </div>
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest mt-4">
                WasteRisk 360
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 text-xs text-slate-500">
          Smarter Waste • Safer Tomorrow • ISO 31000 & FMEA Framework
        </div>
      </div>

      {/* Right Column: Clean Login Form matching Image 2 */}
      <div className="lg:w-1/2 bg-white flex flex-col justify-center p-8 sm:p-16 lg:p-24">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Login to your account
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  <EyeIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="font-semibold text-cyan-600 hover:text-cyan-700">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              Log in
            </button>

            {/* Quick Demo Login Shortcut */}
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full py-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-all flex items-center justify-center gap-1.5"
            >
              ⚡ Instant Demo Access (as Environmental Officer)
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs text-slate-400">or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <span className="font-bold text-blue-500">G</span> Google
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <span className="font-bold text-amber-500">田</span> Microsoft
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/" className="font-bold text-cyan-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
