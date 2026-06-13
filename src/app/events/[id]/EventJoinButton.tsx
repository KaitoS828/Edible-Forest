"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { resolveEventGate } from "@/lib/access";

interface Props {
  eventId: string;
  memberOnly: boolean;
  joined: boolean;
}

export function EventJoinButton({ eventId, memberOnly, joined }: Props) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [done, setDone] = useState(joined);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const primaryBtn = "w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-60";

  if (loading) {
    return <div className="h-12 w-full rounded-full animate-pulse" style={{ backgroundColor: "rgba(60,107,79,0.1)" }} />;
  }

  if (done) {
    return (
      <span
        className="w-full inline-flex items-center justify-center px-8 py-3.5 rounded-full text-sm font-medium"
        style={{ backgroundColor: "rgba(60,107,79,0.1)", color: "#3C6B4F" }}
      >
        参加申込済み
      </span>
    );
  }

  const gate = resolveEventGate({ memberOnly, isLoggedIn: !!user });

  async function handleJoin() {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/member/event/${eventId}/join`, { method: "POST" });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("参加に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  // 会員（ログイン済み）→ 参加可。オープンイベントでもログインしていれば参加可。
  if ((gate.kind === "open" || gate.kind === "joinable") && user) {
    return (
      <div className="flex flex-col gap-2">
        <button type="button" onClick={handleJoin} disabled={submitting} className={primaryBtn} style={{ backgroundColor: "#3C6B4F" }}>
          {submitting ? "送信中..." : "参加する →"}
        </button>
        {error && <p className="text-xs text-center text-red-600">{error}</p>}
      </div>
    );
  }

  // 未ログイン → 会員登録に誘導（オープン・会員限定どちらも参加には会員登録が必要）
  const callbackUrl = encodeURIComponent(pathname || `/events`);
  return (
    <div className="flex flex-col gap-2">
      <a href={`/signup?callbackUrl=${callbackUrl}`} className={primaryBtn} style={{ backgroundColor: "#3C6B4F" }}>
        無料会員登録して参加 →
      </a>
      <p className="text-xs text-center" style={{ color: "#1A2B1E", opacity: 0.6 }}>
        すでに会員の方は{" "}
        <a href={`/login?callbackUrl=${callbackUrl}`} className="underline transition-opacity hover:opacity-70" style={{ color: "#3C6B4F" }}>
          ログイン
        </a>
      </p>
    </div>
  );
}
