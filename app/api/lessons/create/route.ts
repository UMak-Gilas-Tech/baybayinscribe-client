"use server";

import { useServerLrStore } from "@/app/store/server/server.store.lr";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = body.title?.toString();
    const description = body.description?.toString();
    const created_by = body.created_by?.toString();
    const is_visible = !!body.is_visible;

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
    const lesson = await lessonsState.createLesson(title, description, created_by, is_visible);

    console.log("Lesson created:", lesson);

    return NextResponse.json(lesson, { status: 201 });
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
