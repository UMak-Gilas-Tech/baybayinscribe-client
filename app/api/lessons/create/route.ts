"use server";

import { useServerLrStore } from "@/app/store/server/server.store.lr";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();

    if (!title || !description) {
      return new Response(
        JSON.stringify({ error: "Title and description are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const lessonsState = useServerLrStore.getState();
    await lessonsState.createLesson(title, description);

    return NextResponse.json("Lesson created successfully", { status: 201 });
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
