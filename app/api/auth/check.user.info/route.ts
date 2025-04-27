export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../lib/auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    
    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const userId = session.user.id;

    const result = await pool.query(
      `SELECT * FROM "user_information" WHERE user_id = $1`,
      [userId]
    );
    
    if (result.rows.length > 0) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    return NextResponse.redirect(new URL("/auth/userinfo", req.url));
  } catch (error) {
    console.error("Error checking user information:", error);
    return NextResponse.redirect(new URL("/auth/userinfo", req.url));
  }
} 