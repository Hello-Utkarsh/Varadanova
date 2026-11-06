import { NextResponse } from "next/server";
import { db, ActionItem } from "@/lib/db";

export async function GET() {
  const data = db.getActions();
  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newAction: ActionItem = {
      id: body.id || `ACT-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
      title: body.title || "New Mitigation Task",
      hazard: body.hazard || "Unspecified hazard",
      riskId: body.riskId || "RA-001",
      priority: body.priority || "Medium",
      owner: body.owner || "Aarav Mehta",
      ownerRole: body.ownerRole || "Environmental Officer",
      dueDate: body.dueDate || new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      progress: Number(body.progress) || 0,
      status: body.status || "In Progress",
      notes: body.notes || "",
    };

    const saved = db.saveAction(newAction);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    }
    const current = db.getActions().find((a) => a.id === body.id);
    if (!current) {
      return NextResponse.json({ success: false, error: "Action not found" }, { status: 404 });
    }
    const updated = { ...current, ...body };
    db.saveAction(updated);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
