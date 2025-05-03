import { useModuleStore } from "@/app/store/server/server.store.modules";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET(
  _: Request,
  params: { params: { resource_id: string; module_id: string } }
) {
  const { resource_id, module_id } = params.params;
  const result = await useModuleStore
    .getState()
    .getModule(resource_id, module_id);
  return NextResponse.json(result, { status: 200 });
}
