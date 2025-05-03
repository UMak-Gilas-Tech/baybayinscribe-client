"use server";

import { useServerLrStore } from "@/app/store/server/server.store.lr";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { resource_id: string } }
) {
  try {
    const { resource_id } = params;
    if (!resource_id) {
      return new Response("Resource ID is required", { status: 400 });
    }

    const moduleData = await useServerLrStore
      .getState()
      .deleteLesson(resource_id);

    return NextResponse.json("Module deleted successfully", { status: 201 });
  } catch (error) {
    console.error("Error deleting module:", error);
    return NextResponse.json(
      "Failed to delete module",
      { status: 500 }
    );
  }
}
