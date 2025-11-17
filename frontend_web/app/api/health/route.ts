import { getJSTTimestamp } from "@/features/shared/lib/dateTime";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      timestamp: getJSTTimestamp(),
    },
    { status: 200 },
  );
}
