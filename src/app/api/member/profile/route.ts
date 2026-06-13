import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { upsertUser, getUser, createFacility } from "@/lib/firestore";
import { applyProfile, type ProfilePayload } from "@/lib/profile";

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("fb_session")?.value ?? "";
    const decoded = await adminAuth.verifySessionCookie(session, true);

    const body = (await req.json()) as ProfilePayload & {
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
    };

    const fields = applyProfile(body);

    // 開催会員の場合は入力された宿泊施設を pending で作成し facilityIds に紐付け
    const facilityIds: string[] = [];
    if (body.registeredAs === "organizer" && Array.isArray(body.facilities)) {
      const existing = await getUser(decoded.uid);
      const ownerName =
        body.displayName?.trim() || existing?.displayName || "メンバー";
      for (const f of body.facilities) {
        const name = typeof f?.name === "string" ? f.name.trim() : "";
        if (!name) continue;
        const id = await createFacility({
          ownerId: decoded.uid,
          ownerName,
          name,
          ...(typeof f.address === "string" && f.address.trim() ? { address: f.address.trim() } : {}),
          ...(typeof f.region === "string" && f.region.trim() ? { region: f.region.trim() } : {}),
          ...(typeof body.operatingBodyName === "string" && body.operatingBodyName.trim()
            ? { operatingBody: body.operatingBodyName.trim() }
            : {}),
        });
        facilityIds.push(id);
      }
    }

    await upsertUser(decoded.uid, {
      ...fields,
      ...(body.displayName?.trim() ? { displayName: body.displayName.trim() } : {}),
      ...(typeof body.bio === "string" ? { bio: body.bio } : {}),
      ...(typeof body.avatarUrl === "string" ? { avatarUrl: body.avatarUrl } : {}),
      ...(facilityIds.length ? { facilityIds } : {}),
      profileCompleted: true,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[profile]", e);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
