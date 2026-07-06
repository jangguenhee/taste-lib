import { NextResponse } from "next/server";
import { TRYON_FIXTURE } from "@/lib/fixtures";

// 아직 실 AI 미연동 — 우선순위 2️⃣는 ②거울·⑦창작만. 연동 전까지 항상 픽스처.
export async function POST(req: Request) {
  await req.json().catch(() => ({}));
  await new Promise((r) => setTimeout(r, 1200));
  return NextResponse.json({ mock: true, data: TRYON_FIXTURE });
}
