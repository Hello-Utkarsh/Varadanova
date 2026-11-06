"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BellIcon, ChevronDownIcon, SearchIcon } from "./Icons";
import { Logo } from "./Logo";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  selectedCampus?: string;
  onCampusChange?: (campus: string) => void;
}

export function Header({
  title = "Good morning, Aarav Mehta",
  subtitle = "Here's today's waste risk overview.",
  selectedCampus = "Campus A",
  onCampusChange,
}: HeaderProps) {
  const [campus, setCampus] = useState(selectedCampus);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const campuses = ["Campus A", "Campus B", "Campus C"];

  const handleCampusSelect = (c: string) => {
    setCampus(c);
    if (onCampusChange) onCampusChange(c);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left Title / Subtitle & Mobile Menu Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Toggle Navigation"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Controls: Campus, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Campus Selector */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold py-1.5 px-3 rounded-full cursor-pointer transition-colors">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            <select
              value={campus}
              onChange={(e) => handleCampusSelect(e.target.value)}
              aria-label="Select Campus Location"
              className="bg-transparent border-none outline-none cursor-pointer pr-1 appearance-none font-semibold text-slate-800"
            >
              {campuses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View waste risk alerts"
            className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
          >
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Waste Risk Alerts
                </span>
                <span className="text-[11px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                  3 High
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-semibold text-red-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Fire Hazard at storage point
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Storage Unit 1 requires urgent clearance of combustible paper scrap.
                  </p>
                </div>
                <div className="p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-semibold text-orange-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Hazardous chemical secondary tray cracked
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Lab Block 204 inspection flagged overdue replacement.
                  </p>
                </div>
                <div className="p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Hostel Block B missed weekend collection
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Vendor notified. Chute cleared to avoid pest infestation.
                  </p>
                </div>
              </div>
              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <Link
                  href="/action-plan"
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-semibold"
                >
                  View All Action Plans →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <Link
          href="/settings"
          className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 hover:opacity-85 transition-opacity"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-400 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-white">
            AM
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-tight">
              Aarav Mehta
            </span>
            <span className="text-[11px] text-slate-400">Env. Officer</span>
          </div>
        </Link>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden flex" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-64 bg-[#031525] text-slate-300 h-full p-4 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="p-2 border-b border-slate-800 flex items-center justify-between">
                <Logo variant="dark" />
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <nav className="space-y-1.5 mt-4">
                {[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Risk Assessment", href: "/risk-assessment" },
                  { label: "Inspections", href: "/inspections" },
                  { label: "Action Plan", href: "/action-plan" },
                  { label: "Reports", href: "/reports" },
                  { label: "Settings", href: "/settings" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="text-xs text-slate-500 text-center">
              VERDANOVA WasteRisk 360
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
