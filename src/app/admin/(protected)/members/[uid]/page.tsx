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
    <div className="max-w-3xl">
      <div className="mb-6">
        <a href="/admin/members" className="text-xs font-medium hover:underline" style={{ color: "#475569" }}>
          ← 会員一覧に戻る
        </a>
      </div>

      <div className="mb-6 rounded-md border bg-white p-6" style={{ borderColor: "#DCE3EA" }}>
        {/* プロフィール */}
        <div className="mb-6 flex items-center gap-4 border-b pb-5" style={{ borderColor: "#E5EAF0" }}>
          {serialized.photoURL ? (
            <img src={serialized.photoURL} alt="" className="h-12 w-12 rounded-md object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-md text-lg font-semibold text-white" style={{ backgroundColor: "#334155" }}>
              {serialized.displayName?.charAt(0) ?? "?"}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "#0F172A" }}>
              {serialized.displayName || "名前未設定"}
            </h1>
            <p className="mt-0.5 text-sm" style={{ color: "#64748B" }}>{serialized.email}</p>
          </div>
        </div>

        {/* 情報グリッド */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: "UID",             value: serialized.uid },
            { label: "登録日",           value: serialized.createdAt ? new Date(serialized.createdAt).toLocaleDateString("ja-JP") : "—" },
            { label: "Stripeステータス", value: serialized.subscriptionStatus ?? "—" },
            { label: "プロフィール完了", value: serialized.profileCompleted ? "完了" : "未完了" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-md border p-3" style={{ backgroundColor: "#F8FAFC", borderColor: "#E5EAF0" }}>
              <p className="mb-1 text-[11px] font-medium" style={{ color: "#64748B" }}>{label}</p>
              <p className="break-all text-xs font-medium" style={{ color: "#0F172A" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* 編集フォーム */}
        <MemberEditForm
          uid={uid}
          currentType={(serialized.memberType as MemberType) ?? "participant"}
          currentNote={serialized.memberNote ?? ""}
        />
      </div>
    </div>
  );
}
