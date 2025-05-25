"use server";

import { useServerLrStore } from "@/app/store/server/server.store.lr";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  context: Promise<{ params: { resource_id: string } }>
) {
  try {
    const resolvedContext = await context;
    const resource_id = resolvedContext.params.resource_id;
    if (!resource_id) {
      return new Response("Resource ID is required", { status: 400 });
    }

    await useServerLrStore
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
