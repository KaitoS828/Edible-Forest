import { NextResponse } from "next/server";
import { getPublishedSpots } from "@/lib/firestore";

export async function GET() {
  try {
    const spots = await getPublishedSpots();
    const data = spots.map(({ createdAt: _c, updatedAt: _u, ...s }) => s);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
