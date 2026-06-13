"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { resolveEventGate } from "@/lib/access";

interface Props {
  ensembleName: string;
  fullWidth?: boolean;
  /** 会員限定イベントか（省略時 false = 一般公開扱いで従来通り動作） */
  memberOnly?: boolean;
}

export function JoinButton({
  ensembleName,
  fullWidth,
  memberOnly = false,
}: Props) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const wFull = fullWidth ? "w-full" : "";

  if (loading) {
    return (
      <div
        className={`h-12 rounded-full animate-pulse ${wFull}`}
        style={{ backgroundColor: "rgba(0,95,2,0.1)", width: fullWidth ? undefined : "200px" }}
      />
    );
  }

  const gate = resolveEventGate({
    memberOnly,
    isLoggedIn: !!user,
  });

  const primaryBtn =
    `inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90 ${wFull}`;

  // 一般公開イベント or 参加可能 → 通常の参加ボタン
  if (gate.kind === "open" || gate.kind === "joinable") {
    return (
      <a
        href={`/contact?ensemble=${encodeURIComponent(ensembleName)}`}
        className={primaryBtn}
        style={{ backgroundColor: "#3C6B4F" }}
      >
        参加する →
      </a>
    );
  }

  // 未ログイン ×会員限定 → 「無料会員登録して参加」（前向きな登録導線）
  const callbackUrl = encodeURIComponent(pathname || `/ensembles`);
  return (
    <div className={`flex flex-col gap-2 ${fullWidth ? "items-stretch" : "items-start"}`}>
      <a
        href={`/signup?callbackUrl=${callbackUrl}`}
        className={primaryBtn}
        style={{ backgroundColor: "#3C6B4F" }}
      >
        無料会員登録して参加 →
      </a>
      <p className="text-xs text-center" style={{ color: "#1A2B1E", opacity: 0.6 }}>
        すでに会員の方は{" "}
        <a
          href={`/login?callbackUrl=${callbackUrl}`}
          className="underline transition-opacity hover:opacity-70"
          style={{ color: "#3C6B4F" }}
        >
          ログイン
        </a>
      </p>
    </div>
  );
}
