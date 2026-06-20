import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { getUser, getUserEventHistory, getAllUsers, type UserDoc, type EventDoc } from "@/lib/firestore";
import { can, memberTypeLabel, type MemberType } from "@/lib/access";

const PRIMARY = "#3C6B4F";
const TEXT = "#1A2B1E";
const BORDER = "1px solid rgba(60,107,79,0.15)";
const SERIF = "'Noto Serif JP', serif";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/** メールを一部表示にマスク（先頭2文字 + ***＠ドメイン） */
function maskEmail(email: string | undefined): string {
  if (!email) return "—";
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const head = local.slice(0, 2);
  return `${head}***＠${domain}`;
}

/** unix ms を「YYYY/MM/DD 更新」表記に */
function fmtUpdated(ms: number | undefined): string | null {
  if (!ms) return null;
  const d = new Date(ms);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} 更新`;
}

/** イベント開催日時の表示 */
function fmtEventDate(ms: number | undefined): string {
  if (!ms) return "日時未定";
  const d = new Date(ms);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("fb_session")?.value ?? "";

  let uid = "";
  let userDoc: UserDoc | null = null;
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    uid = decoded.uid;
    userDoc = await getUser(uid);
  } catch {
    /* layout.tsx でリダイレクト済み */
  }

  const memberType: MemberType | undefined = userDoc?.memberType;
  const typeLabel = memberTypeLabel(memberType);

  const fullName =
    [userDoc?.lastName, userDoc?.firstName].filter(Boolean).join(" ") ||
    userDoc?.displayName ||
    "メンバー";
  const avatarUrl = userDoc?.avatarUrl ?? userDoc?.photoURL ?? "";
  const initials = fullName.slice(0, 1).toUpperCase();

  const fieldUpdatedAt = userDoc?.fieldUpdatedAt ?? {};

  // 年1回更新リマインド: 記録されている最終更新の最古が1年以上前
  const updatedValues = Object.values(fieldUpdatedAt).filter((v): v is number => typeof v === "number");
  const oldestUpdate = updatedValues.length ? Math.min(...updatedValues) : null;
  const needsUpdateReminder = oldestUpdate !== null && Date.now() - oldestUpdate >= ONE_YEAR_MS;

  // イベント履歴
  let organized: EventDoc[] = [];
  let joined: EventDoc[] = [];
  if (uid) {
    try {
      const history = await getUserEventHistory(uid);
      organized = history.organized;
      joined = history.joined;
    } catch {
      /* Firestore 未設定時は空 */
    }
  }

  // 他メンバー閲覧（森の奥のみ）
  let otherMembers: UserDoc[] = [];
  if (can(memberType, "view_members")) {
    try {
      const all = await getAllUsers();
      otherMembers = all.filter((u) => u.uid !== uid);
    } catch {
      /* Firestore 未設定時は空 */
    }
  }

  const profileRows: { label: string; value: string; updated: string | null }[] = [
    { label: "氏名", value: fullName, updated: fmtUpdated(fieldUpdatedAt.lastName ?? fieldUpdatedAt.firstName) },
    { label: "居住国", value: userDoc?.country || "—", updated: fmtUpdated(fieldUpdatedAt.country) },
    { label: "住所", value: userDoc?.address || "—", updated: fmtUpdated(fieldUpdatedAt.address) },
    { label: "電話番号", value: userDoc?.phone || "—", updated: fmtUpdated(fieldUpdatedAt.phone) },
    { label: "興味分野", value: userDoc?.interests?.length ? userDoc.interests.join("、") : "—", updated: fmtUpdated(fieldUpdatedAt.interests) },
    { label: "職業", value: userDoc?.occupation || "—", updated: fmtUpdated(fieldUpdatedAt.occupation) },
    { label: "コメント", value: userDoc?.comment || "—", updated: fmtUpdated(fieldUpdatedAt.comment) },
  ];

  const maskedRows: { label: string; value: string; updated: string | null }[] = [
    { label: "ログイン用メール", value: maskEmail(userDoc?.email), updated: null },
    { label: "パスワード", value: "*******", updated: null },
    { label: "連絡用メール", value: maskEmail(userDoc?.contactEmail), updated: fmtUpdated(fieldUpdatedAt.contactEmail) },
  ];

  return (
    <div className="space-y-10">

      {/* 更新リマインドバナー */}
      {needsUpdateReminder && (
        <div
          className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ border: BORDER, backgroundColor: "#F0F6F2" }}
        >
          <p className="text-sm" style={{ color: TEXT, lineHeight: "1.8" }}>
            最後のプロフィール更新から1年以上が経過しています。プロフィールの更新をお願いします。
          </p>
          <a
            href="/member/setup"
            className="shrink-0 inline-block text-sm font-medium px-5 py-2 rounded-full text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: PRIMARY }}
          >
            プロフィールを更新する →
          </a>
        </div>
      )}

      {/* プロフィールヘッダー */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-3xl p-6"
        style={{ border: BORDER, backgroundColor: "#FFFFFF" }}
      >
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover"
              style={{ boxShadow: "0 0 0 3px white, 0 0 0 5px rgba(0,95,2,0.3)" }}
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{ backgroundColor: PRIMARY, boxShadow: "0 0 0 3px white, 0 0 0 5px rgba(0,95,2,0.3)" }}
            >
              {initials}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-xl font-bold" style={{ fontFamily: SERIF, color: PRIMARY }}>
              {fullName}
            </h1>
            <span
              className="inline-block text-xs font-medium px-3"
              style={{ height: "22px", lineHeight: "22px", borderRadius: "11px", backgroundColor: PRIMARY, color: "white" }}
            >
              {typeLabel}
            </span>
          </div>
          {userDoc?.comment ? (
            <p className="text-sm leading-relaxed" style={{ color: TEXT, opacity: 0.7 }}>{userDoc.comment}</p>
          ) : (
            <p className="text-sm italic" style={{ color: TEXT, opacity: 0.35 }}>コメントが未設定です</p>
          )}
        </div>
        <a
          href="/member/setup"
          className="flex-shrink-0 flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border transition-all hover:opacity-70"
          style={{ borderColor: "rgba(0,95,2,0.2)", color: PRIMARY }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline" }}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          プロフィールを編集
        </a>
      </div>

      {/* プロフィール詳細 */}
      <section>
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: SERIF, color: PRIMARY }}>
          プロフィール
        </h2>
        <div className="bg-white rounded-2xl divide-y" style={{ border: BORDER, borderColor: "rgba(60,107,79,0.15)" }}>
          {profileRows.map((row) => (
            <ProfileRow key={row.label} label={row.label} value={row.value} updated={row.updated} />
          ))}
        </div>
      </section>

      {/* アカウント情報（一部表示） */}
      <section>
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: SERIF, color: PRIMARY }}>
          アカウント情報
        </h2>
        <div className="bg-white rounded-2xl divide-y" style={{ border: BORDER, borderColor: "rgba(60,107,79,0.15)" }}>
          {maskedRows.map((row) => (
            <ProfileRow key={row.label} label={row.label} value={row.value} updated={row.updated} />
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: TEXT, opacity: 0.5 }}>
          メールアドレス・パスワードの変更はプロフィール編集から行えます。
        </p>
      </section>

      {/* イベント開催・登録の導線（create_event を持つ種別のみ） */}
      {can(memberType, "create_event") && (
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: SERIF, color: PRIMARY }}>
            イベントを開催する
          </h2>
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6"
            style={{ border: BORDER }}
          >
            <p className="text-sm" style={{ color: TEXT, lineHeight: "1.9" }}>
              新しいイベントを登録・公開できます。
            </p>
            <a
              href="/member/new-event"
              className="shrink-0 inline-block text-sm font-medium px-6 py-2.5 rounded-full text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: PRIMARY }}
            >
              イベントを登録する →
            </a>
          </div>
        </section>
      )}

      {/* イベント開催履歴（閲覧のみ） */}
      <section>
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: SERIF, color: PRIMARY }}>
          開催したイベント
        </h2>
        {organized.length === 0 ? (
          <EmptyRow label="開催したイベントはまだありません" />
        ) : (
          <div className="space-y-3">
            {organized.map((ev) => (
              <EventRow key={ev.id} title={ev.title} date={fmtEventDate(ev.startAt)} status={ev.status} />
            ))}
          </div>
        )}
      </section>

      {/* イベント参加履歴（閲覧のみ） */}
      <section>
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: SERIF, color: PRIMARY }}>
          参加したイベント
        </h2>
        {joined.length === 0 ? (
          <EmptyRow label="参加したイベントはまだありません" />
        ) : (
          <div className="space-y-3">
            {joined.map((ev) => (
              <EventRow key={ev.id} title={ev.title} date={fmtEventDate(ev.startAt)} />
            ))}
          </div>
        )}
      </section>

      {/* 他メンバーのプロフィール（view_members = 森の奥のみ） */}
      {can(memberType, "view_members") && (
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: SERIF, color: PRIMARY }}>
            他メンバーのプロフィール
          </h2>
          {otherMembers.length === 0 ? (
            <EmptyRow label="表示できるメンバーがいません" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherMembers.map((m) => {
                const name =
                  [m.lastName, m.firstName].filter(Boolean).join(" ") || m.displayName || "メンバー";
                return (
                  <div key={m.uid} className="bg-white rounded-2xl p-5" style={{ border: BORDER }}>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-base font-bold" style={{ fontFamily: SERIF, color: PRIMARY }}>{name}</h3>
                      <span
                        className="inline-block text-xs font-medium px-3"
                        style={{ height: "20px", lineHeight: "20px", borderRadius: "10px", backgroundColor: PRIMARY, color: "white" }}
                      >
                        {memberTypeLabel(m.memberType)}
                      </span>
                    </div>
                    {m.country && (
                      <p className="text-sm" style={{ color: TEXT, opacity: 0.7 }}>居住国: {m.country}</p>
                    )}
                    {m.interests?.length ? (
                      <p className="text-sm" style={{ color: TEXT, opacity: 0.7 }}>興味分野: {m.interests.join("、")}</p>
                    ) : null}
                    {m.occupation && (
                      <p className="text-sm" style={{ color: TEXT, opacity: 0.7 }}>職業: {m.occupation}</p>
                    )}
                    {m.comment && (
                      <p className="text-sm mt-2 leading-relaxed" style={{ color: TEXT, opacity: 0.6 }}>{m.comment}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function ProfileRow({ label, value, updated }: { label: string; value: string; updated: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-4">
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-1" style={{ color: TEXT, opacity: 0.55 }}>{label}</p>
        <p className="text-sm" style={{ color: TEXT, lineHeight: "1.8", wordBreak: "break-word" }}>{value}</p>
      </div>
      {updated && (
        <p className="shrink-0 text-xs" style={{ color: TEXT, opacity: 0.35 }}>{updated}</p>
      )}
    </div>
  );
}

function EventRow({ title, date, status }: { title: string; date: string; status?: EventDoc["status"] }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-white rounded-2xl px-5 py-4" style={{ border: BORDER }}>
      <div className="min-w-0">
        <h3 className="text-base font-bold truncate" style={{ fontFamily: SERIF, color: PRIMARY }}>{title}</h3>
        <p className="text-sm" style={{ color: TEXT, opacity: 0.7 }}>{date}</p>
      </div>
      {status === "pending" && (
        <span
          className="shrink-0 inline-block text-xs font-medium px-3"
          style={{ height: "20px", lineHeight: "20px", borderRadius: "10px", border: BORDER, color: TEXT, opacity: 0.6 }}
        >
          審査待ち
        </span>
      )}
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-8 text-center" style={{ border: "1px dashed rgba(0,95,2,0.15)" }}>
      <p className="text-sm" style={{ color: TEXT, opacity: 0.6 }}>{label}</p>
    </div>
  );
}
