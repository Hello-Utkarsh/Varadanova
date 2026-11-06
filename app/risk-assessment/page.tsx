"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  FilterIcon,
  SearchIcon,
  RefreshCwIcon,
} from "@/components/Icons";
import { RiskAssessment } from "@/lib/db";
import { getRiskLevel } from "@/lib/fmea";

export default function RiskAssessmentPage() {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showFMEADeepDive, setShowFMEADeepDive] = useState(false);
  const [sensitivityDelta, setSensitivityDelta] = useState(0); // -1, 0, +1
  const [selectedRiskModal, setSelectedRiskModal] = useState<RiskAssessment | null>(null);

  // Form states
  const [hazard, setHazard] = useState("");
  const [category, setCategory] = useState("Hazardous Waste");
  const [location, setLocation] = useState("Storage Unit 1");
  const [description, setDescription] = useState("");
  const [likelihood, setLikelihood] = useState<number>(3);
  const [impact, setImpact] = useState<number>(4);
  const [existingControls, setExistingControls] = useState("");
  const [mitigations, setMitigations] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const loadData = async () => {
    try {
      const res = await fetch("/api/assessments");
      const json = await res.json();
      if (json.success) {
        setAssessments(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentScore = likelihood * impact;
  const currentRisk = getRiskLevel(currentScore);

  const handleReset = () => {
    setHazard("");
    setDescription("");
    setLikelihood(3);
    setImpact(3);
    setExistingControls("");
    setMitigations("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hazard.trim()) {
      alert("Please provide a hazard / activity name.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hazard,
          category,
          location,
          description,
          likelihood,
          impact,
          severityScore: impact * 2,
          occurrenceScore: likelihood * 2,
          detectionScore: 5,
          existingControls,
          mitigations,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg("Risk assessment saved directly to database!");
        setTimeout(() => setFeedbackMsg(""), 3000);
        handleReset();
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this risk assessment?")) return;
    try {
      await fetch(`/api/assessments?id=${id}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredList = assessments.filter((a) => {
    const matchSearch =
      a.hazard.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === "All" || a.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex min-h-screen bg-[#f3f7fa] font-sans pb-16 md:pb-0">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          title="Risk Assessment"
          subtitle="Identify, evaluate and manage potential risks for a safer and more sustainable environment."
        />

        <div className="p-4 sm:p-8 space-y-8 max-w-7xl">
          {/* Top Banner & Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 via-slate-900 to-cyan-950 p-6 rounded-3xl text-white shadow-md">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                ISO 31000 & FMEA Framework
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                Quantitative Waste Risk Intelligence
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Scores combine Severity, Occurrence (calculated from measured audit counts), and Detection to prioritize real hazards over subjective opinions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFMEADeepDive(!showFMEADeepDive)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-white shadow-md transition-colors flex items-center gap-2"
              >
                <RefreshCwIcon className="w-4 h-4" />
                {showFMEADeepDive ? "Standard 5×5 Matrix" : "ISO FMEA RPN View"}
              </button>
            </div>
          </div>

          {feedbackMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
              {feedbackMsg}
            </div>
          )}

          {/* Form and Live Calculation Card Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* New Risk Assessment Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6 text-slate-800">
                <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center font-bold">
                  +
                </div>
                <h3 className="text-lg font-bold">New Risk Assessment</h3>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Hazard / Activity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Improper storage of hazardous waste"
                      value={hazard}
                      onChange={(e) => setHazard(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
                    >
                      <option value="Hazardous Waste">Hazardous Waste</option>
                      <option value="General Waste">General Waste</option>
                      <option value="Mixed Waste">Mixed Waste</option>
                      <option value="E-waste">E-waste</option>
                      <option value="Biomedical Waste">Biomedical Waste</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
                  >
                    <option value="Storage Unit 1">Storage Unit 1</option>
                    <option value="Lab Block">Lab Block</option>
                    <option value="Cafeteria">Cafeteria</option>
                    <option value="Hostel Block">Hostel Block</option>
                    <option value="Health Centre">Health Centre</option>
                    <option value="Main Campus">Main Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe the hazard, location, and potential consequences..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50 resize-none"
                  />
                </div>

                {/* Likelihood & Impact Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Likelihood (1 to 5)
                    </label>
                    <select
                      value={likelihood}
                      onChange={(e) => setLikelihood(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50 font-semibold"
                    >
                      <option value={1}>1 - Rare</option>
                      <option value={2}>2 - Unlikely</option>
                      <option value={3}>3 - Possible</option>
                      <option value={4}>4 - Likely</option>
                      <option value={5}>5 - Almost Certain</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Impact / Severity (1 to 5)
                    </label>
                    <select
                      value={impact}
                      onChange={(e) => setImpact(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50 font-semibold"
                    >
                      <option value={1}>1 - Negligible</option>
                      <option value={2}>2 - Minor</option>
                      <option value={3}>3 - Moderate</option>
                      <option value={4}>4 - Major</option>
                      <option value={5}>5 - Severe</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Existing Controls
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Proper storage, PPE, regular inspections..."
                    value={existingControls}
                    onChange={(e) => setExistingControls(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Additional Mitigation Measures
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Improve segregation, training, signage..."
                    value={mitigations}
                    onChange={(e) => setMitigations(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    {isSubmitting ? "Saving..." : "Save Assessment"}
                  </button>
                </div>
              </form>
            </div>

            {/* Calculated Risk & Matrix Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex items-center gap-2 text-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <h3 className="text-base font-bold">Calculated Risk</h3>
                </div>

                {/* Score & Level Display */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Risk Score
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-extrabold text-slate-900">
                        {currentScore}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        / 25
                      </span>
                    </div>
                    <span className={`inline-block mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-md ${currentRisk.badgeClass}`}>
                      {currentRisk.level} Risk
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Risk Level
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-slate-800">
                        <AlertTriangleIcon className="w-4 h-4 text-orange-500" />
                        <span>{currentRisk.level}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                        {currentRisk.actionAdvice}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5x5 Matrix Preview */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                    <span>Risk Matrix Position</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Impact × Likelihood
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    {[5, 4, 3, 2, 1].map((imp) => (
                      <React.Fragment key={imp}>
                        {[1, 2, 3, 4, 5].map((lh) => {
                          const val = imp * lh;
                          const isActive = imp === impact && lh === likelihood;
                          let cellColor = "bg-emerald-100 text-emerald-800";
                          if (val >= 20) cellColor = "bg-red-200 text-red-900";
                          else if (val >= 10) cellColor = "bg-orange-200 text-orange-900";
                          else if (val >= 5) cellColor = "bg-amber-200 text-amber-900";

                          return (
                            <div
                              key={`${imp}-${lh}`}
                              className={`h-7 rounded flex items-center justify-center text-[10px] font-bold transition-all ${cellColor} ${
                                isActive ? "ring-2 ring-slate-900 scale-105 shadow z-10" : "opacity-80"
                              }`}
                            >
                              {val}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Risk Level Guide Legend */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Risk Level Guide
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-red-500"></span>
                      <span className="font-semibold text-slate-700">20 - 25: Very High</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-orange-500"></span>
                      <span className="font-semibold text-slate-700">10 - 16: High</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-amber-400"></span>
                      <span className="font-semibold text-slate-700">5 - 9: Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-emerald-500"></span>
                      <span className="font-semibold text-slate-700">1 - 4: Low</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FMEA Deep Dive & Sensitivity Check (from PDF Section 3 & 4.3) */}
          {showFMEADeepDive && (
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                    <span>FMEA Register: RPN = S × O × D</span>
                    <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full">
                      ISO 31000 Inspired
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Occurrence (O) calculated from real Gemba audit counts. High-Severity review flags triggered independently when S ≥ 8.
                  </p>
                </div>

                {/* Sensitivity Check Controller */}
                <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700">
                  <span className="text-xs font-semibold text-slate-300">
                    Sensitivity Check:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[-1, 0, 1].map((delta) => (
                      <button
                        key={delta}
                        onClick={() => setSensitivityDelta(delta)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          sensitivityDelta === delta
                            ? "bg-cyan-500 text-white"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        {delta > 0 ? `+${delta}` : delta}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* FMEA Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5">ID</th>
                      <th className="py-2.5">Failure Mode / Hazard</th>
                      <th className="py-2.5 text-center">Severity (S)</th>
                      <th className="py-2.5 text-center">Occurrence (O)</th>
                      <th className="py-2.5 text-center">Detection (D)</th>
                      <th className="py-2.5 text-center">RPN (S×O×D)</th>
                      <th className="py-2.5 text-center">High-S Flag</th>
                      <th className="py-2.5">Mitigation Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {assessments.map((a) => {
                      const effS = Math.min(10, Math.max(1, (a.severityScore || a.impact * 2) + sensitivityDelta));
                      const effO = Math.min(10, Math.max(1, (a.occurrenceScore || a.likelihood * 2) + sensitivityDelta));
                      const effD = a.detectionScore || 5;
                      const effRPN = effS * effO * effD;
                      const isHighS = effS >= 8;

                      return (
                        <tr key={a.id} className="hover:bg-slate-800/40">
                          <td className="py-3 font-mono font-bold text-cyan-400">{a.id}</td>
                          <td className="py-3 font-semibold text-white">{a.hazard}</td>
                          <td className="py-3 text-center font-bold text-orange-400">{effS}</td>
                          <td className="py-3 text-center font-bold text-cyan-400">{effO}</td>
                          <td className="py-3 text-center font-bold text-slate-300">{effD}</td>
                          <td className="py-3 text-center font-black text-amber-300">{effRPN}</td>
                          <td className="py-3 text-center">
                            {isHighS ? (
                              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold text-[10px] border border-red-500/40">
                                ⚠ Review
                              </span>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </td>
                          <td className="py-3 text-slate-400 truncate max-w-xs">{a.mitigations || "In design"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Previous Assessments Table matching Image 4 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                  📋
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Previous Assessments
                </h3>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search hazards or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50/50 w-60"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-600">
                  <FilterIcon className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    aria-label="Filter Assessments by Category"
                    className="bg-transparent border-none outline-none font-semibold text-slate-700 cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Hazardous Waste">Hazardous Waste</option>
                    <option value="General Waste">General Waste</option>
                    <option value="Mixed Waste">Mixed Waste</option>
                    <option value="Biomedical Waste">Biomedical Waste</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">ID</th>
                    <th className="py-3 px-3">Hazard / Activity</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Location</th>
                    <th className="py-3 px-3 text-center">Likelihood</th>
                    <th className="py-3 px-3 text-center">Impact</th>
                    <th className="py-3 px-3 text-center">Risk Score</th>
                    <th className="py-3 px-3 text-center">Risk Level</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredList.map((item) => {
                    const isHigh = item.level === "High" || item.level === "Very High";
                    const isMedium = item.level === "Medium";
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-cyan-700">{item.id}</td>
                        <td className="py-3.5 px-3 font-semibold text-slate-900">{item.hazard}</td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                            <TrashIcon className="w-3 h-3 text-cyan-600" />
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-500">{item.location}</td>
                        <td className="py-3.5 px-3 text-center font-bold">{item.likelihood}</td>
                        <td className="py-3.5 px-3 text-center font-bold">{item.impact}</td>
                        <td className="py-3.5 px-3 text-center font-black text-slate-900">{item.score}</td>
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                              isHigh
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : isMedium
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {item.level}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">{item.date}</td>
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedRiskModal(item)}
                              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800"
                              title="View details"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600"
                              title="Delete assessment"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Details Modal */}
      {selectedRiskModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedRiskModal(null)}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-600">{selectedRiskModal.id}</span>
                <h3 className="text-lg font-bold text-slate-800">{selectedRiskModal.hazard}</h3>
              </div>
              <button onClick={() => setSelectedRiskModal(null)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-600">
              <p><strong className="text-slate-800">Category:</strong> {selectedRiskModal.category} ({selectedRiskModal.location})</p>
              <p><strong className="text-slate-800">Description:</strong> {selectedRiskModal.description || "N/A"}</p>
              <p><strong className="text-slate-800">Existing Controls:</strong> {selectedRiskModal.existingControls || "None"}</p>
              <p><strong className="text-slate-800">Recommended Mitigations:</strong> {selectedRiskModal.mitigations || "None specified"}</p>
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-around border">
                <div>Score: <strong className="text-slate-900">{selectedRiskModal.score}/25</strong></div>
                <div>Level: <strong className="text-cyan-700">{selectedRiskModal.level}</strong></div>
                <div>Date: <strong className="text-slate-700">{selectedRiskModal.date}</strong></div>
              </div>
            </div>
            <div className="pt-2 text-right">
              <button onClick={() => setSelectedRiskModal(null)} className="px-5 py-2 rounded-xl bg-cyan-500 text-white font-bold text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
