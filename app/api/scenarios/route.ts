import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateOccurrenceBand, calculateRPN } from "@/lib/fmea";

export async function GET() {
  const data = db.getScenarios();
  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = db.getScenarios();
    const assumedReductionPercent = Number(body.assumedReductionPercent) ?? current.assumedReductionPercent ?? 50;
    const r = assumedReductionPercent / 100;

    const base = current.baseline || {
      totalEvents: 150,
      totalDefects: 42,
      targetFailureCount: 24,
      severityScore: 6,
      detectionScore: 5,
    };

    // Projected events removed = count * r (PDF Section 4.4)
    const eventsRemoved = Math.round(base.targetFailureCount * r);
    const projectedDefects = Math.max(0, base.totalDefects - eventsRemoved);
    const projectedDefectRate = Number(((projectedDefects / base.totalEvents) * 100).toFixed(1));
    const projectedDPMO = Math.round((projectedDefects / base.totalEvents) * 1000000);

    // Recalculate occurrence from reduced count share
    const remainingFailureShare = ((base.targetFailureCount - eventsRemoved) / base.totalEvents) * 100;
    const projectedOccurrenceScore = calculateOccurrenceBand(remainingFailureShare);
    const detectionScore = Number(body.detectionScore) || base.detectionScore;
    const severityScore = base.severityScore;
    const projectedRPN = calculateRPN(severityScore, projectedOccurrenceScore, detectionScore);

    const updatedData = {
      ...current,
      activeFailureMode: body.activeFailureMode || current.activeFailureMode,
      assumedReductionPercent,
      projected: {
        reductionFactor: r,
        eventsRemoved,
        projectedDefects,
        projectedDefectRate,
        projectedDPMO,
        projectedOccurrenceScore,
        severityScore,
        detectionScore,
        projectedRPN,
        status: "Projection Only",
      },
    };

    db.saveScenarios(updatedData);
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
