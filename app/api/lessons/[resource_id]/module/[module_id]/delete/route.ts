"use server";

import { useModuleStore } from "@/app/store/server/server.store.modules";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  params: { params: { module_id: string } }
) {
  try {
    const { module_id } = params.params;
    const result = await useModuleStore.getState().deleteModule(module_id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error deleting module:", error);
    return NextResponse.json(
      { message: "Failed to delete module" },
      { status: 500 }
    );
  }
}
