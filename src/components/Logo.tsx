// 元デザインの星アイコンと同じ線画スタイルで森/木を表現
export function TreeIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* trunk */}
      <line x1="20" y1="32" x2="20" y2="38" stroke="#3C6B4F" strokeWidth="1.5" strokeLinecap="round" />
      {/* branches */}
      <path d="M20 8 L26 18 L22 18 L27 26 L22.5 26 L20 32 L17.5 26 L13 26 L18 18 L14 18 Z"
        stroke="#3C6B4F" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      {/* fruit dots */}
      <circle cx="16" cy="22" r="1.8" fill="#3C6B4F" />
      <circle cx="24" cy="21" r="1.8" fill="#3C6B4F" />
      <circle cx="20" cy="14" r="1.8" fill="#3C6B4F" />
    </svg>
  );
}

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const textSize = size === "lg" ? "text-sm" : size === "sm" ? "text-[10px]" : "text-xs";
  const iconSize = size === "lg" ? 36 : size === "sm" ? 24 : 30;
  return (
    <div className="flex items-center gap-2">
      <TreeIcon size={iconSize} />
      <div className={`${textSize} font-medium leading-tight`} style={{ color: "#1A2B1E" }}>
        <div>食べられる森</div>
        <div>アンサンブル倶楽部</div>
      </div>
    </div>
  );
}
