"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  PlusIcon,
  RefreshCwIcon,
} from "@/components/Icons";
import { ActionItem } from "@/lib/db";
import { calculateOccurrenceBand, calculateRPN } from "@/lib/fmea";

export default function ActionPlanPage() {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [loading, setLoading] = useState(true);

  // What-If Scenario simulation state (PDF Section 4.4)
  const [assumedReduction, setAssumedReduction] = useState<number>(60); // 60%
  const [showAddModal, setShowAddModal] = useState(false);

  // New Action Form
  const [newTitle, setNewTitle] = useState("");
  const [newHazard, setNewHazard] = useState("Fire at storage point");
  const [newOwner, setNewOwner] = useState("Aarav Mehta");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("High");
  const [newDueDate, setNewDueDate] = useState("30 Oct 2026");

  const loadData = async () => {
    try {
      const res = await fetch("/api/actions");
      const json = await res.json();
      if (json.success) setActions(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateProgress = async (id: string, newProgress: number) => {
    const newStatus = newProgress >= 100 ? "Completed" : "In Progress";
    try {
      await fetch("/api/actions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, progress: newProgress, status: newStatus }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          hazard: newHazard,
          owner: newOwner,
          priority: newPriority,
          dueDate: newDueDate,
          progress: 0,
          status: "In Progress",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewTitle("");
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredActions = actions.filter((a) => {
    if (priorityFilter === "All") return true;
    return a.priority === priorityFilter;
  });

  // What-If Formula Calculations (PDF Section 4.4)
  const baselineEvents = 150;
  const baselineDefects = 42;
  const targetFailureCount = 24; // Wet in dry
  const r = assumedReduction / 100;
  const eventsRemoved = Math.round(targetFailureCount * r);
  const projectedDefects = Math.max(0, baselineDefects - eventsRemoved);
  const projectedDefectRate = ((projectedDefects / baselineEvents) * 100).toFixed(1);
  const projectedDPMO = Math.round((projectedDefects / baselineEvents) * 1000000);
  const remainingShare = ((targetFailureCount - eventsRemoved) / baselineEvents) * 100;
  const projectedOccurrence = calculateOccurrenceBand(remainingShare);
  const projectedRPN = calculateRPN(6, projectedOccurrence, 4);

  return (
    <div className="flex min-h-screen bg-[#f3f7fa] font-sans pb-16 md:pb-0">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title="Action Plan & What-If Simulator"
          subtitle="Turn risk insights into tracked mitigations and model before-and-after scenarios."
        />

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl">
          {/* Header Action bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Corrective & Preventive Action Register
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Each risk gets a mitigation, an owner, a deadline, and an overdue status flag (ISO 31000 Section 3).
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Priority Filter Pill Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                {(["All", "High", "Medium", "Low"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      priorityFilter === p
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <PlusIcon className="w-4 h-4" />
                + Add Action
              </button>
            </div>
          </div>

          {/* Action Items List matching Image 9 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredActions.map((action) => {
              const isHigh = action.priority === "High";
              const isMedium = action.priority === "Medium";
              const isCompleted = action.status === "Completed";
              const isOverdue = action.status === "Overdue";

              return (
                <div
                  key={action.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-bold ${
                          isHigh
                            ? "bg-red-50 text-red-500"
                            : isMedium
                            ? "bg-amber-50 text-amber-500"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        <AlertTriangleIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {action.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Risk: <span className="font-semibold text-slate-700">{action.hazard}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isHigh
                          ? "bg-red-100 text-red-700"
                          : isMedium
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {action.priority}
                    </span>
                  </div>

                  {/* Progress Bar & Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-500">Progress</span>
                      <span className="font-extrabold text-slate-800">{action.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted
                            ? "bg-emerald-500"
                            : isOverdue
                            ? "bg-orange-500"
                            : "bg-cyan-500"
                        }`}
                        style={{ width: `${action.progress}%` }}
                      ></div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={action.progress}
                      onChange={(e) => handleUpdateProgress(action.id, Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>

                  {/* Meta Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center justify-center">
                        {action.owner.split(" ").map(n => n[0]).join("")}
                      </span>
                      <span className="font-medium text-slate-700">{action.owner}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>📅 {action.dueDate}</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800"
                            : isOverdue
                            ? "bg-red-100 text-red-800"
                            : "bg-sky-100 text-sky-800"
                        }`}
                      >
                        {action.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BEFORE AND AFTER WHAT-IF SIMULATOR (PDF Section 3 & 4.4) */}
          <div className="bg-gradient-to-br from-slate-900 via-[#071d2e] to-teal-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-cyan-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <RefreshCwIcon className="w-3.5 h-3.5 animate-spin" />
                  Evidence-Driven Scenario Simulation (PDF Section 4.4)
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-1">
                  What-If Mitigation Recalculator
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Simulate assumed reduction <em>r</em> for target failure: &quot;Wet organic in dry recycling bins&quot;.
                  Baseline, Projected, and Observed results are recorded separately per audit integrity standards.
                </p>
              </div>

              {/* Slider for Assumed Reduction */}
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 min-w-[240px]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-300 font-semibold">Assumed Reduction (r):</span>
                  <span className="text-cyan-300 font-black text-sm">{assumedReduction}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={assumedReduction}
                  onChange={(e) => setAssumedReduction(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* 3 Comparative Cards: Baseline vs Projected vs Observed */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Baseline Audit */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Phase 1</span>
                  <span className="text-[11px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                    Observed Baseline
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">Baseline Audit</h4>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Events Sample Size:</span>
                    <strong className="text-white">150 events</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Defects:</span>
                    <strong className="text-red-400">42 defects</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Defect Rate:</span>
                    <strong className="text-white font-bold">28.0%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Failure Count:</span>
                    <strong className="text-amber-400">24 occurrences</strong>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Baseline RPN (S×O×D):</span>
                  <span className="text-xl font-black text-red-400">240</span>
                </div>
              </div>

              {/* 2. Projected Scenario */}
              <div className="bg-cyan-950/40 rounded-2xl p-5 border-2 border-cyan-400/50 space-y-3 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase">Phase 2</span>
                  <span className="text-[11px] font-bold bg-cyan-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                    Projection Only
                  </span>
                </div>
                <h4 className="text-base font-bold text-cyan-200">
                  Projected with {assumedReduction}% Reduction
                </h4>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Events Removed:</span>
                    <strong className="text-emerald-400">−{eventsRemoved} events</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Projected Defects:</span>
                    <strong className="text-white">{projectedDefects} remaining</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>New Defect Rate:</span>
                    <strong className="text-cyan-300 font-bold">{projectedDefectRate}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Recalculated Occurrence:</span>
                    <strong className="text-cyan-300">Band {projectedOccurrence}</strong>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Projected RPN:</span>
                  <span className="text-xl font-black text-cyan-400">{projectedRPN}</span>
                </div>
              </div>

              {/* 3. Observed Follow-up */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Phase 3</span>
                  <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    Observed Ground Truth
                  </span>
                </div>
                <h4 className="text-base font-bold text-emerald-300">Follow-up Audit</h4>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Events Sample Size:</span>
                    <strong className="text-white">160 events</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Observed Defects:</span>
                    <strong className="text-emerald-400">29 defects</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Observed Defect Rate:</span>
                    <strong className="text-white font-bold">18.1%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Failure Count:</span>
                    <strong className="text-emerald-300">11 occurrences</strong>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Observed RPN:</span>
                  <span className="text-xl font-black text-emerald-400">96</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Action Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-800">Add Mitigation Action</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateAction} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mitigation Action Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Procure flame-retardant storage bin covers"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Associated Hazard</label>
                <input
                  type="text"
                  value={newHazard}
                  onChange={(e) => setNewHazard(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Owner</label>
                  <input
                    type="text"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Due Date</label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold"
                >
                  Save Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
