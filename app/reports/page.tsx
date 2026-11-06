"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import {
  DownloadIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
} from "@/components/Icons";

export default function ReportsPage() {
  const [assessments, setAssessments] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [actions, setActions] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [a, i, act] = await Promise.all([
          fetch("/api/assessments").then((r) => r.json()),
          fetch("/api/inspections").then((r) => r.json()),
          fetch("/api/actions").then((r) => r.json()),
        ]);
        if (a.success) setAssessments(a.data);
        if (i.success) setInspections(i.data);
        if (act.success) setActions(act.data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchAll();
  }, []);

  const handleDownloadCSV = () => {
    setIsExporting(true);
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Hazard,Category,Location,Likelihood,Impact,RiskScore,RiskLevel,Severity_S,Occurrence_O,Detection_D,RPN,HighSeverityFlag\n";

    assessments.forEach((row: any) => {
      csvContent += `${row.id},"${row.hazard}","${row.category}","${row.location}",${row.likelihood},${row.impact},${row.score},${row.level},${row.severityScore || ""},${row.occurrenceScore || ""},${row.detectionScore || ""},${row.rpn || ""},${row.highSeverityFlag ? "YES" : "NO"}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `verdanova_risk_register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExporting(false);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      assessments,
      inspections,
      actions,
      exportedAt: new Date().toISOString(),
      standards: "ISO 31000 & India Solid Waste Rules 2026",
    }, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `verdanova_audit_database_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetDemo = async () => {
    if (!confirm("Reset database to initial demo baseline?")) return;
    try {
      await fetch("/api/reset", { method: "POST" });
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3f7fa] font-sans pb-16 md:pb-0">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title="Evidence, Reports & Compliance"
          subtitle="Audit transparency, ISO 31000 methodology documentation, and raw data export."
        />

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl">
          {/* Transparency & Synthetic Data Banner (PDF Section 5) */}
          <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangleIcon className="w-5 h-5" />
            </div>
            <div className="text-xs text-amber-900 space-y-1">
              <p className="font-extrabold text-sm">
                Synthetic & Pilot Data Disclosure (Hackathon Transparency Guideline)
              </p>
              <p className="text-slate-600 leading-relaxed">
                This demonstration instance links synthetic calibration records with real observation-only pilot audits conducted across Hostels and Cafeteria facilities under India&apos;s <em>Solid Waste Management Rules 2026</em>. Observers collect non-invasive stream counts without handling hazardous or sanitary contents.
              </p>
            </div>
          </div>

          {resetSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-bold">
              ✓ Database restored to default baseline.
            </div>
          )}

          {/* Quick Export Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Spreadsheet Export
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-1">
                  Risk Register & FMEA (CSV)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Download all verified hazards, $S/O/D$ scores, and mitigation statuses.
                </p>
              </div>
              <button
                onClick={handleDownloadCSV}
                disabled={isExporting}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <DownloadIcon className="w-4 h-4" />
                Export CSV File
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Developer & Auditor Dump
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-1">
                  Complete JSON Snapshot
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Export raw records from `db/` including events, inspections, and actions.
                </p>
              </div>
              <button
                onClick={handleDownloadJSON}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <DownloadIcon className="w-4 h-4" />
                Export JSON Archive
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Demonstration Controls
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-1">
                  Reset Demo State
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Clear custom changes and revert local `db/*.json` back to default seed.
                </p>
              </div>
              <button
                onClick={handleResetDemo}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCwIcon className="w-4 h-4" />
                Restore Default Seed
              </button>
            </div>
          </div>

          {/* Methodology & Hackathon Alignment Matrix (PDF Section 11) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Methodology & Evaluation Criteria Mapping
                </h3>
                <p className="text-xs text-slate-500">
                  How VERDANOVA / WasteRisk 360 satisfies each hackathon evaluation pillar (Section 11)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3 border">Criterion</th>
                    <th className="p-3 border text-center">Weight</th>
                    <th className="p-3 border">System Implementation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 border font-bold text-slate-900">Technical Implementation</td>
                    <td className="p-3 border text-center font-bold text-cyan-700">25%</td>
                    <td className="p-3 border">
                      Self-contained offline architecture, validated local database persistence in `db/`, automated Occurrence calculation engine, and dynamic What-If recalculator.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 border font-bold text-slate-900">Functionality & Execution</td>
                    <td className="p-3 border text-center font-bold text-cyan-700">20%</td>
                    <td className="p-3 border">
                      End-to-end operational loop: Gemba audit event logging → 4-stream confusion matrix → FMEA scoring → corrective action dispatch → sensitivity check.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 border font-bold text-slate-900">Problem Relevance & Impact</td>
                    <td className="p-3 border text-center font-bold text-cyan-700">20%</td>
                    <td className="p-3 border">
                      Directly addresses India&apos;s Solid Waste Management Rules 2026 across 4 streams (Wet, Dry, Sanitary, Special Care) to eliminate cross-contamination before transport.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 border font-bold text-slate-900">Innovation & Originality</td>
                    <td className="p-3 border text-center font-bold text-cyan-700">20%</td>
                    <td className="p-3 border">
                      Converts subjective opinions into counted observations via FMEA bands, with independent High-Severity review flags ($S \ge 8$) and strict separation of Projected vs Observed outcomes.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 border font-bold text-slate-900">Presentation & Pitch</td>
                    <td className="p-3 border text-center font-bold text-cyan-700">15%</td>
                    <td className="p-3 border">
                      Intuitive UI inspired by modern design standards, real-time visual heatmaps, interactive progress sliders, and clear four-step narrative: Measure, Rank, Act, Verify.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
