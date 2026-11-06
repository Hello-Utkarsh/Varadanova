import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const data = db.getSettings();
  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = db.getSettings();
    const updated = {
      ...current,
      ...body,
      profile: { ...current.profile, ...(body.profile || {}) },
      preferences: { ...current.preferences, ...(body.preferences || {}) },
      displayOptions: { ...current.displayOptions, ...(body.displayOptions || {}) },
      emailPreferences: { ...current.emailPreferences, ...(body.emailPreferences || {}) },
    };
    db.saveSettings(updated);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
