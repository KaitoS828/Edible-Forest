import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateUserMemberType, type MemberType } from "@/lib/firestore";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { uid } = await params;
  const { memberType, note } = await req.json() as { memberType: MemberType; note: string };

  await updateUserMemberType(uid, memberType, note);
  return NextResponse.json({ ok: true });
}
