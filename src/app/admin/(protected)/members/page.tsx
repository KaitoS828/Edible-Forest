import { getAllUsers } from "@/lib/firestore";
import { MEMBER_TYPE_LABELS, type MemberType } from "@/lib/access";
import { CsvDownloadButton } from "./CsvDownloadButton";

export const dynamic = "force-dynamic";

const TYPE_COLOR: Record<MemberType, string> = {
  participant: "#5A8D73",
  organizer:   "#3C6B4F",
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
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
            会員管理
          </h1>
          <p className="text-sm" style={{ color: "#1A2B1E", opacity: 0.6 }}>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "総会員数",         value: stats.total,       color: "#1A2B1E" },
          { label: "参加会員",         value: stats.participant, color: TYPE_COLOR.participant },
          { label: "開催会員",         value: stats.organizer,   color: TYPE_COLOR.organizer },
          { label: "森の奥",           value: stats.inner,       color: TYPE_COLOR.inner },
          { label: "プロフィール完了",  value: stats.completed,   color: "#D97706" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4" style={{ border: "1px solid rgba(60,107,79,0.15)" }}>
            <p className="text-2xl font-bold mb-1" style={{ fontFamily: "'Noto Serif JP', serif", color }}>{value}</p>
            <p className="text-xs" style={{ color: "#1A2B1E", opacity: 0.55 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* 会員テーブル */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(60,107,79,0.15)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: "1100px" }}>
            <thead>
              <tr style={{ backgroundColor: "#F7FAF7", borderBottom: "1px solid rgba(60,107,79,0.15)" }}>
                {[
                  "名前", "ログインメール", "連絡メール", "電話番号",
                  "住所", "会員種別", "紹介者", "完了", "登録日", "",
                ].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap" style={{ color: "#1A2B1E", opacity: 0.55 }}>
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
                  <tr
                    key={user.uid}
                    style={{ borderBottom: isLast ? "none" : "1px solid rgba(60,107,79,0.08)" }}
                  >
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
                          <p className="text-xs font-medium whitespace-nowrap" style={{ color: "#1A2B1E" }}>
                            {user.lastName && user.firstName
                              ? `${user.lastName} ${user.firstName}`
                              : fmt(user.displayName)}
                          </p>
                          {user.lastNameKana && (
                            <p className="text-[10px]" style={{ color: "#1A2B1E", opacity: 0.45 }}>
                              {user.lastNameKana} {user.firstNameKana}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* ログインメール */}
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: "#1A2B1E", opacity: 0.7 }}>
                      {fmt(user.email)}
                    </td>

                    {/* 連絡メール */}
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: "#1A2B1E", opacity: 0.7 }}>
                      {fmt(user.contactEmail)}
                    </td>

                    {/* 電話番号 */}
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: "#1A2B1E", opacity: 0.7 }}>
                      {fmt(user.phone)}
                    </td>

                    {/* 住所 */}
                    <td className="px-4 py-3.5 text-xs" style={{ color: "#1A2B1E", opacity: 0.7, maxWidth: "180px" }}>
                      <span className="block truncate" title={user.address ?? ""}>
                        {fmt(user.address)}
                      </span>
                    </td>

                    {/* 会員種別 */}
                    <td className="px-4 py-3.5">
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full text-white whitespace-nowrap" style={{ backgroundColor: color }}>
                        {label}
                      </span>
                    </td>

                    {/* 紹介者 */}
                    <td className="px-4 py-3.5 text-xs" style={{ color: "#1A2B1E", opacity: 0.7 }}>
                      {fmt(user.referrer)}
                    </td>

                    {/* プロフィール完了 */}
                    <td className="px-4 py-3.5 text-center">
                      {user.profileCompleted ? (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}>完了</span>
                      ) : (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>未完了</span>
                      )}
                    </td>

                    {/* 登録日 */}
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: "#1A2B1E", opacity: 0.5 }}>
                      {fmtDate(user.createdAt)}
                    </td>

                    {/* 操作 */}
                    <td className="px-4 py-3.5 text-right">
                      <a
                        href={`/admin/members/${user.uid}`}
                        className="text-xs font-medium px-4 py-1.5 rounded-full border transition-all hover:bg-[#3C6B4F] hover:text-white hover:border-[#3C6B4F] whitespace-nowrap"
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

        {/* フッター */}
        {users.length > 0 && (
          <div className="px-5 py-3 text-xs text-right" style={{ color: "#1A2B1E", opacity: 0.4, borderTop: "1px solid rgba(60,107,79,0.08)" }}>
            {users.length} 件
          </div>
        )}
      </div>
    </div>
  );
}
