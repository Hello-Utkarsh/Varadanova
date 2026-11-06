import { NextResponse } from "next/server";
import { db, AuditEvent } from "@/lib/db";

export async function GET() {
  const data = db.getAuditEvents();
  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (Array.isArray(body)) {
      const savedList = db.saveAuditEventsBatch(body);
      return NextResponse.json({ success: true, data: savedList });
    }

    const newEvent: AuditEvent = {
      id: body.id || `EVT-${String(Math.floor(Math.random() * 900) + 100)}`,
      timestamp: body.timestamp || new Date().toISOString(),
      location: body.location || "Cafeteria - Station 1",
      item: body.item || "Unknown Waste Item",
      expectedStream: body.expectedStream || "Dry",
      actualStream: body.actualStream || "Dry",
      isDefect: body.isDefect ?? (body.expectedStream !== body.actualStream),
      isUncertain: Boolean(body.isUncertain),
      failureMode: body.failureMode || (body.expectedStream !== body.actualStream ? `${body.expectedStream} in ${body.actualStream} bin` : "None"),
      severity: Number(body.severity) || 1,
    };

    const saved = db.saveAuditEvent(newEvent);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
