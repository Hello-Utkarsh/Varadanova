"use client";

import React, { useState } from "react";
import { RiskAssessment } from "@/lib/db";

interface RiskHeatmapProps {
  assessments?: RiskAssessment[];
  onSelectRisk?: (risk: RiskAssessment) => void;
}

export function RiskHeatmap({ assessments = [], onSelectRisk }: RiskHeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<{ impact: number; likelihood: number } | null>({
    impact: 4,
    likelihood: 4,
  });

  const impactLevels = [
    { label: "Severe", value: 5 },
    { label: "High", value: 4 },
    { label: "Medium", value: 3 },
    { label: "Low", value: 1 },
  ];

  const likelihoodLevels = [
    { label: "Rare", value: 1 },
    { label: "Unlikely", value: 2 },
    { label: "Possible", value: 3 },
    { label: "Likely", value: 4 },
    { label: "Almost Certain", value: 5 },
  ];

  // Helper to get color style based on impact & likelihood
  const getCellColor = (impact: number, likelihood: number) => {
    const score = impact * likelihood;
    if (score >= 20) return "bg-red-400 hover:bg-red-500 border-red-300";
    if (score >= 12) return "bg-orange-300 hover:bg-orange-400 border-orange-200";
    if (score >= 6) return "bg-amber-200 hover:bg-amber-300 border-amber-100";
    return "bg-emerald-200 hover:bg-emerald-300 border-emerald-100";
  };

  // Find hazards for a given cell
  const getHazardsInCell = (impact: number, likelihood: number) => {
    return assessments.filter((a) => {
      const matchImp = impact === 1 ? a.impact <= 2 : a.impact === impact;
      return matchImp && a.likelihood === likelihood;
    });
  };

  const activeCellHazards = selectedCell
    ? getHazardsInCell(selectedCell.impact, selectedCell.likelihood)
    : [];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">Risk Heatmap</h2>
          <p className="text-xs text-slate-500">
            5×5 ISO 31000 Impact vs Likelihood Matrix
          </p>
        </div>
        <div className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
          This Month
        </div>
      </div>

      <div className="relative pt-2">
        {/* Heatmap Grid */}
        <div className="flex">
          {/* Y-axis Labels */}
          <div className="flex flex-col justify-between py-2 pr-3 text-right text-[11px] font-semibold text-slate-500 w-16 shrink-0">
            {impactLevels.map((imp) => (
              <span key={imp.label} className="h-10 flex items-center justify-end">
                {imp.label}
              </span>
            ))}
          </div>

          {/* Matrix Cells */}
          <div className="flex-1 space-y-1.5">
            {impactLevels.map((imp) => (
              <div key={imp.label} className="grid grid-cols-5 gap-1.5 h-10">
                {likelihoodLevels.map((lh) => {
                  const hazards = getHazardsInCell(imp.value, lh.value);
                  const isSelected =
                    selectedCell?.impact === imp.value &&
                    selectedCell?.likelihood === lh.value;
                  const hasHazard = hazards.length > 0;

                  return (
                    <button
                      key={`${imp.label}-${lh.label}`}
                      onClick={() => {
                        setSelectedCell({ impact: imp.value, likelihood: lh.value });
                        if (hazards.length > 0 && onSelectRisk) {
                          onSelectRisk(hazards[0]);
                        }
                      }}
                      className={`relative rounded-lg transition-all duration-150 border flex items-center justify-center cursor-pointer ${getCellColor(
                        imp.value,
                        lh.value
                      )} ${
                        isSelected
                          ? "ring-2 ring-slate-900 scale-[1.03] shadow-md z-10"
                          : "opacity-90 hover:opacity-100"
                      }`}
                    >
                      {hasHazard && (
                        <div className="relative flex items-center justify-center">
                          <span className="w-3.5 h-3.5 rounded-full bg-slate-900 text-white text-[9px] font-black flex items-center justify-center shadow">
                            {hazards.length}
                          </span>
                          {/* Pulsing indicator for severe risk */}
                          {imp.value >= 4 && lh.value >= 4 && (
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* X-axis Labels */}
        <div className="flex pl-16 pt-2">
          <div className="flex-1 grid grid-cols-5 gap-1.5 text-center text-[10px] font-semibold text-slate-500">
            {likelihoodLevels.map((lh) => (
              <span key={lh.label} className="truncate px-0.5">
                {lh.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Cell Preview Card */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        {activeCellHazards.length > 0 ? (
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Identified Hazards ({activeCellHazards.length})
              </span>
              <span className="text-xs font-bold text-red-600">
                Score: {activeCellHazards[0].score} / 25
              </span>
            </div>
            <div className="mt-2 space-y-1.5">
              {activeCellHazards.map((h) => (
                <div key={h.id} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    {h.hazard}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {h.location}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-slate-400">
            Click any cell above to view mapped hazard items
          </div>
        )}
      </div>
    </div>
  );
}
