import { getAllUsers } from "@/lib/firestore";

export const dynamic = "force-dynamic";

const MEMBER_TYPE_LABEL: Record<string, string> = {
  free:       "無料会員",
  member:     "正会員",
  supporter:  "サポーター",
  organizer:  "拠点運営者",
  staff:      "スタッフ",
};

const MEMBER_TYPE_COLOR: Record<string, string> = {
  free:      "#9CA3AF",
  member:    "#3C6B4F",
  supporter: "#5A8D73",
  organizer: "#2563EB",
  staff:     "#7C3AED",
};

export default async function MembersPage() {
  const users = await getAllUsers();

  const serialized = users.map((u) => ({
    ...u,
    createdAt:  u.createdAt?.toMillis?.() ?? 0,
    approvedAt: (u as any).approvedAt?.toMillis?.() ?? null,
  }));

  const stats = {
    total:     serialized.length,
    free:      serialized.filter((u) => !u.memberType || u.memberType === "free").length,
    member:    serialized.filter((u) => u.memberType === "member").length,
    supporter: serialized.filter((u) => u.memberType === "supporter").length,
    organizer: serialized.filter((u) => u.memberType === "organizer").length,
    active:    serialized.filter((u) => u.subscriptionStatus === "active").length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
          会員管理
        </h1>
        <p className="text-sm" style={{ color: "#1A2B1E", opacity: 0.6 }}>
          全会員の一覧・種別管理
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "総会員数",    value: stats.total,     color: "#1A2B1E" },
          { label: "無料会員",    value: stats.free,      color: "#9CA3AF" },
          { label: "正会員",      value: stats.member,    color: "#3C6B4F" },
          { label: "サポーター",  value: stats.supporter, color: "#5A8D73" },
          { label: "拠点運営者",  value: stats.organizer, color: "#2563EB" },
          { label: "Stripe有効",  value: stats.active,    color: "#D97706" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4" style={{ border: "1px solid rgba(60,107,79,0.15)" }}>
            <p className="text-2xl font-bold mb-1" style={{ fontFamily: "'Noto Serif JP', serif", color }}>{value}</p>
            <p className="text-xs" style={{ color: "#1A2B1E", opacity: 0.55 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* 会員テーブル */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(60,107,79,0.15)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#F7FAF7", borderBottom: "1px solid rgba(60,107,79,0.15)" }}>
              {["名前", "メアド", "種別", "Stripe", "登録日", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: "#1A2B1E", opacity: 0.55 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {serialized.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm" style={{ color: "#1A2B1E", opacity: 0.4 }}>
                  会員がいません
                </td>
              </tr>
            )}
            {serialized.map((user, i) => {
              const type  = user.memberType ?? "free";
              const color = MEMBER_TYPE_COLOR[type] ?? "#9CA3AF";
              const label = MEMBER_TYPE_LABEL[type] ?? "無料会員";
              return (
                <tr key={user.uid} style={{ borderBottom: i < serialized.length - 1 ? "1px solid rgba(60,107,79,0.08)" : "none" }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#3C6B4F" }}>
                          {user.displayName?.charAt(0) ?? "?"}
                        </div>
                      )}
                      <span className="font-medium text-xs" style={{ color: "#1A2B1E" }}>{user.displayName || "—"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: "#1A2B1E", opacity: 0.7 }}>{user.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: color }}>
                      {label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {user.subscriptionStatus === "active" ? (
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}>有効</span>
                    ) : user.subscriptionStatus ? (
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>{user.subscriptionStatus}</span>
                    ) : (
                      <span className="text-xs" style={{ color: "#1A2B1E", opacity: 0.35 }}>—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: "#1A2B1E", opacity: 0.5 }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("ja-JP") : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <a
                      href={`/admin/members/${user.uid}`}
                      className="text-xs font-medium px-4 py-1.5 rounded-full border transition-all hover:bg-[#3C6B4F] hover:text-white hover:border-[#3C6B4F]"
                      style={{ borderColor: "rgba(60,107,79,0.3)", color: "#3C6B4F" }}
                    >
                      管理
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
