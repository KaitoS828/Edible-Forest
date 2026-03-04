export function StarIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M20 4 L22.5 16 L34 10 L26 20 L34 30 L22.5 24 L20 36 L17.5 24 L6 30 L14 20 L6 10 L17.5 16 Z"
        stroke="#6BA26D"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="20" cy="20" r="3" fill="#6BA26D" />
    </svg>
  );
}

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const textSize = size === "lg" ? "text-base" : size === "sm" ? "text-xs" : "text-sm";
  const starSize = size === "lg" ? 36 : size === "sm" ? 22 : 28;
  return (
    <div className="flex items-center gap-2">
      <StarIcon size={starSize} />
      <div className={`${textSize} font-medium leading-tight`} style={{ color: "#595757" }}>
        <div>五木村</div>
        <div>過疎未来</div>
        <div>研究会</div>
      </div>
    </div>
  );
}
