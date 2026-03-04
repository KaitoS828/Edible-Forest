import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { upsertUser, getUser } from "@/lib/firestore";

const SESSION_COOKIE = "fb_session";
const SESSION_EXPIRES_MS = 60 * 60 * 24 * 7 * 1000; // 7日

// POST: ログイン → セッションCookieを発行
export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  if (!idToken) return NextResponse.json({ error: "No token" }, { status: 400 });

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);

    // 既存ユーザー情報を取得（プロフィール設定済みか確認）
    const existing = await getUser(decoded.uid);
    const profileCompleted = existing?.profileCompleted ?? false;

    // Firestoreにユーザー情報をupsert（初回は profileCompleted: false）
    await upsertUser(decoded.uid, {
      uid:         decoded.uid,
      email:       decoded.email ?? "",
      displayName: decoded.name  ?? decoded.email?.split("@")[0] ?? "メンバー",
      photoURL:    decoded.picture ?? "",
      role:        "member",
      ...(!existing ? { profileCompleted: false } : {}),
    });

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_MS,
    });

    const res = NextResponse.json({ ok: true, profileCompleted });
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

// DELETE: ログアウト → Cookie削除
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
