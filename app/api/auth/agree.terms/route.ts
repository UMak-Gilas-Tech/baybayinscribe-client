import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../lib/auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { agreed } = body;

    if (typeof agreed !== "boolean") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    try {
      await pool.query(
        `UPDATE "user_information" 
         SET agreed_to_terms = $1,
             updated_at = NOW()
         WHERE user_id = $2`,
        [agreed, userId]
      );

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error updating terms agreement:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 