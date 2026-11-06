// ISO 31000 & FMEA Calculation Engine for VERDANOVA

/**
 * Maps Defect share percentage to Occurrence band (1 to 10)
 * As defined in PDF Section 4.3:
 * - no events = 1
 * - under 1% = 2
 * - 1 to 3% = 4
 * - 3 to 5% = 6
 * - 5 to 8% = 8
 * - 8% or more = 10
 */
export function calculateOccurrenceBand(sharePercent: number): number {
  if (sharePercent <= 0) return 1;
  if (sharePercent < 1.0) return 2;
  if (sharePercent <= 3.0) return 4;
  if (sharePercent <= 5.0) return 6;
  if (sharePercent <= 8.0) return 8;
  return 10;
}

/**
 * Risk Priority Number (RPN) = Severity * Occurrence * Detection
 */
export function calculateRPN(severity: number, occurrence: number, detection: number): number {
  return severity * occurrence * detection;
}

/**
 * High-Severity Escalation Rule (PDF Section 4.3):
 * Any failure with Severity >= 8 is flagged for mandatory review regardless of RPN.
 */
export function isHighSeverityFlagged(severity: number): boolean {
  return severity >= 8;
}

/**
 * 5x5 Matrix Risk Level mapping:
 * Score = Likelihood (1-5) * Impact (1-5) -> 1 to 25
 * - 20 - 25: Very High (Red) - Stop activity & take immediate action
 * - 10 - 16: High (Orange/Coral) - Action required soon
 * - 5 - 9: Medium (Amber/Yellow) - Monitor and improve controls
 * - 1 - 4: Low (Green) - Acceptable with existing controls
 */
export function getRiskLevel(score: number): {
  level: "Low" | "Medium" | "High" | "Very High";
  actionAdvice: string;
  badgeClass: string;
  bgLightClass: string;
} {
  if (score >= 20) {
    return {
      level: "Very High",
      actionAdvice: "Stop activity & take immediate mitigation action.",
      badgeClass: "bg-red-500 text-white border-red-600",
      bgLightClass: "bg-red-50 text-red-700 border-red-200",
    };
  }
  if (score >= 10) {
    return {
      level: "High",
      actionAdvice: "Action required soon to reduce risk exposure.",
      badgeClass: "bg-orange-500 text-white border-orange-600",
      bgLightClass: "bg-orange-50 text-orange-700 border-orange-200",
    };
  }
  if (score >= 5) {
    return {
      level: "Medium",
      actionAdvice: "Monitor and improve operational controls.",
      badgeClass: "bg-amber-500 text-white border-amber-600",
      bgLightClass: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }
  return {
    level: "Low",
    actionAdvice: "Acceptable risk with standard existing controls.",
    badgeClass: "bg-emerald-500 text-white border-emerald-600",
    bgLightClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
}

/**
 * Defect metrics calculation
 */
export function calculateDefectMetrics(defects: number, totalEvents: number) {
  if (totalEvents <= 0) {
    return {
      defectRate: 0,
      defectRatePercent: "0.00%",
      dpmo: 0,
    };
  }
  const rate = defects / totalEvents;
  const dpmo = Math.round(rate * 1000000);
  return {
    defectRate: rate,
    defectRatePercent: (rate * 100).toFixed(1) + "%",
    dpmo,
  };
}
