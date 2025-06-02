export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const awaitedParams = await params;
    const { userId } = awaitedParams;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
      const result = await pool.query(
        `SELECT 
          ui.username,
          ui.first_name as "firstName",
          ui.last_name as "lastName",
          ui.contact_number as "contactNumber",
          ui.date_of_birth as "dateOfBirth",
          ui.profile_picture_url as "profilePictureUrl",
          u.email,
          u.created_at as "createdAt",
          u.updated_at as "updatedAt"
        FROM "user_information" ui
        JOIN "user" u ON ui.user_id = u.id
        WHERE ui.user_id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: "User information not found" }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error fetching user information:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 