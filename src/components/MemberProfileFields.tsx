"use client";

import { INTEREST_OPTIONS, MEMBER_TYPE_LABELS } from "@/lib/access";

export type FacilityInput = { name: string; address: string; region: string };

export type ProfileFormState = {
  registeredAs: "participant" | "organizer";
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  noKana: boolean;
  country: string;
  address: string;
  contactEmail: string;
  sameAsLogin: boolean;
  phone: string;
  interests: string[];
  occupation: string;
  comment: string;
  operatingBodyName: string;
  facilities: FacilityInput[];
};

export const emptyProfileForm: ProfileFormState = {
  registeredAs: "participant",
  lastName: "",
  firstName: "",
  lastNameKana: "",
  firstNameKana: "",
  noKana: false,
  country: "日本",
  address: "",
  contactEmail: "",
  sameAsLogin: false,
  phone: "",
  interests: [],
  occupation: "",
  comment: "",
  operatingBodyName: "",
  facilities: [{ name: "", address: "", region: "" }],
};

const ic =
  "w-full px-4 py-2.5 rounded-2xl text-base outline-none bg-gray-50 border border-transparent focus:border-green-700 transition-colors";

/** 会員プロフィールの必須項目を検証。OK なら null、NG ならエラーメッセージを返す */
export function validateProfileForm(
  form: ProfileFormState,
  opts: { requireLoginEmail: boolean }
): string | null {
  if (!form.lastName.trim() || !form.firstName.trim()) return "姓・名を入力してください";
  if (!form.noKana && (!form.lastNameKana.trim() || !form.firstNameKana.trim()))
    return "フリガナを入力してください（外国人の方はチェックを入れてください）";
  if (!form.country.trim()) return "居住国を入力してください";
  if (!form.address.trim()) return "住所を入力してください";
  if (opts.requireLoginEmail && !form.contactEmail.trim()) return "連絡用メールを入力してください";
  return null;
}

type Props = {
  form: ProfileFormState;
  setForm: React.Dispatch<React.SetStateAction<ProfileFormState>>;
  /** ログイン用メール。「ログイン用と同じ」チェック時に連絡用へ補完する */
  loginEmail?: string;
};

const MEMBER_TYPE_OPTIONS: { value: "participant" | "organizer"; desc: string }[] = [
  { value: "participant", desc: "イベントに参加して各地のアンサンブルを楽しむ" },
  { value: "organizer", desc: "宿泊施設を登録し、自らイベントを開催する" },
];

export function MemberProfileFields({ form, setForm, loginEmail }: Props) {
  function set<K extends keyof ProfileFormState>(key: K, val: ProfileFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function toggleInterest(value: string) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((v) => v !== value)
        : [...prev.interests, value],
    }));
  }

  function updateFacility(i: number, key: keyof FacilityInput, val: string) {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.map((f, idx) => (idx === i ? { ...f, [key]: val } : f)),
    }));
  }

  function addFacility() {
    setForm((prev) => ({ ...prev, facilities: [...prev.facilities, { name: "", address: "", region: "" }] }));
  }

  function removeFacility(i: number) {
    setForm((prev) => ({ ...prev, facilities: prev.facilities.filter((_, idx) => idx !== i) }));
  }

  function toggleSameAsLogin(checked: boolean) {
    setForm((prev) => ({
      ...prev,
      sameAsLogin: checked,
      contactEmail: checked && loginEmail ? loginEmail : prev.contactEmail,
    }));
  }

  return (
    <div className="space-y-5">
      {/* 会員種別の2分岐 */}
      <FormSection title="会員種別を選ぶ">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MEMBER_TYPE_OPTIONS.map((opt) => {
            const active = form.registeredAs === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => set("registeredAs", opt.value)}
                className="text-left rounded-2xl p-4 transition-colors"
                style={{
                  border: `1.5px solid ${active ? "#3C6B4F" : "rgba(60,107,79,0.15)"}`,
                  backgroundColor: active ? "#F0F6F2" : "#FFFFFF",
                }}
              >
                <p className="text-base font-bold mb-1" style={{ color: "#3C6B4F" }}>
                  {MEMBER_TYPE_LABELS[opt.value]}
                </p>
                <p className="text-sm" style={{ color: "#1A2B1E", opacity: 0.7 }}>
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </FormSection>

      {/* お名前 */}
      <FormSection title="お名前">
        <div className="grid grid-cols-2 gap-3">
          <Field label="姓" required>
            <input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="山田" className={ic} />
          </Field>
          <Field label="名" required>
            <input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="太郎" className={ic} />
          </Field>
        </div>
        {!form.noKana && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="姓フリガナ" required>
              <input value={form.lastNameKana} onChange={(e) => set("lastNameKana", e.target.value)} placeholder="ヤマダ" className={ic} />
            </Field>
            <Field label="名フリガナ" required>
              <input value={form.firstNameKana} onChange={(e) => set("firstNameKana", e.target.value)} placeholder="タロウ" className={ic} />
            </Field>
          </div>
        )}
        <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "#1A2B1E" }}>
          <input type="checkbox" checked={form.noKana} onChange={(e) => set("noKana", e.target.checked)} className="accent-green-700" />
          外国人なのでフリガナ無し
        </label>
      </FormSection>

      {/* 居住地 */}
      <FormSection title="居住地">
        <Field label="居住国" required>
          <input value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="日本" className={ic} />
        </Field>
        <Field label="住所" required>
          <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="例：北海道広尾町〇〇1-2-3" className={ic} />
        </Field>
      </FormSection>

      {/* 連絡先 */}
      <FormSection title="連絡先">
        <Field label="連絡用メールアドレス" required>
          <input
            type="email"
            value={form.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)}
            disabled={form.sameAsLogin}
            placeholder="contact@email.com"
            className={ic}
          />
        </Field>
        {loginEmail !== undefined && (
          <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "#1A2B1E" }}>
            <input type="checkbox" checked={form.sameAsLogin} onChange={(e) => toggleSameAsLogin(e.target.checked)} className="accent-green-700" />
            ログイン用メールと同じ
          </label>
        )}
        <Field label="電話番号（任意・携帯推奨）">
          <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="090-0000-0000" className={ic} />
        </Field>
      </FormSection>

      {/* 興味分野 */}
      <FormSection title="興味分野（複数選択可）">
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((opt) => {
            const active = form.interests.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleInterest(opt)}
                className="px-4 py-1.5 rounded-full text-sm transition-colors"
                style={{
                  border: `1.5px solid ${active ? "#3C6B4F" : "rgba(60,107,79,0.15)"}`,
                  backgroundColor: active ? "#3C6B4F" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#1A2B1E",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </FormSection>

      {/* プロフィール */}
      <FormSection title="プロフィール（任意）">
        <Field label="職業">
          <input value={form.occupation} onChange={(e) => set("occupation", e.target.value)} placeholder="例：農業・会社員・学生" className={ic} />
        </Field>
        <Field label="コメント（自己紹介）">
          <textarea value={form.comment} onChange={(e) => set("comment", e.target.value)} rows={3} placeholder="食べられる森に興味を持ったきっかけや活動への思いなどを自由にお書きください" className={ic} />
        </Field>
      </FormSection>

      {/* 開催会員のみ：宿泊施設 */}
      {form.registeredAs === "organizer" && (
        <FormSection title="運営する宿泊施設">
          <p className="text-sm mb-1" style={{ color: "#1A2B1E", opacity: 0.7 }}>
            登録した施設は審査中（pending）として登録され、本部の承認後にイベント会場として選べます。
          </p>
          <Field label="運営母体名">
            <input value={form.operatingBodyName} onChange={(e) => set("operatingBodyName", e.target.value)} placeholder="例：株式会社〇〇 / 〇〇ファーム" className={ic} />
          </Field>
          <div className="space-y-3">
            {form.facilities.map((f, i) => (
              <div key={i} className="rounded-2xl p-4 space-y-2" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: "#3C6B4F" }}>施設 {i + 1}</span>
                  {form.facilities.length > 1 && (
                    <button type="button" onClick={() => removeFacility(i)} className="text-sm underline" style={{ color: "#1A2B1E", opacity: 0.6 }}>
                      削除
                    </button>
                  )}
                </div>
                <Field label="施設名">
                  <input value={f.name} onChange={(e) => updateFacility(i, "name", e.target.value)} placeholder="例：森の宿〇〇" className={ic} />
                </Field>
                <Field label="住所（任意）">
                  <input value={f.address} onChange={(e) => updateFacility(i, "address", e.target.value)} placeholder="例：北海道広尾町〇〇" className={ic} />
                </Field>
                <Field label="地域（任意）">
                  <input value={f.region} onChange={(e) => updateFacility(i, "region", e.target.value)} placeholder="例：北海道" className={ic} />
                </Field>
              </div>
            ))}
          </div>
          <button type="button" onClick={addFacility} className="text-sm underline" style={{ color: "#3C6B4F" }}>
            ＋ 施設を追加する
          </button>
        </FormSection>
      )}
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 space-y-3" style={{ border: "1px solid rgba(0,95,2,0.15)" }}>
      <p className="text-base font-bold" style={{ color: "#3C6B4F" }}>{title}</p>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm mb-1.5" style={{ color: "#777777" }}>
        {label}
        {required && <span className="text-red-500"> ＊</span>}
      </label>
      {children}
    </div>
  );
}
