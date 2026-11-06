"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  AlertTriangleIcon,
  LeafIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from "@/components/Icons";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-[#021321] text-white font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Navigation matching Image 1 */}
      <nav className="relative z-30 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Logo variant="dark" />

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <Link href="/" className="text-cyan-400 border-b-2 border-cyan-400 pb-1">
            Home
          </Link>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#standards" className="hover:text-white transition-colors">
            Solutions
          </a>
          <Link href="/reports" className="hover:text-white transition-colors">
            About
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-full border border-slate-700 hover:border-slate-500 text-xs font-bold text-white transition-colors hidden sm:block"
          >
            Sign up
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-400/25 flex items-center gap-1.5"
          >
            Get Started <ChevronRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section matching Image 1 */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 pt-10 pb-20 lg:pt-16 lg:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline and Value Props */}
        <div className="lg:col-span-6 space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            SMARTER WASTE • SAFER TOMORROW
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
            Turn Waste Data <br />
            into{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Risk Insights.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
            A risk-management platform for waste handling that helps organisations identify, assess and mitigate potential risks — for a cleaner, safer and more sustainable future.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm shadow-xl shadow-cyan-400/25 transition-all flex items-center gap-2"
            >
              Get Started <ChevronRightIcon className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="px-7 py-3.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm transition-all flex items-center gap-2.5 backdrop-blur"
            >
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-black">
                ▶
              </span>
              See Demo
            </Link>
          </div>

          {/* Bottom 3 metrics pills matching Image 1 */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <LeafIcon className="w-4 h-4" />
                <span className="text-2xl font-black text-white">12+</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Risk Parameters</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <ShieldCheckIcon className="w-4 h-4" />
                <span className="text-2xl font-black text-white">3×</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Faster Decisions</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <CheckCircleIcon className="w-4 h-4" />
                <span className="text-2xl font-black text-white">100%</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Sustainability</p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Mockup preview matching Image 1 */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl p-4 sm:p-6 backdrop-blur-xl group hover:border-cyan-400/50 transition-all duration-300">
            {/* Window control dots */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 font-mono text-[11px] text-cyan-400 font-semibold">
                  app.verdanova.in/dashboard
                </span>
              </div>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full">
                Interactive Preview
              </span>
            </div>

            {/* Mockup Dashboard content */}
            <div className="mt-4 space-y-4">
              {/* Header preview */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Good Morning,</h3>
                  <p className="text-[11px] text-slate-400">Here&apos;s today&apos;s waste risk overview.</p>
                </div>
                <span className="text-[11px] font-semibold bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                  Campus A ▾
                </span>
              </div>

              {/* Mini Stats row */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Total Risks</span>
                  <span className="text-lg font-black text-white">12</span>
                  <span className="text-[9px] text-red-400 block">↑ 7%</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">High Risks</span>
                  <span className="text-lg font-black text-red-400">3</span>
                  <span className="text-[9px] text-red-400 block">↑ 1</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Mitigations</span>
                  <span className="text-lg font-black text-emerald-400">8</span>
                  <span className="text-[9px] text-emerald-400 block">↑ 2</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Compliance</span>
                  <span className="text-lg font-black text-cyan-400">92%</span>
                  <span className="text-[9px] text-cyan-400 block">ISO 31000</span>
                </div>
              </div>

              {/* Heatmap & Top Risks preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Mini Heatmap */}
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 space-y-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>Risk Heatmap</span>
                    <span className="text-cyan-400">This Month</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 h-20">
                    {[
                      "bg-amber-300", "bg-orange-300", "bg-orange-400", "bg-red-400", "bg-red-500",
                      "bg-emerald-300", "bg-amber-200", "bg-orange-300", "bg-red-400", "bg-red-500",
                      "bg-emerald-200", "bg-emerald-300", "bg-amber-200", "bg-orange-300", "bg-orange-400",
                      "bg-emerald-100", "bg-emerald-200", "bg-emerald-300", "bg-amber-200", "bg-amber-300"
                    ].map((c, i) => (
                      <div key={i} className={`rounded ${c} opacity-90 relative`}>
                        {i === 3 && (
                          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white bg-red-600 rounded">
                            🔥
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini Top Risks */}
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 space-y-2">
                  <span className="text-[11px] font-bold block">Top Priority Hazards</span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-lg">
                      <span className="text-slate-200 truncate">Fire at storage</span>
                      <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-bold">High</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-lg">
                      <span className="text-slate-200 truncate">Hazardous chem spill</span>
                      <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-bold">High</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-lg">
                      <span className="text-slate-200 truncate">Mixed waste contamination</span>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">Med</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Launch CTA */}
              <Link
                href="/dashboard"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-md transition-all"
              >
                Open Full Interactive Workspace →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Connected Modules Section (PDF Section 2) */}
      <section id="features" className="py-20 bg-[#03192b] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Core Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              Four Connected Decision-Support Modules
            </h2>
            <p className="text-slate-400 text-sm">
              Bridging on-the-ground Gemba waste audits with ISO 31000 quantitative risk scoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-base font-bold text-white">Evidence Module</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log granular audit observations (1 item into 1 bin = 1 event). Automatically generates 4-stream confusion matrix and defect rates.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-base font-bold text-white">Risk Module (FMEA)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates Occurrence from counted data bands. Evaluates Severity, Occurrence, and Detection with RPN = S × O × D and independent High-Severity review flags.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-base font-bold text-white">Action Module</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Assign corrective actions with owner, deadline, and live progress bars. Highlights overdue mitigations to protect facility compliance.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-base font-bold text-white">Scenario Simulator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                What-If recalculator allowing users to simulate assumed failure reductions (r) and compare projected RPNs against observed follow-up audits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-800 bg-[#02101b] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo variant="dark" />
            <span className="ml-2">© 2026 VERDANOVA • WasteRisk 360</span>
          </div>
          <div>
            Team Gemba Guardians • Tatusta Hackathon (ISTE TCET) • Solid Waste Rules 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
