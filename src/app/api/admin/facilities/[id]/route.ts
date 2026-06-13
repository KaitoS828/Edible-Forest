import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateFacilityStatus, type FacilityStatus } from "@/lib/firestore";

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
  const { status } = await req.json() as { status: FacilityStatus };

  await updateFacilityStatus(id, status);
  return NextResponse.json({ ok: true });
}
