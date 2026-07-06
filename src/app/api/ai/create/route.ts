import { NextResponse } from "next/server";
import { createFixture } from "@/lib/fixtures";

const MOCK = process.env.MOCK_AI !== "false";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    reflection?: string;
    concept?: string;
  };

  if (MOCK) {
    await new Promise((r) => setTimeout(r, 1500));
    return NextResponse.json({
      mock: true,
      data: createFixture(body.reflection ?? "", body.concept ?? "나"),
    });
  }

  return NextResponse.json(
    { error: "real AI not wired yet — set MOCK_AI=true" },
    { status: 501 }
  );
}
