import { useModuleStore } from "@/app/store/server/server.store.modules";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { resource_id: string } }
) {
  try {
    const { resource_id } = await params;
    if (!resource_id) {
      return NextResponse.json({ message: "Resource ID is required" }, { status: 400 });
    }
    const modules = await useModuleStore.getState().getModules(resource_id);
    return NextResponse.json(modules, { status: 200 });
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json({ message: "Failed to fetch modules" }, { status: 500 });
  }
}
