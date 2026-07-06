import { NextResponse } from "next/server";
import { MIRROR_FIXTURE } from "@/lib/fixtures";

const MOCK = process.env.MOCK_AI !== "false";
const MOCK_DELAY_MS = 1500; // 실제 분석 감각 재현

export async function POST(req: Request) {
  await req.json().catch(() => ({})); // answers + tastes (실연동 시 사용)

  if (MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
    return NextResponse.json({ mock: true, data: MIRROR_FIXTURE });
  }

  // 우선순위 2️⃣에서 Claude 실연동 (tech-spec §5)
  return NextResponse.json(
    { error: "real AI not wired yet — set MOCK_AI=true" },
    { status: 501 }
  );
}
