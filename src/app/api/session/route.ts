import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { upsertUser, getUser } from "@/lib/firestore";

const SESSION_COOKIE = "fb_session";
const SESSION_EXPIRES_MS = 60 * 60 * 24 * 7 * 1000; // 7日

// 会員登録フォームの追加項目（仮）。6/12 の項目確定時はこの allowlist に追記するだけでよい。
const PROFILE_FIELDS = ["region", "phone", "motivation"] as const;

function sanitizeProfile(profile?: Record<string, unknown>): Record<string, string> {
  if (!profile) return {};
  const out: Record<string, string> = {};
  for (const key of PROFILE_FIELDS) {
    const val = profile[key];
    if (typeof val === "string" && val.trim()) out[key] = val.trim();
  }
  return out;
}

// POST: ログイン → セッションCookieを発行
export async function POST(req: NextRequest) {
  const { idToken, profile } = (await req.json()) as {
    idToken?: string;
    profile?: Record<string, unknown>;
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

    // Firestoreにユーザー情報をupsert（初回は profileCompleted: false）
    // 会員登録フォームの追加項目（profile）は初回作成時のみ書き込む（既存は上書きしない）
    await upsertUser(decoded.uid, {
      uid:         decoded.uid,
      email:       decoded.email ?? "",
      displayName: decoded.name  ?? decoded.email?.split("@")[0] ?? "メンバー",
      photoURL:    decoded.picture ?? "",
      role:        "member",
      ...(!existing ? { profileCompleted: false, memberType: "free" as const, ...sanitizeProfile(profile) } : {}),
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
