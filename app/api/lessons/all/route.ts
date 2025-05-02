"use server";

import { useServerLrStore } from "@/app/store/server/server.store.lr";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const lessonsState = useServerLrStore.getState();
  await lessonsState.getLessons();
  return NextResponse.json(lessonsState.lessons, { status: 200 });
}
