import { put } from '@vercel/blob';
import { auth } from '@/app/lib/auth';
import db from '@/db/drizzle';
import { userInformation } from '@/db/schema/auth-schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });

    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Please upload a JPG, JPEG, or PNG file." }, { status: 400 });
    }

    // Validate file size (4MB limit)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "File size too large. Maximum size is 4MB." }, { status: 400 });
    }

    // Upload to blob storage
    const blob = await put(`profile-pictures/${userId}/${file.name}`, file, {
      access: 'public',
    });    // Update user profile picture URL in database
    await db.update(userInformation)
      .set({
        profilePictureUrl: blob.url,
      })
      .where(eq(userInformation.userId, userId));

    return NextResponse.json({ 
      success: true,
      url: blob.url
    });

  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json({ error: "Failed to upload profile picture" }, { status: 500 });
  }
}
