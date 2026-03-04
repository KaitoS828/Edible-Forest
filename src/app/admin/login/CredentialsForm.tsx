"use client";

import { useActionState } from "react";
import { loginWithCredentials } from "@/actions/auth";

export default function CredentialsForm() {
  const [error, action, isPending] = useActionState(loginWithCredentials, null);

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm border outline-none focus:border-[#005F02] transition-colors";
  const inputStyle = {
    borderColor: "rgba(0,95,2,0.15)",
    backgroundColor: "white",
    color: "#005F02",
  };

  return (
    <form action={action} className="flex flex-col gap-3">
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium mb-1.5"
          style={{ color: "#000000" }}
        >
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="admin@example.com"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-medium mb-1.5"
          style={{ color: "#000000" }}
        >
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {error && (
        <p
          className="text-xs px-3 py-2 rounded-lg"
          style={{ backgroundColor: "#FFF0F0", color: "#E05555" }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 mt-1"
        style={{ backgroundColor: "#005F02" }}
      >
        {isPending ? "ログイン中…" : "ログイン"}
      </button>
    </form>
  );
}
