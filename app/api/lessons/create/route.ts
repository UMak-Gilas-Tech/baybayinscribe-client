import db from "@/db";
import { learningResource } from "@/db/schema/learning-resources";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: "Title and content are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const fileUpload = await put(
      "learning_resources/" + file?.name,
      file!.stream(),
      {
        token: process.env.VERCEL_BLOB_TOKEN,
        access: "public",
      }
    );

    const response = await db
      .insert(learningResource)
      .values({
        id: crypto.randomUUID(),
        title,
        markdown_file: fileUpload.downloadUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .then((data) => {
        return new Response(JSON.stringify(data), {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        });
      });

    return NextResponse.json({ message: "Lesson created successfully", response });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return new Response(JSON.stringify({ error: "Failed to create lesson" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
