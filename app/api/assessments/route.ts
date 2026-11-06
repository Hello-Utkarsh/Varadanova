import { NextResponse } from "next/server";
import { db, RiskAssessment } from "@/lib/db";
import { getRiskLevel, isHighSeverityFlagged } from "@/lib/fmea";

export async function GET() {
  const data = db.getAssessments();
  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const likelihood = Number(body.likelihood) || 1;
    const impact = Number(body.impact) || 1;
    const score = likelihood * impact;
    const riskInfo = getRiskLevel(score);

    const severityScore = Number(body.severityScore) || (impact * 2);
    const occurrenceScore = Number(body.occurrenceScore) || (likelihood * 2);
    const detectionScore = Number(body.detectionScore) || 5;
    const rpn = severityScore * occurrenceScore * detectionScore;
    const highSeverityFlag = isHighSeverityFlagged(severityScore);

    const newAssessment: RiskAssessment = {
      id: body.id || `RA-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
      hazard: body.hazard || "Untitled Hazard",
      category: body.category || "General Waste",
      location: body.location || "Main Campus",
      description: body.description || "",
      likelihood,
      impact,
      score,
      level: riskInfo.level,
      severityScore,
      occurrenceScore,
      detectionScore,
      rpn,
      highSeverityFlag,
      existingControls: body.existingControls || "",
      mitigations: body.mitigations || "",
      date: body.date || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: body.status || "Action Required",
    };

    const saved = db.saveAssessment(newAssessment);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    }
    db.deleteAssessment(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
