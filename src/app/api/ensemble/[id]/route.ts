import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateEnsembleContent } from "@/lib/microcms";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const ok = await updateEnsembleContent(id, body);
  if (!ok) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
