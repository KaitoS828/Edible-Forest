"use client";

import { useState } from "react";
import type { SpotDoc } from "@/lib/firestore";

type SerializedSpot = Omit<SpotDoc, "createdAt" | "updatedAt">;

export default function MemberSpotList({ spots }: { spots: SerializedSpot[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
      {spots.map((s) => <SpotCard key={s.id} spot={s} />)}
    </div>
  );
}

function SpotCard({ spot: s }: { spot: SerializedSpot }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`「${s.name}」を削除しますか？`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/member/spot/${s.id}`, { method: "DELETE" });
      if (res.ok) window.location.reload();
      else alert("削除に失敗しました");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="circle-card flex flex-col items-center text-center card-enter">
      {/* 丸画像 */}
      <div
        className="relative overflow-hidden rounded-full mb-3"
        style={{
          width: "140px",
          height: "140px",
          boxShadow: `0 0 0 3px white, 0 0 0 5px ${s.regionColor || "#005F02"}40`,
          backgroundColor: "#FFFFFF",
          flexShrink: 0,
        }}
      >
        {s.img ? (
          <img
            src={s.img}
            alt={s.name}
            className="circle-img w-full h-full object-cover transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: "#FFFFFF" }} />
        )}
        {/* ステータスバッジ */}
        <span
          className="absolute top-2 right-2 text-[9px] font-medium px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: s.status === "published" ? "#005F02" : "#999999",
            color: "white",
          }}
        >
          {s.status === "published" ? "公開" : "下書"}
        </span>
      </div>

      {/* 地域バッジ */}
      <span
        className="inline-block text-[11px] font-medium px-3 mb-1.5"
        style={{
          height: "20px",
          lineHeight: "20px",
          borderRadius: "10px",
          backgroundColor: s.regionColor || "#005F02",
          color: "white",
        }}
      >
        {s.region}
      </span>

      {/* 名前 */}
      <p className="text-xs font-bold mb-0.5 leading-tight" style={{ color: "#005F02" }}>
        {s.name}
      </p>
      <p className="text-[11px] mb-3" style={{ color: "#000000" }}>{s.sub}</p>

      {/* アクション */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        {s.status === "published" && (
          <a
            href={`/spots/${s.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] px-3 py-1 rounded-full border hover:opacity-70 transition-opacity"
            style={{ color: "#555555", borderColor: "rgba(0,95,2,0.15)" }}
          >
            表示
          </a>
        )}
        <a
          href={`/member/edit-spot/${s.id}`}
          className="text-[11px] px-3 py-1 rounded-full text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#005F02" }}
        >
          編集
        </a>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-[11px] px-3 py-1 rounded-full border hover:opacity-70 disabled:opacity-40 transition-opacity"
          style={{ color: "#CC4444", borderColor: "#FFDDDD" }}
        >
          {deleting ? "…" : "削除"}
        </button>
      </div>
    </div>
  );
}
