import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { upsertUser, getUser, createFacility } from "@/lib/firestore";
import { applyProfile, type ProfilePayload } from "@/lib/profile";

const SESSION_COOKIE = "fb_session";
const SESSION_EXPIRES_MS = 60 * 60 * 24 * 7 * 1000; // 7日

// POST: ログイン → セッションCookieを発行
export async function POST(req: NextRequest) {
  const { idToken, profile } = (await req.json()) as {
    idToken?: string;
    profile?: ProfilePayload;
  };
  if (!idToken) return NextResponse.json({ error: "No token" }, { status: 400 });

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);

    // 管理者アカウントは会員ログイン不可
    if (decoded.admin) {
      return NextResponse.json(
        { error: "管理者アカウントは管理画面からログインしてください" },
        { status: 403 }
      );
    }

    // 既存ユーザー情報を取得（プロフィール設定済みか確認）
    const existing = await getUser(decoded.uid);
    const profileCompleted = existing?.profileCompleted ?? false;
    const displayName = decoded.name ?? decoded.email?.split("@")[0] ?? "メンバー";

    // 基本情報の upsert（memberType はプロフィール確定時に設定するため、ここでは入れない）
    await upsertUser(decoded.uid, {
      uid:         decoded.uid,
      email:       decoded.email ?? "",
      displayName,
      photoURL:    decoded.picture ?? "",
      role:        "member",
      ...(!existing ? { profileCompleted: false } : {}),
    });

    // 新規登録（メール/パスワード）でプロフィールが同時に送られてきた場合は確定処理
    if (!existing && profile) {
      const fields = applyProfile(profile);
      const facilityIds = await createFacilitiesFromProfile(decoded.uid, displayName, profile);
      await upsertUser(decoded.uid, {
        ...fields,
        ...(facilityIds.length ? { facilityIds } : {}),
        profileCompleted: true,
      });
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_MS,
    });

    const res = NextResponse.json({
      ok: true,
      profileCompleted: !existing && profile ? true : profileCompleted,
    });
    res.cookies.set(SESSION_COOKIE, sessionCookie, {
      maxAge:   SESSION_EXPIRES_MS / 1000,
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      path:     "/",
      sameSite: "lax",
    });
    return res;
  } catch (e) {
    console.error("session error", e);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

// 開催会員が入力した宿泊施設を facilities に pending 作成し、ID配列を返す
async function createFacilitiesFromProfile(
  uid: string,
  ownerName: string,
  profile: ProfilePayload
): Promise<string[]> {
  if (profile.registeredAs !== "organizer" || !Array.isArray(profile.facilities)) return [];
  const ids: string[] = [];
  for (const f of profile.facilities) {
    const name = typeof f?.name === "string" ? f.name.trim() : "";
    if (!name) continue;
    const id = await createFacility({
      ownerId: uid,
      ownerName,
      name,
      ...(typeof f.address === "string" && f.address.trim() ? { address: f.address.trim() } : {}),
      ...(typeof f.region === "string" && f.region.trim() ? { region: f.region.trim() } : {}),
      ...(typeof profile.operatingBodyName === "string" && profile.operatingBodyName.trim()
        ? { operatingBody: profile.operatingBodyName.trim() }
        : {}),
    });
    ids.push(id);
  }
  return ids;
}

// DELETE: ログアウト → Cookie削除
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
