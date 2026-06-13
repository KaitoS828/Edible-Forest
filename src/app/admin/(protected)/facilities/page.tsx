import { getAllFacilities } from "@/lib/firestore";
import FacilityRow from "./FacilityRow";

export const dynamic = "force-dynamic";

export default async function FacilitiesPage() {
  const facilities = await getAllFacilities();

  const serialized = facilities.map((f) => ({
    id: f.id,
    name: f.name,
    operatingBody: f.operatingBody ?? "",
    ownerName: f.ownerName,
    region: f.region ?? "",
    status: f.status,
    createdAt: f.createdAt?.toMillis?.() ?? 0,
  }));

  const stats = {
    total:    serialized.length,
    pending:  serialized.filter((f) => f.status === "pending").length,
    approved: serialized.filter((f) => f.status === "approved").length,
    rejected: serialized.filter((f) => f.status === "rejected").length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}>
          施設審査
        </h1>
        <p className="text-sm" style={{ color: "#1A2B1E", opacity: 0.6 }}>
          開催会員が登録した宿泊施設の承認・却下
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "登録施設数", value: stats.total,    color: "#1A2B1E" },
          { label: "審査中",     value: stats.pending,  color: "#D97706" },
          { label: "承認済み",   value: stats.approved, color: "#3C6B4F" },
          { label: "却下",       value: stats.rejected, color: "#9CA3AF" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4" style={{ border: "1px solid rgba(60,107,79,0.15)" }}>
            <p className="text-2xl font-bold mb-1" style={{ fontFamily: "'Noto Serif JP', serif", color }}>{value}</p>
            <p className="text-xs" style={{ color: "#1A2B1E", opacity: 0.55 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* 施設テーブル */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(60,107,79,0.15)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#F7FAF7", borderBottom: "1px solid rgba(60,107,79,0.15)" }}>
              {["施設名", "運営母体", "オーナー", "状態", "審査"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: "#1A2B1E", opacity: 0.55 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {serialized.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm" style={{ color: "#1A2B1E", opacity: 0.4 }}>
                  登録された施設はありません
                </td>
              </tr>
            )}
            {serialized.map((f, i) => (
              <FacilityRow key={f.id} facility={f} isLast={i === serialized.length - 1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
