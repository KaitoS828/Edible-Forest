"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { Ensemble } from "@/lib/microcms";

export default function EnsembleList({ ensembles }: { ensembles: Ensemble[] }) {
  const { user, loading } = useAuth();
  const isLoggedIn = !loading && !!user;

  const forestTypes = ["すべて", ...Array.from(new Set(ensembles.map((e) => e.forestType).filter(Boolean) as string[]))];
  const [selected, setSelected] = useState("すべて");

  const filtered = ensembles.filter(
    (e) => selected === "すべて" || e.forestType === selected
  );

  return (
    <>
      {/* 非ログイン時のCTA */}
      {!loading && !isLoggedIn && (
        <div className="border-b" style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(0,95,2,0.15)" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm" style={{ color: "#3C6B4F" }}>
              会員登録すると、イベント参加・宿泊予約など全ての機能が使えます。
            </p>
            <div className="flex gap-2 shrink-0">
              <a href="/login" className="px-4 py-2 rounded-full text-xs font-medium border transition-colors hover:opacity-80" style={{ borderColor: "rgba(0,95,2,0.15)", color: "#1A2B1E" }}>
                ログイン
              </a>
              <a href="/join" className="px-4 py-2 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "#3C6B4F" }}>
                会員登録する
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 森タイプフィルター */}
      {forestTypes.length > 1 && (
        <section className="py-6 bg-white border-b" style={{ borderColor: "rgba(0,95,2,0.15)" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            <div className="flex flex-wrap gap-2">
              {forestTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelected(t)}
                  className="text-xs px-4 py-1.5 rounded-full border transition-colors"
                  style={{
                    backgroundColor: selected === t ? "#3C6B4F" : "white",
                    color: selected === t ? "white" : "#3C6B4F",
                    borderColor: "#3C6B4F",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* アンサンブル一覧グリッド */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm" style={{ color: "#1A2B1E" }}>該当するアンサンブルはありません</p>
            </div>
          ) : (
            <>
              <p className="text-xs mb-8" style={{ color: "#1A2B1E" }}>
                {filtered.length} 件のアンサンブル
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
                {filtered.map((e) => (
                  <a key={e.id} href={`/ensembles/${e.id}`} className="group flex flex-col items-center text-center">
                    <div
                      className="relative overflow-hidden rounded-full mb-4 transition-transform duration-500 group-hover:scale-[1.04]"
                      style={{
                        width: "160px",
                        height: "160px",
                        boxShadow: "0 0 0 4px white, 0 0 0 6px rgba(60,107,79,0.25)",
                        backgroundColor: "#F0F6F2",
                      }}
                    >
                      {e.heroImage ? (
                        <img src={e.heroImage.url} alt={e.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>
                      )}
                    </div>
                    {e.forestType && (
                      <span
                        className="inline-block text-[11px] font-medium px-3 mb-2"
                        style={{ height: "20px", lineHeight: "20px", borderRadius: "10px", backgroundColor: "#3C6B4F", color: "white" }}
                      >
                        {e.forestType}
                      </span>
                    )}
                    <h2 className="text-sm font-bold mb-1 group-hover:text-[#3C6B4F] transition-colors" style={{ color: "#3C6B4F" }}>
                      {e.title}
                    </h2>
                    {e.sub && <p className="text-xs" style={{ color: "#1A2B1E" }}>{e.sub}</p>}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
