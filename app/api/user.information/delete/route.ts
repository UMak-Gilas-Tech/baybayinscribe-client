import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../lib/auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      // Begin transaction
      await pool.query('BEGIN');

      // Delete user information first (due to foreign key constraint)
      await pool.query(
        'DELETE FROM "user_information" WHERE user_id = $1',
        [userId]
      );

      // Delete user record
      await pool.query(
        'DELETE FROM "user" WHERE id = $1',
        [userId]
      );

      // Commit transaction
      await pool.query('COMMIT');

      return NextResponse.json({ success: true });
    } catch (dbError) {
      // Rollback transaction if there's an error
      await pool.query('ROLLBACK');
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error deleting user account:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
