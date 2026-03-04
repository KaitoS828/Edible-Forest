"use client";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { ENSEMBLES } from "@/data/ensembles";

const ALL_REGIONS = ["すべて", "北海道", "東北", "関東", "甲信越", "東海", "近畿", "中国・四国", "九州・沖縄"];

export default function EnsemblesPage() {
  const { user, loading } = useAuth();
  const isLoggedIn = !loading && !!user;
  const [selectedRegion, setSelectedRegion] = useState("すべて");

  const filtered = ENSEMBLES.filter(
    (e) => selectedRegion === "すべて" || e.region === selectedRegion
  );

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Header />
      <main className="pt-16">
        {/* ページヘッダー */}
        <section className="bg-white py-12 md:py-16 border-b" style={{ borderColor: "rgba(0,95,2,0.15)" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            <div className="text-xs mb-4" style={{ color: "#000000" }}>
              <a href="/" className="hover:underline">トップ</a>
              <span className="mx-2">›</span>
              <span>アンサンブル一覧</span>
            </div>
            <span className="inline-block text-xs font-medium px-3 mb-3" style={{ height: "23px", lineHeight: "23px", borderRadius: "11.5px", backgroundColor: "#005F02", color: "#005F02" }}>
              イベント
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}>
              アンサンブル一覧
            </h1>
            <p className="text-sm" style={{ color: "#000000" }}>
              全国各地のローカルコミュニティ（LC）をご紹介します。
            </p>
          </div>
        </section>

        {/* 非ログイン時のCTA */}
        {!loading && !isLoggedIn && (
          <div className="border-b" style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(0,95,2,0.15)" }}>
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-sm" style={{ color: "#005F02" }}>
                会員登録すると、イベント参加・宿泊予約など全ての機能が使えます。
              </p>
              <div className="flex gap-2 shrink-0">
                <a href="/login" className="px-4 py-2 rounded-full text-xs font-medium border transition-colors hover:opacity-80" style={{ borderColor: "rgba(0,95,2,0.15)", color: "#000000" }}>
                  ログイン
                </a>
                <a href="/join" className="px-4 py-2 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "#005F02" }}>
                  会員登録する
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 地域フィルター */}
        <section className="py-6 bg-white border-b" style={{ borderColor: "rgba(0,95,2,0.15)" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            <div className="flex flex-wrap gap-2">
              {ALL_REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className="text-xs px-4 py-1.5 rounded-full border transition-colors"
                  style={{
                    backgroundColor: selectedRegion === r ? "#005F02" : "white",
                    color: selectedRegion === r ? "white" : "#005F02",
                    borderColor: selectedRegion === r ? "#005F02" : "#005F02",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* アンサンブル一覧グリッド */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-sm" style={{ color: "#000000" }}>該当するアンサンブルはありません</p>
              </div>
            ) : (
              <>
                <p className="text-xs mb-8" style={{ color: "#000000" }}>
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
                          boxShadow: `0 0 0 4px white, 0 0 0 6px ${e.regionColor}40`,
                          backgroundColor: "#FFFFFF",
                        }}
                      >
                        <img src={e.img} alt={e.name} className="w-full h-full object-cover" />
                      </div>
                      <span
                        className="inline-block text-[11px] font-medium px-3 mb-2"
                        style={{ height: "20px", lineHeight: "20px", borderRadius: "10px", backgroundColor: e.regionColor, color: "white" }}
                      >
                        {e.region}
                      </span>
                      <h2 className="text-sm font-bold mb-1 group-hover:text-[#005F02] transition-colors" style={{ color: "#005F02" }}>
                        {e.name}
                      </h2>
                      <p className="text-xs mb-2" style={{ color: "#000000" }}>{e.sub}</p>
                      <p className="text-xs leading-relaxed line-clamp-2 max-w-[160px]" style={{ color: "#000000" }}>
                        {e.desc}
                      </p>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* 下部CTA */}
        <section className="py-12 bg-white border-t" style={{ borderColor: "rgba(0,95,2,0.15)" }}>
          <div className="max-w-[1200px] mx-auto px-5 lg:px-10 text-center">
            <p className="text-base font-bold mb-2" style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}>
              あなたもアンサンブルに参加しませんか？
            </p>
            <p className="text-sm mb-6" style={{ color: "#000000" }}>
              月会費 ¥1,000 で、全国の拠点・イベントへアクセスできます。
            </p>
            <a
              href="/join"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#005F02" }}
            >
              倶楽部に参加する →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
