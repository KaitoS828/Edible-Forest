"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { resolveEventGate, type MemberType } from "@/lib/access";

interface Props {
  ensembleName: string;
  fullWidth?: boolean;
  /** 会員限定イベントか（省略時 false = 一般公開扱いで従来通り動作） */
  memberOnly?: boolean;
  /** 参加に必要な最低種別（省略時は member） */
  requiredType?: MemberType;
  /** ログインユーザーの種別（省略時は AuthContext から判定。種別は未取得のため未指定時 undefined） */
  memberType?: MemberType | null;
}

export function JoinButton({
  ensembleName,
  fullWidth,
  memberOnly = false,
  requiredType = "member",
  memberType,
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
    memberType,
    requiredType,
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

  // 未ログイン → 「無料会員登録して参加」（前向きな登録導線）
  if (gate.kind === "needs_login") {
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

  // ログイン済みだが種別不足 → 控えめ表示 + アップグレード導線
  return (
    <div className={`flex flex-col gap-2 ${fullWidth ? "items-stretch" : "items-start"}`}>
      <span
        className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium cursor-not-allowed ${wFull}`}
        style={{
          backgroundColor: "transparent",
          color: "#3C6B4F",
          border: "1px solid rgba(60,107,79,0.3)",
          opacity: 0.55,
        }}
      >
        会員限定イベント
      </span>
      <p className="text-xs text-center" style={{ color: "#1A2B1E", opacity: 0.7 }}>
        正会員になると参加できます{" "}
        <a
          href="/join"
          className="underline transition-opacity hover:opacity-70"
          style={{ color: "#3C6B4F" }}
        >
          会員種別をアップグレード
        </a>
      </p>
    </div>
  );
}
