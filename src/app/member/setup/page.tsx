"use client";

import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  MemberProfileFields,
  emptyProfileForm,
  validateProfileForm,
  type ProfileFormState,
} from "@/components/MemberProfileFields";

export default function ProfileSetupPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileFormState>(emptyProfileForm);
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // アバター画像をFirebase Storageにアップロード
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setError("");
    try {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setAvatarUrl(url);
    } catch {
      setError("画像のアップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldError = validateProfileForm(profile, { requireLoginEmail: true });
    if (fieldError) { setError(fieldError); return; }

    setSaving(true);
    setError("");
    try {
      const displayName = `${profile.lastName} ${profile.firstName}`.trim();
      const res = await fetch("/api/member/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          avatarUrl,
          registeredAs: profile.registeredAs,
          lastName: profile.lastName,
          firstName: profile.firstName,
          lastNameKana: profile.noKana ? "" : profile.lastNameKana,
          firstNameKana: profile.noKana ? "" : profile.firstNameKana,
          country: profile.country,
          address: profile.address,
          contactEmail: profile.sameAsLogin ? (user?.email ?? "") : profile.contactEmail,
          phone: profile.phone,
          interests: profile.interests,
          occupation: profile.occupation,
          comment: profile.comment,
          operatingBodyName: profile.registeredAs === "organizer" ? profile.operatingBodyName : "",
          facilities: profile.registeredAs === "organizer" ? profile.facilities : [],
        }),
      });
      if (!res.ok) throw new Error();
      window.location.href = "/member/dashboard";
    } catch {
      setError("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  const initials = profile.lastName.trim().slice(0, 1).toUpperCase() || (user?.displayName?.trim().slice(0, 1).toUpperCase() ?? "M");

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-[72px]">
        <section className="py-14 md:py-20">
          <div className="max-w-[680px] mx-auto px-5">

            <div className="text-center mb-10">
              <span className="inline-block text-sm font-medium px-4 mb-4" style={{ height: "24px", lineHeight: "24px", borderRadius: "12px", backgroundColor: "#3C6B4F", color: "white" }}>
                会員情報の登録
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
                プロフィールを登録する
              </h1>
              <p className="text-base" style={{ color: "#1A2B1E" }}>
                会員種別とプロフィールを入力してください。後からいつでも変更できます。
              </p>
            </div>

            {error && (
              <p className="text-sm text-center mb-4 py-2 px-3 rounded-xl bg-red-50 text-red-600">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* アバター */}
              <div className="flex flex-col items-center gap-3">
                <button type="button" onClick={() => fileRef.current?.click()} className="relative group" disabled={uploading}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="アバター" className="w-24 h-24 rounded-full object-cover" style={{ boxShadow: "0 0 0 3px white, 0 0 0 5px #3C6B4F" }} />
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white" style={{ backgroundColor: "#3C6B4F", boxShadow: "0 0 0 3px white, 0 0 0 5px #3C6B4F" }}>
                      {initials}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CameraIcon />
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 rounded-full flex items-center justify-center bg-white/70">
                      <span className="text-xs" style={{ color: "#3C6B4F" }}>アップロード中…</span>
                    </div>
                  )}
                </button>
                <button type="button" onClick={() => fileRef.current?.click()} className="text-xs underline transition-opacity hover:opacity-70" style={{ color: "#3C6B4F" }}>
                  {avatarUrl ? "画像を変更する" : "アイコン画像を追加する"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>

              {/* 種別選択＋全プロフィール項目（2分岐） */}
              <MemberProfileFields form={profile} setForm={setProfile} loginEmail={user?.email ?? undefined} />

              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full py-4 rounded-full text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#3C6B4F" }}
              >
                {saving ? "保存中..." : "プロフィールを保存してはじめる"}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}
