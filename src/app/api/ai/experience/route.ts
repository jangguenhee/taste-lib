import { NextResponse } from "next/server";
import { EXPERIENCE_FIXTURE } from "@/lib/fixtures";

const MOCK = process.env.MOCK_AI !== "false";

export async function POST(req: Request) {
  await req.json().catch(() => ({}));

  if (MOCK) {
    await new Promise((r) => setTimeout(r, 1200));
    return NextResponse.json({ mock: true, data: EXPERIENCE_FIXTURE });
  }

  return NextResponse.json(
    { error: "real AI not wired yet — set MOCK_AI=true" },
    { status: 501 }
  );
}
