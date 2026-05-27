import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/mongodb";
import { AssessmentDocument } from "@/app/types";

export async function POST(request: NextRequest) {
  // Guard: refuse if MONGODB_URI is absent
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { success: false, error: "Database not configured (MONGODB_URI missing)." },
      { status: 503 }
    );
  }

  let body: AssessmentDocument;

  try {
    body = (await request.json()) as AssessmentDocument;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  // Basic validation — require the user's name at minimum
  if (!body?.userProfile?.name?.trim()) {
    return NextResponse.json(
      { success: false, error: "userProfile.name is required." },
      { status: 422 }
    );
  }

  try {
    const db = await getDb("deeppsyche");
    const collection = db.collection<AssessmentDocument>("assessments");

    const result = await collection.insertOne({
      ...body,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, insertedId: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (err) {
    console.error("[save-assessment] MongoDB error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Database write failed.",
      },
      { status: 500 }
    );
  }
}
