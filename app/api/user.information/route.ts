export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../lib/auth";
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
    console.log("Received user information POST body:", body);
    const {
      username,
      firstName,
      lastName,
      contactNumber,
      dateOfBirth,
      wantsNotifications,
      profilePictureUrl
    } = body;

    if (
      !username || username.length > 30 ||
      !firstName || firstName.length > 30 ||
      !lastName || lastName.length > 30 ||
      !/^\d{11}$/.test(contactNumber) ||
      !dateOfBirth ||
      typeof wantsNotifications !== "boolean"
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    try {
      const existingResult = await pool.query(
        `SELECT * FROM "user_information" WHERE username = $1`,
        [username]
      );

      if (existingResult.rows.length > 0) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409 });
      }

      await pool.query(
        `INSERT INTO "user_information" (
          user_id, 
          username, 
          first_name, 
          last_name, 
          contact_number, 
          date_of_birth, 
          agreed_to_terms, 
          wants_notifications,
          profile_picture_url,
          created_at, 
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
        [
          userId,
          username,
          firstName,
          lastName,
          contactNumber,
          dateOfBirth,
          false, // Set agreed_to_terms to false by default
          wantsNotifications,
          profilePictureUrl || null,
        ]
      );

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error inserting user information:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { wantsNotifications, agreedToTerms } = body;

    if (typeof wantsNotifications !== "boolean") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    try {
      // Check if user information exists
      const userInfoResult = await pool.query(
        `SELECT * FROM "user_information" WHERE user_id = $1`,
        [userId]
      );

      if (userInfoResult.rows.length === 0) {
        return NextResponse.json({ error: "User information not found" }, { status: 404 });
      }

      // Update the wants_notifications preference
      await pool.query(
        `UPDATE "user_information" 
         SET wants_notifications = $1,
             agreed_to_terms = $2,
             updated_at = NOW()
         WHERE user_id = $3`,
        [wantsNotifications, agreedToTerms, userId]
      );

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error updating user information:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {      const result = await pool.query(
        `SELECT 
          ui.username,
          ui.first_name as "firstName",
          ui.last_name as "lastName",
          ui.contact_number as "contactNumber",
          ui.date_of_birth as "dateOfBirth",
          ui.profile_picture_url as "profilePictureUrl",
          u.email
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
