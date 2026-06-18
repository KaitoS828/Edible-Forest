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
      <div className="mb-6 border-b pb-5" style={{ borderColor: "#DCE3EA" }}>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
          Facilities
        </p>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
          施設審査
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#64748B" }}>
          開催会員が登録した宿泊施設の承認・却下
        </p>
      </div>

      {/* 統計カード */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "登録施設数", value: stats.total,    color: "#0F172A" },
          { label: "審査中",     value: stats.pending,  color: "#D97706" },
          { label: "承認済み",   value: stats.approved, color: "#166534" },
          { label: "却下",       value: stats.rejected, color: "#9CA3AF" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-md border bg-white p-4" style={{ borderColor: "#DCE3EA" }}>
            <p className="text-xs font-medium" style={{ color: "#64748B" }}>{label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* 施設テーブル */}
      <div className="overflow-hidden rounded-md border bg-white" style={{ borderColor: "#DCE3EA" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: "820px" }}>
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E5EAF0" }}>
                {["施設名", "運営母体", "オーナー", "状態", "審査"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#64748B" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {serialized.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm" style={{ color: "#64748B" }}>
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
    </div>
  );
}
