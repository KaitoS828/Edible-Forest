"use client";

import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function ProfileSetupPage() {
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [bio, setBio]                 = useState("");
  const [avatarUrl, setAvatarUrl]     = useState(user?.photoURL ?? "");
  const [uploading, setUploading]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
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
    if (!displayName.trim()) { setError("名前を入力してください"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/member/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: displayName.trim(), bio: bio.trim(), avatarUrl }),
      });
      if (!res.ok) throw new Error();
      window.location.href = "/member/dashboard";
    } catch {
      setError("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  const initials = displayName.trim().slice(0, 1).toUpperCase() || "M";

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="w-full max-w-lg">

        {/* ロゴ */}
        <div className="text-center mb-8">
          <div className="text-lg font-bold" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
            食べられる森
          </div>
          <div className="text-xs" style={{ color: "#1A2B1E" }}>アンサンブル倶楽部</div>
        </div>

        <div
          className="bg-white rounded-3xl px-8 py-10"
          style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(0,95,2,0.15)" }}
        >
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <span
              className="inline-block text-xs font-medium px-3 mb-3"
              style={{ height: "23px", lineHeight: "23px", borderRadius: "11.5px", backgroundColor: "#3C6B4F", color: "white" }}
            >
              STEP 1 / 1
            </span>
            <h1 className="text-xl font-bold mb-1" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
              プロフィールを設定する
            </h1>
            <p className="text-xs" style={{ color: "#1A2B1E", opacity: 0.6 }}>
              他のメンバーに表示されます。後からいつでも変更できます。
            </p>
          </div>

          {error && (
            <p className="text-xs text-center mb-4 py-2 px-3 rounded-xl bg-red-50 text-red-600">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* アバター */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="relative group"
                disabled={uploading}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="アバター"
                    className="w-24 h-24 rounded-full object-cover"
                    style={{ boxShadow: "0 0 0 3px white, 0 0 0 5px #3C6B4F" }}
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white"
                    style={{ backgroundColor: "#3C6B4F", boxShadow: "0 0 0 3px white, 0 0 0 5px #3C6B4F" }}
                  >
                    {initials}
                  </div>
                )}
                {/* ホバー時オーバーレイ */}
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CameraIcon />
                </div>
                {uploading && (
                  <div className="absolute inset-0 rounded-full flex items-center justify-center bg-white/70">
                    <span className="text-xs" style={{ color: "#3C6B4F" }}>アップロード中…</span>
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-xs underline transition-opacity hover:opacity-70"
                style={{ color: "#3C6B4F" }}
              >
                {avatarUrl ? "画像を変更する" : "アイコン画像を追加する"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* 名前 */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#3C6B4F" }}>
                名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="山田 太郎"
                required
                maxLength={40}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
                style={{ border: "1.5px solid rgba(0,95,2,0.2)", color: "#1A2B1E", backgroundColor: "#FFFFFF" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#3C6B4F")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,95,2,0.2)")}
              />
            </div>

            {/* 自己紹介 */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#3C6B4F" }}>
                自己紹介
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="食べられる森に興味を持ったきっかけや、活動への思いなどを自由にお書きください。"
                rows={4}
                maxLength={300}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all resize-none"
                style={{ border: "1.5px solid rgba(0,95,2,0.2)", color: "#1A2B1E", backgroundColor: "#FFFFFF" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#3C6B4F")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,95,2,0.2)")}
              />
              <p className="text-right text-[10px] mt-1" style={{ color: "#1A2B1E", opacity: 0.4 }}>
                {bio.length} / 300
              </p>
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full py-3.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "#3C6B4F" }}
            >
              {saving ? "保存中..." : "プロフィールを保存してはじめる"}
            </button>

            {/* スキップ */}
            <p className="text-center text-xs" style={{ color: "#1A2B1E", opacity: 0.5 }}>
              <a
                href="/member/dashboard"
                className="underline hover:opacity-70"
                style={{ color: "#1A2B1E" }}
              >
                今はスキップする
              </a>
            </p>
          </form>
        </div>
      </div>
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
