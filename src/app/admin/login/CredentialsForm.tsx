"use client";

import { useActionState } from "react";
import { loginWithCredentials } from "@/actions/auth";

export default function CredentialsForm() {
  const [error, action, isPending] = useActionState(loginWithCredentials, null);

  const inputClass =
    "w-full rounded-md border px-3 py-2.5 text-sm outline-none transition-colors focus:border-slate-500";
  const inputStyle = {
    borderColor: "#CBD5E1",
    backgroundColor: "white",
    color: "#0F172A",
  };

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-xs font-medium"
          style={{ color: "#475569" }}
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
          className="mb-1.5 block text-xs font-medium"
          style={{ color: "#475569" }}
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
          className="rounded-md border px-3 py-2 text-xs"
          style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA", color: "#B42318" }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 w-full rounded-md py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "#0F172A" }}
      >
        {isPending ? "ログイン中…" : "ログイン"}
      </button>
    </form>
  );
}
