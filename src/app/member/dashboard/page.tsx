import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { getMemberEnsembles, getMemberSpots, getUser } from "@/lib/firestore";
import MemberEnsembleList from "../MemberEnsembleList";
import MemberSpotList from "../MemberSpotList";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("fb_session")?.value ?? "";

  let uid = "";
  let userDoc: Awaited<ReturnType<typeof getUser>> = null;
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    uid = decoded.uid;
    userDoc = await getUser(uid);
  } catch { /* layout.tsx でリダイレクト済み */ }

  const displayName = userDoc?.displayName ?? "メンバー";
  const bio         = userDoc?.bio ?? "";
  const avatarUrl   = userDoc?.avatarUrl ?? userDoc?.photoURL ?? "";
  const initials    = displayName.slice(0, 1).toUpperCase();

  const [rawEnsembles, rawSpots] = uid
    ? await Promise.all([getMemberEnsembles(uid), getMemberSpots(uid)])
    : [[], []];

  const ensembles = rawEnsembles.map(({ createdAt: _c, updatedAt: _u, ...d }) => d);
  const spots     = rawSpots.map(({ createdAt: _c, updatedAt: _u, ...d }) => d);

  return (
    <div className="space-y-10">

      {/* プロフィールカード */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-3xl p-6"
        style={{ border: "1px solid rgba(0,95,2,0.15)", backgroundColor: "#FFFFFF" }}
      >
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover"
              style={{ boxShadow: "0 0 0 3px white, 0 0 0 5px rgba(0,95,2,0.3)" }}
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{ backgroundColor: "#3C6B4F", boxShadow: "0 0 0 3px white, 0 0 0 5px rgba(0,95,2,0.3)" }}
            >
              {initials}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold mb-1" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
            {displayName}
          </h1>
          {bio ? (
            <p className="text-sm leading-relaxed" style={{ color: "#1A2B1E", opacity: 0.7 }}>{bio}</p>
          ) : (
            <p className="text-sm italic" style={{ color: "#1A2B1E", opacity: 0.35 }}>自己紹介が未設定です</p>
          )}
        </div>
        <a
          href="/member/setup"
          className="flex-shrink-0 flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border transition-all hover:opacity-70"
          style={{ borderColor: "rgba(0,95,2,0.2)", color: "#3C6B4F" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline" }}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          プロフィールを編集
        </a>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="イベント投稿" value={ensembles.length} />
        <StatCard label="イベント公開中" value={ensembles.filter((e) => e.status === "published").length} />
        <StatCard label="拠点投稿" value={spots.length} />
        <StatCard label="拠点公開中" value={spots.filter((s) => s.status === "published").length} />
      </div>

      {/* アンサンブル */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
            投稿したアンサンブル
          </h2>
          <a href="/member/new" className="text-sm font-medium px-5 py-2 rounded-full text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: "#3C6B4F" }}>
            + 新規投稿
          </a>
        </div>
        {ensembles.length === 0 ? <EmptyState label="アンサンブル" href="/member/new" /> : <MemberEnsembleList ensembles={ensembles} />}
      </section>

      {/* 宿泊拠点 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
            投稿した宿泊拠点
          </h2>
          <a href="/member/new-spot" className="text-sm font-medium px-5 py-2 rounded-full text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: "#3C6B4F" }}>
            + 新規投稿
          </a>
        </div>
        {spots.length === 0 ? <EmptyState label="宿泊拠点" href="/member/new-spot" /> : <MemberSpotList spots={spots} />}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
      <p className="text-3xl font-bold mb-1" style={{ color: "#3C6B4F" }}>{value}</p>
      <p className="text-xs" style={{ color: "#1A2B1E" }}>{label}</p>
    </div>
  );
}

function EmptyState({ label, href }: { label: string; href: string }) {
  return (
    <div className="bg-white rounded-2xl p-10 text-center" style={{ border: "1px dashed rgba(0,95,2,0.15)" }}>
      <p className="text-sm mb-4" style={{ color: "#1A2B1E" }}>まだ{label}の投稿がありません</p>
      <a href={href} className="inline-block text-sm font-medium px-5 py-2 rounded-full text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: "#3C6B4F" }}>
        最初の{label}を投稿する
      </a>
    </div>
  );
}
