import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { getMemberEnsembles, getMemberSpots } from "@/lib/firestore";
import MemberEnsembleList from "../MemberEnsembleList";
import MemberSpotList from "../MemberSpotList";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("fb_session")?.value ?? "";

  let uid = "";
  let displayName = "";
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    uid = decoded.uid;
    displayName = decoded.name ?? decoded.email?.split("@")[0] ?? "メンバー";
  } catch { /* layout.tsx でリダイレクト済み */ }

  const [rawEnsembles, rawSpots] = uid
    ? await Promise.all([getMemberEnsembles(uid), getMemberSpots(uid)])
    : [[], []];

  const ensembles = rawEnsembles.map(({ createdAt: _c, updatedAt: _u, ...d }) => d);
  const spots     = rawSpots.map(({ createdAt: _c, updatedAt: _u, ...d }) => d);

  return (
    <div className="space-y-10">
      {/* ウェルカムバナー */}
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}>
          ようこそ、{displayName} さん
        </h1>
        <p className="text-sm" style={{ color: "#000000" }}>
          イベント（アンサンブル）と拠点（宿泊施設）を管理できます
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="イベント投稿" value={ensembles.length} />
        <StatCard label="イベント公開中" value={ensembles.filter((e) => e.status === "published").length} />
        <StatCard label="拠点投稿" value={spots.length} />
        <StatCard label="拠点公開中" value={spots.filter((s) => s.status === "published").length} />
      </div>

      {/* ── アンサンブル ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}>
            投稿したアンサンブル
          </h2>
          <a
            href="/member/new"
            className="text-sm font-medium px-5 py-2 rounded-full text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#005F02" }}
          >
            + 新規投稿
          </a>
        </div>
        {ensembles.length === 0 ? (
          <EmptyState label="アンサンブル" href="/member/new" />
        ) : (
          <MemberEnsembleList ensembles={ensembles} />
        )}
      </section>

      {/* ── 宿泊拠点 ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}>
            投稿した宿泊拠点
          </h2>
          <a
            href="/member/new-spot"
            className="text-sm font-medium px-5 py-2 rounded-full text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#005F02" }}
          >
            + 新規投稿
          </a>
        </div>
        {spots.length === 0 ? (
          <EmptyState label="宿泊拠点" href="/member/new-spot" />
        ) : (
          <MemberSpotList spots={spots} />
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
      <p className="text-3xl font-bold mb-1" style={{ color: "#005F02" }}>{value}</p>
      <p className="text-xs" style={{ color: "#000000" }}>{label}</p>
    </div>
  );
}

function EmptyState({ label, href }: { label: string; href: string }) {
  return (
    <div className="bg-white rounded-2xl p-10 text-center" style={{ border: "1px dashed rgba(0,95,2,0.15)" }}>
      <p className="text-sm mb-4" style={{ color: "#000000" }}>まだ{label}の投稿がありません</p>
      <a href={href} className="inline-block text-sm font-medium px-5 py-2 rounded-full text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: "#005F02" }}>
        最初の{label}を投稿する
      </a>
    </div>
  );
}
