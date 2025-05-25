"use server";

import { useModuleStore } from "@/app/store/server/server.store.modules";
import { NextResponse } from "next/server";

// updating file
export async function PUT(
  request: Request,
  params: { params: { resource_id: string; module_id: string } }
) {
  try {
    const { resource_id, module_id } = await params.params;
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const existingFileId = formData.get("existingFileId")?.toString();

    if (!resource_id || !module_id) {
      return NextResponse.json("Resource ID and Module ID are required", {
        status: 400,
      });
    }

    const updatedModule = await useModuleStore.getState().updateModule(module_id, {
      file,
      existingFileId,
      resource_id,
    });

    
    return NextResponse.json(updatedModule, { status: 200 });
  } catch (error) {
    console.error("Error updating module:", error);
    return NextResponse.json(
      { message: "Failed to update module" },
      { status: 500 }
    );
  }
}

// updating module content
export async function PATCH(
  request: Request,
  params: { params: { resource_id: string; module_id: string } }
) {
  try {
    const { resource_id, module_id } = params.params;
    const formData = await request.formData();
    const title = formData.get("module_title")?.toString();
    const description = formData.get("module_description")?.toString();

    if (!resource_id || !module_id) {
      return NextResponse.json("Resource ID and Module ID are required", {
        status: 400,
      });
    }
    if (!title || !description) {
      return NextResponse.json("Title and description are required", {
        status: 400,
      });
    }

    const updatedModule = await useModuleStore.getState().updateModule(module_id, {
      module_name: title,
      module_description: description,
    });
    return NextResponse.json(updatedModule, { status: 200 });
  } catch (error) {
    console.error("Error updating module:", error);
    return NextResponse.json(
      { message: "Failed to update module" },
      { status: 500 }
    );
  }
}
