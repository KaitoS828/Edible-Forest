export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#005F02", borderTopColor: "transparent" }}
        />
        <p className="text-xs tracking-widest" style={{ color: "#000000" }}>LOADING</p>
      </div>
    </div>
  );
}
