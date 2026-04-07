export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#3C6B4F", borderTopColor: "transparent" }}
        />
        <p className="text-xs tracking-widest" style={{ color: "#1A2B1E" }}>LOADING</p>
      </div>
    </div>
  );
}
