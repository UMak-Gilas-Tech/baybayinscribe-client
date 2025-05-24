"use server";

import { useServerLrStore } from "@/app/store/server/server.store.lr";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { resource_id: string } }
) {
  try {
    const { resource_id } = await params;
    if (!resource_id) {
      return new Response("Resource ID is required", { status: 400 });
    }

    const data = await request.json();
    const lessonsState = useServerLrStore.getState();
    await lessonsState.updateLesson(data);

    return NextResponse.json("Lesson updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json("Failed to update lesson", { status: 500 });
  }
}
