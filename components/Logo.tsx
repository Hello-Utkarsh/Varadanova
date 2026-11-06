import React from "react";
import Link from "next/link";
import { LogoIcon } from "./Icons";

export function Logo({
  variant = "dark",
  className = "",
  showText = true,
}: {
  variant?: "dark" | "light";
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className="relative flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
        <LogoIcon className="w-9 h-9" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black text-xl tracking-wider uppercase font-sans ${
              variant === "dark"
                ? "bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent"
            }`}
            style={{ letterSpacing: "0.08em" }}
          >
            VERDANOVA
          </span>
        </div>
      )}
    </Link>
  );
}
