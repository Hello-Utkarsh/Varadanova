import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    // Reset assessments
    db.saveAssessment({
      id: "RA-001",
      hazard: "Fire at storage point",
      category: "General Waste",
      location: "Storage Unit 1",
      description: "Accumulation of dry combustible cardboard and packaging material near electrical junction box.",
      likelihood: 4,
      impact: 5,
      score: 20,
      level: "Very High",
      severityScore: 9,
      occurrenceScore: 8,
      detectionScore: 6,
      rpn: 432,
      highSeverityFlag: true,
      existingControls: "One outdated 2kg CO2 extinguisher 30 meters away.",
      mitigations: "Install automatic ABC dry powder extinguishers, clear 3m buffer zone around electricals.",
      date: "24 Oct 2026",
      status: "Action Required",
    });

    return NextResponse.json({ success: true, message: "Demo database refreshed successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
