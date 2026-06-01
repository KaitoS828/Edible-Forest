import Image from "next/image";

/** @deprecated レポート等の旧UI用。新規は Logo を使用 */
export function TreeIcon({ size = 32 }: { size?: number }) {
  return (
    <Image src="/logo.png" alt="" width={size} height={size} className="object-contain" />
  );
}

const SIZES = {
  sm: { text: "text-base", sub: "text-sm" },
  md: { text: "text-lg", sub: "text-sm" },
  lg: { text: "text-xl", sub: "text-base" },
} as const;

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = SIZES[size];

  return (
    <div className="leading-tight shrink-0" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1A2B1E" }}>
      <div className={`${s.text} font-bold tracking-wide whitespace-nowrap`}>
        アンサンブル倶楽部
      </div>
      <div
        className={`${s.sub} font-medium tracking-[0.12em] whitespace-nowrap`}
        style={{ color: "rgba(26,43,30,0.55)" }}
      >
        ～食べられる森を目指して～
      </div>
    </div>
  );
}
