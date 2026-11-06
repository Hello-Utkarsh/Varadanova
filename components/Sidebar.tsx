"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import {
  HomeIcon,
  RiskIcon,
  SearchIcon,
  ActionPlanIcon,
  ReportsIcon,
  SettingsIcon,
  LeafIcon,
} from "./Icons";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { label: "Risk Assessment", href: "/risk-assessment", icon: RiskIcon },
    { label: "Inspections", href: "/inspections", icon: SearchIcon },
    { label: "Action Plan", href: "/action-plan", icon: ActionPlanIcon },
    { label: "Reports", href: "/reports", icon: ReportsIcon },
    { label: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-[#031525] text-slate-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-slate-800/80 hidden md:flex select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/60">
          <Logo variant="dark" />
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-cyan-500 text-white font-semibold shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? "text-white" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Branding Artwork */}
      <div className="p-5 m-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-[#041d33] border border-cyan-500/20 relative overflow-hidden">
        <div className="absolute -right-3 -bottom-3 text-cyan-500/10 pointer-events-none">
          <LeafIcon className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Gemba Guardians
          </div>
          <p className="text-xs text-slate-300 font-medium">Smarter Waste</p>
          <p className="text-xs text-slate-400">Safer Tomorrow</p>
        </div>
      </div>
    </aside>
  );
}
