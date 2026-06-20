import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateEventStatus, type EventStatus } from "@/lib/firestore";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(session.user as Record<string, unknown>).isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json() as { status: EventStatus };
  if (!["pending", "published", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  await updateEventStatus(id, status);
  return NextResponse.json({ ok: true });
}
