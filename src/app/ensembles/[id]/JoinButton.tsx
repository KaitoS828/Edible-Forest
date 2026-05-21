"use client";

import { useAuth } from "@/contexts/AuthContext";

interface Props {
  ensembleName: string;
  fullWidth?: boolean;
}

export function JoinButton({ ensembleName, fullWidth }: Props) {
  const { user, loading } = useAuth();

  const wFull = fullWidth ? "w-full" : "";

  if (loading) {
    return (
      <div
        className={`h-12 rounded-full animate-pulse ${wFull}`}
        style={{ backgroundColor: "rgba(0,95,2,0.1)", width: fullWidth ? undefined : "200px" }}
      />
    );
  }

  if (user) {
    return (
      <a
        href={`/contact?ensemble=${encodeURIComponent(ensembleName)}`}
        className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90 ${wFull}`}
        style={{ backgroundColor: "#3C6B4F" }}
      >
        参加を問い合わせる →
      </a>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${fullWidth ? "items-stretch" : "items-start"}`}>
      <a
        href={`/join?from=ensemble&name=${encodeURIComponent(ensembleName)}`}
        className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90 ${wFull}`}
        style={{ backgroundColor: "#3C6B4F" }}
      >
        参加を問い合わせる →
      </a>
      <p className="text-xs text-center" style={{ color: "#1A2B1E", opacity: 0.6 }}>
        <a href="/login" className="underline transition-opacity hover:opacity-70" style={{ color: "#3C6B4F" }}>ログイン</a>
        {" "}または{" "}
        <a href="/join" className="underline transition-opacity hover:opacity-70" style={{ color: "#3C6B4F" }}>無料会員登録</a>
        {" "}で詳細確認
      </p>
    </div>
  );
}
