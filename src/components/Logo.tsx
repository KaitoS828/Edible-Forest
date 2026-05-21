import Image from "next/image";

/** @deprecated レポート等の旧UI用。新規は Logo を使用 */
export function TreeIcon({ size = 32 }: { size?: number }) {
  return (
    <Image src="/logo.png" alt="" width={size} height={size} className="object-contain" />
  );
}

const SIZES = {
  sm: { img: 48, text: "text-base", sub: "text-sm", gap: "gap-3" },
  md: { img: 56, text: "text-lg", sub: "text-sm", gap: "gap-3.5" },
  lg: { img: 72, text: "text-xl", sub: "text-base", gap: "gap-4" },
} as const;

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = SIZES[size];

  return (
    <div className={`flex items-center ${s.gap} shrink-0`}>
      <Image
        src="/logo.png"
        alt=""
        width={s.img}
        height={s.img}
        className="object-contain shrink-0"
        priority={size === "sm"}
      />
      <div
        className="leading-tight"
        style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1A2B1E" }}
      >
        <div className={`${s.text} font-bold tracking-wide whitespace-nowrap`}>
          食べられる森
        </div>
        <div
          className={`${s.sub} font-medium tracking-[0.12em] whitespace-nowrap`}
          style={{ color: "rgba(26,43,30,0.55)" }}
        >
          アンサンブル倶楽部
        </div>
      </div>
    </div>
  );
}
