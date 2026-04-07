import { getUser } from "@/lib/firestore";
import type { MemberType } from "@/lib/firestore";
import { notFound } from "next/navigation";
import MemberEditForm from "./MemberEditForm";

export const dynamic = "force-dynamic";

export default async function MemberDetailPage({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;
  const user = await getUser(uid);
  if (!user) notFound();

  const serialized = {
    ...user,
    createdAt:  user.createdAt?.toMillis?.() ?? 0,
    approvedAt: (user as any).approvedAt?.toMillis?.() ?? null,
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <a href="/admin/members" className="text-xs hover:underline" style={{ color: "#3C6B4F" }}>
          ← 会員一覧に戻る
        </a>
      </div>

      <div className="bg-white rounded-2xl p-8 mb-6" style={{ border: "1px solid rgba(60,107,79,0.15)" }}>
        {/* プロフィール */}
        <div className="flex items-center gap-4 mb-8 pb-6" style={{ borderBottom: "1px solid rgba(60,107,79,0.1)" }}>
          {serialized.photoURL ? (
            <img src={serialized.photoURL} alt="" className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: "#3C6B4F" }}>
              {serialized.displayName?.charAt(0) ?? "?"}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#1A2B1E" }}>
              {serialized.displayName || "名前未設定"}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#1A2B1E", opacity: 0.6 }}>{serialized.email}</p>
          </div>
        </div>

        {/* 情報グリッド */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { label: "UID",             value: serialized.uid },
            { label: "登録日",           value: serialized.createdAt ? new Date(serialized.createdAt).toLocaleDateString("ja-JP") : "—" },
            { label: "Stripeステータス", value: serialized.subscriptionStatus ?? "—" },
            { label: "プロフィール完了", value: serialized.profileCompleted ? "完了" : "未完了" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl p-3" style={{ backgroundColor: "#F7FAF7" }}>
              <p className="text-[11px] mb-1" style={{ color: "#1A2B1E", opacity: 0.5 }}>{label}</p>
              <p className="text-xs font-medium break-all" style={{ color: "#1A2B1E" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* 編集フォーム */}
        <MemberEditForm
          uid={uid}
          currentType={(serialized.memberType as MemberType) ?? "free"}
          currentNote={serialized.memberNote ?? ""}
        />
      </div>
    </div>
  );
}
