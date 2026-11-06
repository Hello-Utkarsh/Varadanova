import { NextResponse } from "next/server";
import { db, Inspection } from "@/lib/db";

export async function GET() {
  const data = db.getInspections();
  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newInspection: Inspection = {
      id: body.id || `INSP-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
      type: body.type || "General Waste Management",
      location: body.location || "Main Campus",
      date: body.date || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      dueDate: body.dueDate || new Date(Date.now() + 3 * 86400000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      inspector: body.inspector || "Aarav Mehta",
      status: body.status || "In Progress",
      keyFindings: body.keyFindings || "Routine inspection logged.",
      defectCount: Number(body.defectCount) || 0,
      eventCount: Number(body.eventCount) || 50,
      score: Number(body.score) || 85,
    };

    const saved = db.saveInspection(newInspection);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
