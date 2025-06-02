import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const userResult = await pool.query(
      `SELECT * FROM "user" WHERE email = $1`,
      [email.toLowerCase()]
    );

    return NextResponse.json({ exists: userResult.rows.length > 0 });
  } catch (error) {
    console.error('Error checking email:', error);
    // For security, always return success even on error
    return NextResponse.json({ exists: false });
  }
} 