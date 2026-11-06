"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { RiskHeatmap } from "@/components/RiskHeatmap";
import {
  AlertTriangleIcon,
  LeafIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/Icons";
import { RiskAssessment } from "@/lib/db";

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCampus, setActiveCampus] = useState("Campus A");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/assessments");
        const json = await res.json();
        if (json.success) {
          setAssessments(json.data);
        }
      } catch (err) {
        console.error("Failed to load assessments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalRisks = assessments.length || 12;
  const highRisks = assessments.filter(
    (a) => a.level === "High" || a.level === "Very High"
  ).length || 3;
  const activeMitigations = 8;
  const complianceScore = 92;

  return (
    <div className="flex min-h-screen bg-[#f3f7fa] font-sans pb-16 md:pb-0">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title="Good morning,"
          subtitle="Here's today's waste risk overview."
          selectedCampus={activeCampus}
          onCampusChange={setActiveCampus}
        />

        <div className="p-4 sm:p-8 space-y-6 max-w-7xl">
          {/* Top 4 KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Risk Points */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Total Risk Points</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {totalRisks}
                  </span>
                  <span className="text-xs font-bold text-red-500 flex items-center">
                    ↑ 7%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>

            {/* High Risks */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>High Risks</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {highRisks}
                  </span>
                  <span className="text-xs font-bold text-red-500 flex items-center">
                    ↑ 1
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangleIcon className="w-6 h-6" />
              </div>
            </div>

            {/* Mitigations Active */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Mitigations Active</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {activeMitigations}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center">
                    ↑ 2
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <LeafIcon className="w-6 h-6" />
              </div>
            </div>

            {/* Compliance Score */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Compliance Score</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {complianceScore}%
                  </span>
                  <span className="text-xs font-bold text-cyan-600 flex items-center">
                    ISO 31000
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-500 flex items-center justify-center shrink-0">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Middle Row: Heatmap + Top Risks */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Risk Heatmap (7 cols) */}
            <div className="lg:col-span-7">
              <RiskHeatmap assessments={assessments} />
            </div>

            {/* Top Risks (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-800">Top Risks</h2>
                  <Link
                    href="/risk-assessment"
                    className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                  >
                    View All <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {assessments.slice(0, 5).map((risk) => {
                    const isHigh = risk.level === "High" || risk.level === "Very High";
                    const isMedium = risk.level === "Medium";
                    return (
                      <Link
                        key={risk.id}
                        href="/risk-assessment"
                        className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all duration-150 group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isHigh
                                ? "bg-red-50 text-red-500"
                                : isMedium
                                ? "bg-amber-50 text-amber-500"
                                : "bg-emerald-50 text-emerald-500"
                            }`}
                          >
                            <AlertTriangleIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-cyan-600 transition-colors">
                              {risk.hazard}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {risk.location}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isHigh
                              ? "bg-red-100 text-red-700"
                              : isMedium
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {risk.level}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <Link
                  href="/risk-assessment"
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Assess New Risk Hazard
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Row: Risk Trend + Waste Collected */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Risk Trend (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">
                      7.8
                    </span>
                    <span className="text-xs font-bold text-red-500 flex items-center">
                      ↑ 5%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Risk Trend (Weighted Severity Index)
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Past 30 Days
                </span>
              </div>

              {/* SVG Trend Line Graph */}
              <div className="h-28 w-full mt-4 flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 70">
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Fill */}
                  <path
                    d="M 0 55 Q 30 50, 60 52 T 120 40 T 180 48 T 240 28 T 300 12 L 300 70 L 0 70 Z"
                    fill="url(#trendGrad)"
                  />
                  {/* Stroke */}
                  <path
                    d="M 0 55 Q 30 50, 60 52 T 120 40 T 180 48 T 240 28 T 300 12"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Active dot */}
                  <circle cx="300" cy="12" r="4.5" fill="#ef4444" className="animate-pulse" />
                </svg>
              </div>
            </div>

            {/* Waste Collected (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center">
                    <TrashIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      Waste Collected
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900">
                        420 kg
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        ↑ 12%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500 font-medium">
                  <div>Wet: 240kg</div>
                  <div>Dry: 130kg</div>
                  <div>Sanitary / Special: 50kg</div>
                </div>
              </div>

              {/* Bar Chart Visualization matching mockup */}
              <div className="h-28 w-full mt-4 flex items-end justify-between gap-3 pt-4">
                {[
                  { day: "Mon", height: "35%", color: "from-cyan-300 to-teal-400" },
                  { day: "Tue", height: "48%", color: "from-cyan-300 to-teal-400" },
                  { day: "Wed", height: "42%", color: "from-cyan-300 to-teal-400" },
                  { day: "Thu", height: "65%", color: "from-cyan-400 to-teal-500" },
                  { day: "Fri", height: "55%", color: "from-cyan-400 to-teal-500" },
                  { day: "Sat", height: "82%", color: "from-cyan-500 to-teal-600" },
                  { day: "Sun", height: "95%", color: "from-cyan-500 to-teal-600" },
                ].map((bar) => (
                  <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div
                      className={`w-full rounded-lg bg-gradient-to-t ${bar.color} transition-all duration-300 hover:opacity-90 shadow-sm`}
                      style={{ height: bar.height }}
                    ></div>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
