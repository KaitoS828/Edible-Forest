"use client";

import { useState } from "react";
import type { EnsembleDoc } from "@/lib/firestore";

type SerializedEnsemble = Omit<EnsembleDoc, "createdAt" | "updatedAt">;

interface Props {
  ensembles: SerializedEnsemble[];
}

export default function MemberEnsembleList({ ensembles }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
      {ensembles.map((e) => (
        <EnsembleCard key={e.id} ensemble={e} />
      ))}
    </div>
  );
}

function EnsembleCard({ ensemble: e }: { ensemble: SerializedEnsemble }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`「${e.name}」を削除しますか？この操作は取り消せません。`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/member/ensemble/${e.id}`, { method: "DELETE" });
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
          boxShadow: `0 0 0 3px white, 0 0 0 5px ${e.regionColor || "#005F02"}40`,
          backgroundColor: "#FFFFFF",
          flexShrink: 0,
        }}
      >
        {e.img ? (
          <img
            src={e.img}
            alt={e.name}
            className="circle-img w-full h-full object-cover transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: "#FFFFFF" }} />
        )}
        {/* ステータスバッジ */}
        <span
          className="absolute top-2 right-2 text-[9px] font-medium px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: e.status === "published" ? "#005F02" : "#999999",
            color: "white",
          }}
        >
          {e.status === "published" ? "公開" : "下書"}
        </span>
      </div>

      {/* 地域バッジ */}
      <span
        className="inline-block text-[11px] font-medium px-3 mb-1.5"
        style={{
          height: "20px",
          lineHeight: "20px",
          borderRadius: "10px",
          backgroundColor: e.regionColor || "#005F02",
          color: "white",
        }}
      >
        {e.region}
      </span>

      {/* 名前 */}
      <p className="text-xs font-bold mb-0.5 leading-tight" style={{ color: "#005F02" }}>
        {e.name}
      </p>
      <p className="text-[11px] mb-3" style={{ color: "#000000" }}>{e.sub}</p>

      {/* アクション */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        {e.status === "published" && (
          <a
            href={`/ensembles/${e.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] px-3 py-1 rounded-full border hover:opacity-70 transition-opacity"
            style={{ color: "#555555", borderColor: "rgba(0,95,2,0.15)" }}
          >
            表示
          </a>
        )}
        <a
          href={`/member/edit/${e.id}`}
          className="text-[11px] px-3 py-1 rounded-full text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#005F02" }}
        >
          編集
        </a>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-[11px] px-3 py-1 rounded-full border hover:opacity-70 transition-opacity disabled:opacity-40"
          style={{ color: "#CC4444", borderColor: "#FFDDDD" }}
        >
          {deleting ? "…" : "削除"}
        </button>
      </div>
    </div>
  );
}
