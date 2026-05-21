import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateUserMemberType, type MemberType } from "@/lib/firestore";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(session.user as Record<string, unknown>).isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { uid } = await params;
  const { memberType, note } = await req.json() as { memberType: MemberType; note: string };

  await updateUserMemberType(uid, memberType, note);
  return NextResponse.json({ ok: true });
}
