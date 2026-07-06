import { NextResponse } from "next/server";
import { defineFixture } from "@/lib/fixtures";

const MOCK = process.env.MOCK_AI !== "false";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { choice?: string };

  if (MOCK) {
    await new Promise((r) => setTimeout(r, 1200));
    return NextResponse.json({
      mock: true,
      data: defineFixture(body.choice ?? ""),
    });
  }

  return NextResponse.json(
    { error: "real AI not wired yet — set MOCK_AI=true" },
    { status: 501 }
  );
}
