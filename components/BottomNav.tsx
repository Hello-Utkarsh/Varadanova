"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  RiskIcon,
  SearchIcon,
  ActionPlanIcon,
  SettingsIcon,
} from "./Icons";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/dashboard", icon: HomeIcon },
    { label: "Assess", href: "/risk-assessment", icon: RiskIcon },
    { label: "Inspections", href: "/inspections", icon: SearchIcon },
    { label: "Actions", href: "/action-plan", icon: ActionPlanIcon },
    { label: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around md:hidden shadow-lg">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-medium transition-colors ${
              isActive
                ? "text-cyan-600 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <div
              className={`p-1 rounded-lg ${
                isActive ? "bg-cyan-50 text-cyan-600" : ""
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
