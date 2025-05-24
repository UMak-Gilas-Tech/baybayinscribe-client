import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });

    if (!session?.user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    return NextResponse.json({ 
      isAdmin: session.user.role === "admin" 
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }
} 