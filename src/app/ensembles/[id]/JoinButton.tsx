"use client";

import { useAuth } from "@/contexts/AuthContext";

interface Props {
  ensembleName: string;
}

export function JoinButton({ ensembleName }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="h-12 rounded-full animate-pulse"
        style={{ backgroundColor: "rgba(0,95,2,0.1)", width: "200px" }}
      />
    );
  }

  if (user) {
    return (
      <a
        href={`/contact?ensemble=${encodeURIComponent(ensembleName)}`}
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#005F02" }}
      >
        このアンサンブルに参加する →
      </a>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        disabled
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium cursor-not-allowed"
        style={{
          backgroundColor: "rgba(0,95,2,0.08)",
          color: "rgba(0,95,2,0.35)",
          border: "1px solid rgba(0,95,2,0.15)",
        }}
      >
        このアンサンブルに参加する
      </button>
      <p className="text-xs" style={{ color: "#000000" }}>
        参加するには{" "}
        <a
          href="/login"
          className="underline font-medium transition-opacity hover:opacity-70"
          style={{ color: "#005F02" }}
        >
          ログイン
        </a>
        {" "}または{" "}
        <a
          href="/join"
          className="underline font-medium transition-opacity hover:opacity-70"
          style={{ color: "#005F02" }}
        >
          会員登録
        </a>
        {" "}が必要です。
      </p>
    </div>
  );
}
