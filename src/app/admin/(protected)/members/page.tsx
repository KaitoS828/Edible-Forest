import { getAllUsers } from "@/lib/firestore";
import { MEMBER_TYPE_LABELS, type MemberType } from "@/lib/access";
import { CsvDownloadButton } from "./CsvDownloadButton";

export const dynamic = "force-dynamic";

const TYPE_COLOR: Record<MemberType, string> = {
  participant: "#2563EB",
  organizer:   "#0F766E",
  inner:       "#7C3AED",
};

function fmt(val: unknown): string {
  if (val == null || val === "") return "—";
  return String(val);
}

function fmtDate(createdAt: unknown): string {
  if (!createdAt) return "—";
  const ms = typeof (createdAt as { toMillis?: () => number }).toMillis === "function"
    ? (createdAt as { toMillis: () => number }).toMillis()
    : (createdAt as number);
  return new Date(ms).toLocaleDateString("ja-JP");
}

export default async function MembersPage() {
  const users = await getAllUsers();

  const stats = {
    total:       users.length,
    participant: users.filter((u) => !u.memberType || u.memberType === "participant").length,
    organizer:   users.filter((u) => u.memberType === "organizer").length,
    inner:       users.filter((u) => u.memberType === "inner").length,
    completed:   users.filter((u) => u.profileCompleted).length,
  };

  return (
    <div>
      {/* ページヘッダー */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b pb-5" style={{ borderColor: "#DCE3EA" }}>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
            Members
          </p>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
            会員管理
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#64748B" }}>
            全会員の一覧・種別管理・CSVエクスポート
          </p>
        </div>
        <CsvDownloadButton users={users.map((u) => ({
          uid: u.uid,
          lastName: u.lastName,
          firstName: u.firstName,
          lastNameKana: u.lastNameKana,
          firstNameKana: u.firstNameKana,
          displayName: u.displayName,
          email: u.email,
          contactEmail: u.contactEmail,
          phone: u.phone,
          country: u.country,
          address: u.address,
          memberType: u.memberType,
          occupation: u.occupation,
          interests: u.interests,
          comment: u.comment,
          referrer: u.referrer,
          operatingBodyName: u.operatingBodyName,
          profileCompleted: u.profileCompleted,
          createdAtMs: typeof u.createdAt?.toMillis === "function" ? u.createdAt.toMillis() : null,
        }))} />
      </div>

      {/* 統計カード */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "総会員数",         value: stats.total,       color: "#1A2B1E" },
          { label: "参加会員",         value: stats.participant, color: TYPE_COLOR.participant },
          { label: "開催会員",         value: stats.organizer,   color: TYPE_COLOR.organizer },
          { label: "森の奥",           value: stats.inner,       color: TYPE_COLOR.inner },
          { label: "プロフィール完了",  value: stats.completed,   color: "#D97706" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-md border bg-white p-4" style={{ borderColor: "#DCE3EA" }}>
            <p className="text-xs font-medium" style={{ color: "#64748B" }}>{label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* 会員テーブル */}
      <div className="overflow-hidden rounded-md border bg-white" style={{ borderColor: "#DCE3EA" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: "1100px" }}>
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E5EAF0" }}>
                {[
                  "名前", "ログインメール", "連絡メール", "電話番号",
                  "住所", "会員種別", "紹介者", "完了", "登録日", "",
                ].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#64748B" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-sm" style={{ color: "#1A2B1E", opacity: 0.4 }}>
                    会員がいません
                  </td>
                </tr>
              )}
              {users.map((user, i) => {
                const type  = (user.memberType ?? "participant") as MemberType;
                const color = TYPE_COLOR[type] ?? "#5A8D73";
                const label = MEMBER_TYPE_LABELS[type] ?? "参加会員";
                const isLast = i === users.length - 1;

                return (
                  <tr key={user.uid} style={{ borderBottom: isLast ? "none" : "1px solid #EEF2F6" }}>
                    {/* 名前 */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#3C6B4F" }}>
                            {(user.lastName ?? user.displayName ?? "?").charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                            <p className="whitespace-nowrap text-xs font-medium" style={{ color: "#0F172A" }}>
                            {user.lastName && user.firstName
                              ? `${user.lastName} ${user.firstName}`
                              : fmt(user.displayName)}
                          </p>
                          {user.lastNameKana && (
                            <p className="text-[10px]" style={{ color: "#64748B" }}>
                              {user.lastNameKana} {user.firstNameKana}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* ログインメール */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs" style={{ color: "#475569" }}>
                      {fmt(user.email)}
                    </td>

                    {/* 連絡メール */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs" style={{ color: "#475569" }}>
                      {fmt(user.contactEmail)}
                    </td>

                    {/* 電話番号 */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs" style={{ color: "#475569" }}>
                      {fmt(user.phone)}
                    </td>

                    {/* 住所 */}
                    <td className="px-4 py-3.5 text-xs" style={{ color: "#475569", maxWidth: "180px" }}>
                      <span className="block truncate" title={user.address ?? ""}>
                        {fmt(user.address)}
                      </span>
                    </td>

                    {/* 会員種別 */}
                    <td className="px-4 py-3.5">
                      <span className="whitespace-nowrap rounded px-2.5 py-1 text-[11px] font-medium text-white" style={{ backgroundColor: color }}>
                        {label}
                      </span>
                    </td>

                    {/* 紹介者 */}
                    <td className="px-4 py-3.5 text-xs" style={{ color: "#475569" }}>
                      {fmt(user.referrer)}
                    </td>

                    {/* プロフィール完了 */}
                    <td className="px-4 py-3.5 text-center">
                      {user.profileCompleted ? (
                        <span className="rounded px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}>完了</span>
                      ) : (
                        <span className="rounded px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>未完了</span>
                      )}
                    </td>

                    {/* 登録日 */}
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs" style={{ color: "#64748B" }}>
                      {fmtDate(user.createdAt)}
                    </td>

                    {/* 操作 */}
                    <td className="px-4 py-3.5 text-right">
                      <a
                        href={`/admin/members/${user.uid}`}
                        className="whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-slate-50"
                        style={{ borderColor: "#CBD5E1", color: "#334155" }}
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

        {/* フッター */}
        {users.length > 0 && (
          <div className="px-5 py-3 text-right text-xs" style={{ color: "#64748B", borderTop: "1px solid #EEF2F6" }}>
            {users.length} 件
          </div>
        )}
      </div>
    </div>
  );
}
