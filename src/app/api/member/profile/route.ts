import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { upsertUser } from "@/lib/firestore";

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("fb_session")?.value ?? "";
    const decoded = await adminAuth.verifySessionCookie(session, true);

    const { displayName, bio, avatarUrl } = await req.json() as {
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
    };

    await upsertUser(decoded.uid, {
      ...(displayName !== undefined && { displayName }),
      ...(bio         !== undefined && { bio }),
      ...(avatarUrl   !== undefined && { avatarUrl }),
      profileCompleted: true,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[profile]", e);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
