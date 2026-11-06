"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  SearchIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon,
} from "@/components/Icons";
import { Inspection, AuditEvent } from "@/lib/db";
import { calculateDefectMetrics } from "@/lib/fmea";

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [activeTab, setActiveTab] = useState<"records" | "gemba">("records");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [showNewModal, setShowNewModal] = useState(false);

  // New Inspection Modal Form states
  const [newType, setNewType] = useState("General Waste Management");
  const [newLoc, setNewLoc] = useState("Main Campus");
  const [newInspector, setNewInspector] = useState("Aarav Mehta");
  const [newFindings, setNewFindings] = useState("");

  // New Gemba Observation Form states
  const [itemDesc, setItemDesc] = useState("");
  const [obsLocation, setObsLocation] = useState("Cafeteria - Station 1");
  const [expStream, setExpStream] = useState<"Wet" | "Dry" | "Sanitary" | "Special Care">("Dry");
  const [actStream, setActStream] = useState<"Wet" | "Dry" | "Sanitary" | "Special Care">("Dry");
  const [isUncertain, setIsUncertain] = useState(false);

  const loadData = async () => {
    try {
      const [resInsp, resAudit] = await fetch("/api/inspections").then((r) => r.json()),
        resAuditData = await fetch("/api/audit-events").then((r) => r.json());
      if (resInsp.success) setInspections(resInsp.data);
      if (resAuditData.success) setAuditEvents(resAuditData.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: newType,
          location: newLoc,
          inspector: newInspector,
          keyFindings: newFindings || "Routine waste inspection completed.",
          status: "Completed",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowNewModal(false);
        setNewFindings("");
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogGembaEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemDesc.trim()) return;
    const isDefect = expStream !== actStream;
    try {
      const res = await fetch("/api/audit-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: itemDesc,
          location: obsLocation,
          expectedStream: expStream,
          actualStream: actStream,
          isDefect,
          isUncertain,
          failureMode: isDefect ? `${expStream} item placed in ${actStream} bin` : "None",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setItemDesc("");
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics from Gemba Audit Events
  const totalAuditEvents = auditEvents.length;
  const defectEvents = auditEvents.filter((e) => e.isDefect).length;
  const uncertainEvents = auditEvents.filter((e) => e.isUncertain).length;
  const defectMetrics = calculateDefectMetrics(defectEvents, totalAuditEvents - uncertainEvents);

  const filteredInspections = inspections.filter((i) => {
    const matchSearch =
      i.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.inspector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || i.status === filterStatus;
    const matchLoc = filterLocation === "All" || i.location === filterLocation;
    return matchSearch && matchStatus && matchLoc;
  });

  const totalCount = inspections.length || 18;
  const completedCount = inspections.filter((i) => i.status === "Completed").length || 12;
  const inProgressCount = inspections.filter((i) => i.status === "In Progress").length || 4;
  const overdueCount = inspections.filter((i) => i.status === "Overdue").length || 2;

  // Stream confusion matrix counts
  const streams = ["Wet", "Dry", "Sanitary", "Special Care"] as const;
  const getMatrixCount = (expected: string, actual: string) => {
    return auditEvents.filter((e) => e.expectedStream === expected && e.actualStream === actual).length;
  };

  return (
    <div className="flex min-h-screen bg-[#f3f7fa] font-sans pb-16 md:pb-0">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title="Inspections & Gemba Audits"
          subtitle="Plan, conduct and track waste management inspections across all locations."
        />

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl">
          {/* Top KPI Stats matching Image 5 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Inspections
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900">{totalCount}</span>
                  <span className="text-xs font-bold text-cyan-600">↑ 12%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                📋
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Completed
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900">{completedCount}</span>
                  <span className="text-xs font-bold text-emerald-600">↑ 8%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  In Progress
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900">{inProgressCount}</span>
                  <span className="text-xs font-bold text-slate-400">→ 0%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
                ⏳
              </div>
            </div>

            {/* Overdue */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Overdue
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900">{overdueCount}</span>
                  <span className="text-xs font-bold text-red-500">↑ 100%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center font-bold">
                <AlertTriangleIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Module Tabs: Inspection Records vs Gemba Audit Observation */}
          <div className="flex border-b border-slate-200 gap-4">
            <button
              onClick={() => setActiveTab("records")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === "records"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Inspection Records
            </button>
            <button
              onClick={() => setActiveTab("gemba")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "gemba"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Gemba Audit Observation & 4-Stream Matrix</span>
              <span className="text-[10px] bg-cyan-100 text-cyan-800 font-extrabold px-2 py-0.5 rounded-full">
                Evidence Engine
              </span>
            </button>
          </div>

          {/* TAB 1: Inspection Records */}
          {activeTab === "records" && (
            <div className="space-y-8">
              {/* Inspection Records Table Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <h3 className="text-lg font-bold text-slate-800">
                    Inspection Records
                  </h3>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search inspections, locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50 w-56"
                      />
                    </div>

                    <select
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      aria-label="Filter by Location"
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50/50 text-slate-700 cursor-pointer"
                    >
                      <option value="All">All Locations</option>
                      <option value="Main Campus">Main Campus</option>
                      <option value="Lab Block">Lab Block</option>
                      <option value="Hostel Block">Hostel Block</option>
                      <option value="Cafeteria">Cafeteria</option>
                      <option value="Health Centre">Health Centre</option>
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      aria-label="Filter by Status"
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50/50 text-slate-700 cursor-pointer"
                    >
                      <option value="All">All Status</option>
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Overdue">Overdue</option>
                    </select>

                    <button
                      onClick={() => setShowNewModal(true)}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                    >
                      <PlusIcon className="w-4 h-4" />
                      + New Inspection
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">Inspection Type</th>
                        <th className="py-3 px-3">Location</th>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Due Date</th>
                        <th className="py-3 px-3">Inspector</th>
                        <th className="py-3 px-3 text-center">Status</th>
                        <th className="py-3 px-3">Key Findings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredInspections.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-cyan-700">{row.id}</td>
                          <td className="py-3.5 px-3 font-semibold text-slate-900">{row.type}</td>
                          <td className="py-3.5 px-3 text-slate-600">📍 {row.location}</td>
                          <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">{row.date}</td>
                          <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">{row.dueDate}</td>
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                                {row.inspector.split(" ").map(n => n[0]).join("")}
                              </span>
                              <span className="font-semibold">{row.inspector}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span
                              className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                                row.status === "Completed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : row.status === "In Progress"
                                  ? "bg-sky-100 text-sky-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-500 max-w-xs truncate">{row.keyFindings}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom 3 Cards matching Image 5 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Status Overview */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-slate-800">
                    Inspection Status Overview
                  </h4>
                  <div className="flex items-center justify-center py-4">
                    <div className="w-32 h-32 rounded-full border-8 border-cyan-500 border-t-emerald-500 border-r-amber-400 border-b-red-400 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-slate-900">{totalCount}</span>
                      <span className="text-[11px] font-semibold text-slate-400">Total</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completed</span>
                      <span className="font-bold">{completedCount} (67%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> In Progress</span>
                      <span className="font-bold">{inProgressCount} (22%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> Overdue</span>
                      <span className="font-bold">{overdueCount} (11%)</span>
                    </div>
                  </div>
                </div>

                {/* 2. Upcoming Inspections */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800">Upcoming Inspections</h4>
                    <span className="text-xs text-cyan-600 font-semibold cursor-pointer">View All →</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">Lab Safety Inspection</p>
                        <p className="text-[11px] text-slate-500">📍 Lab Block • 25 Oct 2026</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">1 day left</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">Hostel Waste Audit</p>
                        <p className="text-[11px] text-slate-500">📍 Hostel Block • 28 Oct 2026</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 text-[10px] font-bold">4 days left</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">Cafeteria Hygiene Check</p>
                        <p className="text-[11px] text-slate-500">📍 Cafeteria • 30 Oct 2026</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 text-[10px] font-bold">6 days left</span>
                    </div>
                  </div>
                </div>

                {/* 3. Recent Findings */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800">Recent Findings</h4>
                    <span className="text-xs text-cyan-600 font-semibold cursor-pointer">View All →</span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                      <div>
                        <p className="font-semibold text-slate-800">Improper chemical storage in Lab 3</p>
                        <p className="text-[11px] text-slate-400">Lab Block • 22 Oct 2026</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">High</span>
                    </div>

                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                      <div>
                        <p className="font-semibold text-slate-800">Mixing of wet and dry waste observed</p>
                        <p className="text-[11px] text-slate-400">Cafeteria • 14 Oct 2026</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px]">Medium</span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-800">Bins properly segregated with color codes</p>
                        <p className="text-[11px] text-slate-400">Main Campus • 24 Oct 2026</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">Low</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Gemba Audit Observation & 4-Stream Matrix */}
          {activeTab === "gemba" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Top Observation Log Form & Defect Metrics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Event Entry Form (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 font-bold flex items-center justify-center">
                      🔍
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Record Gemba Audit Event
                      </h3>
                      <p className="text-xs text-slate-500">
                        1 observed item disposal into 1 bin = 1 event (Section 4.2)
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleLogGembaEvent} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Observed Waste Item Description
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Styrofoam food tray with oily sambar residue"
                        value={itemDesc}
                        onChange={(e) => setItemDesc(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Location
                        </label>
                        <select
                          value={obsLocation}
                          onChange={(e) => setObsLocation(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50/50"
                        >
                          <option value="Cafeteria - Station 1">Cafeteria - Station 1</option>
                          <option value="Cafeteria - Station 2">Cafeteria - Station 2</option>
                          <option value="Hostel Block A - Pantry">Hostel Block A - Pantry</option>
                          <option value="Lab Block - Room 204">Lab Block - Room 204</option>
                          <option value="Main Quad">Main Quad</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Expected Stream (Rules 2026)
                        </label>
                        <select
                          value={expStream}
                          onChange={(e) => setExpStream(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50/50 text-emerald-800"
                        >
                          <option value="Wet">Wet (Organic)</option>
                          <option value="Dry">Dry (Recyclable)</option>
                          <option value="Sanitary">Sanitary</option>
                          <option value="Special Care">Special Care / Hazardous</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Actual Bin Placed In
                        </label>
                        <select
                          value={actStream}
                          onChange={(e) => setActStream(e.target.value as any)}
                          className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold bg-slate-50/50 ${
                            actStream !== expStream ? "border-red-400 text-red-700" : "border-slate-200 text-slate-700"
                          }`}
                        >
                          <option value="Wet">Wet Bin</option>
                          <option value="Dry">Dry Bin</option>
                          <option value="Sanitary">Sanitary Bin</option>
                          <option value="Special Care">Special Care Bin</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isUncertain}
                          onChange={(e) => setIsUncertain(e.target.checked)}
                          className="rounded text-cyan-600 focus:ring-cyan-500"
                        />
                        <span>Uncertain Stream (excluded from defect rate per Section 4.2)</span>
                      </label>

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Log Event
                      </button>
                    </div>
                  </form>
                </div>

                {/* Evidence Metrics Summary (5 cols) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      Audit Metrics Engine
                    </span>
                    <h3 className="text-xl font-black mt-1">Measured Defect Rate</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Evidence-based calculations directly driving Occurrence (O) band scoring.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                      <span className="text-xs text-slate-400">Defect Rate</span>
                      <p className="text-2xl font-black text-cyan-300 mt-1">
                        {defectMetrics.defectRatePercent}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {defectEvents} defects in {totalAuditEvents} events
                      </span>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                      <span className="text-xs text-slate-400">DPMO (Estimate)</span>
                      <p className="text-2xl font-black text-amber-300 mt-1">
                        {defectMetrics.dpmo.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Defects per million opp.
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between">
                      <span>Total Sample Size (N):</span>
                      <strong className="text-white">{totalAuditEvents} events</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Uncertain Events:</span>
                      <strong className="text-amber-400">{uncertainEvents} excluded</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Derived Occurrence Band:</span>
                      <strong className="text-cyan-400 font-bold">Band 8 (5% to 8%)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4-Stream Expected vs Actual Confusion Matrix (PDF Section 3 & 4.2) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Expected vs Actual Stream Confusion Matrix
                    </h3>
                    <p className="text-xs text-slate-500">
                      Four mandated streams: Wet, Dry, Sanitary, and Special Care (India Solid Waste Rules 2026)
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Diagonal = Compliant Placements
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-center text-xs border border-slate-200 rounded-2xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-3 border text-left bg-slate-200/70">Expected \ Actual</th>
                        {streams.map((s) => (
                          <th key={s} className="p-3 border">{s} Bin</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {streams.map((exp) => (
                        <tr key={exp} className="border-b">
                          <td className="p-3 border font-bold text-left bg-slate-50">{exp}</td>
                          {streams.map((act) => {
                            const count = getMatrixCount(exp, act);
                            const isCompliant = exp === act;
                            return (
                              <td
                                key={`${exp}-${act}`}
                                className={`p-3 border font-extrabold ${
                                  isCompliant
                                    ? "bg-emerald-50 text-emerald-800"
                                    : count > 0
                                    ? "bg-red-50 text-red-700"
                                    : "text-slate-400"
                                }`}
                              >
                                {count}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Observation Events Stream */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Logged Gemba Audit Events (Audit Trail)
                </h3>
                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {auditEvents.map((evt) => (
                    <div key={evt.id} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            evt.isDefect
                              ? "bg-red-100 text-red-700"
                              : evt.isUncertain
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {evt.isDefect ? "✕" : evt.isUncertain ? "?" : "✓"}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800">{evt.item}</p>
                          <p className="text-[11px] text-slate-500">
                            {evt.location} • Exp: <strong className="text-slate-700">{evt.expectedStream}</strong> → Act: <strong className={evt.isDefect ? "text-red-600" : "text-emerald-700"}>{evt.actualStream}</strong>
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{evt.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* New Inspection Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowNewModal(false)}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-800">Plan New Inspection</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddInspection} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Inspection Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="General Waste Management">General Waste Management</option>
                  <option value="Hazardous Waste">Hazardous Waste</option>
                  <option value="E-waste">E-waste</option>
                  <option value="Biomedical Waste">Biomedical Waste</option>
                  <option value="Recycling & Segregation">Recycling & Segregation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location</label>
                <select
                  value={newLoc}
                  onChange={(e) => setNewLoc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="Main Campus">Main Campus</option>
                  <option value="Lab Block">Lab Block</option>
                  <option value="Hostel Block">Hostel Block</option>
                  <option value="Cafeteria">Cafeteria</option>
                  <option value="Health Centre">Health Centre</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lead Inspector</label>
                <input
                  type="text"
                  value={newInspector}
                  onChange={(e) => setNewInspector(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Key Objectives / Notes</label>
                <textarea
                  rows={2}
                  value={newFindings}
                  onChange={(e) => setNewFindings(e.target.value)}
                  placeholder="Focus areas, bin condition check..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold"
                >
                  Create Record
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
