import { getAllEnsembles } from "@/lib/firestore";

export default async function AdminDashboard() {
  const ensembles = await getAllEnsembles();

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "'Noto Serif JP', serif", color: "#3C6B4F" }}
        >
          ダッシュボード
        </h1>
        <p className="text-sm" style={{ color: "#1A2B1E" }}>
          アンサンブルのコンテンツを管理します
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
        {ensembles.map((item) => (
          <div key={item.id} className="circle-card flex flex-col items-center text-center card-enter">
            <div
              className="relative overflow-hidden rounded-full mb-3"
              style={{
                width: "140px",
                height: "140px",
                boxShadow: `0 0 0 3px white, 0 0 0 5px ${item.regionColor}40`,
                backgroundColor: "#FFFFFF",
              }}
            >
              {item.img ? (
                <img
                  src={item.img}
                  alt={item.name}
                  className="circle-img w-full h-full object-cover transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: "#FFFFFF" }} />
              )}
            </div>

            <span
              className="inline-block text-[11px] font-medium px-3 mb-1.5"
              style={{
                height: "20px",
                lineHeight: "20px",
                borderRadius: "10px",
                backgroundColor: item.regionColor,
                color: "white",
              }}
            >
              {item.region}
            </span>

            <p className="text-xs font-bold mb-0.5 leading-tight" style={{ color: "#3C6B4F" }}>
              {item.name}
            </p>
            <p className="text-[11px] mb-3" style={{ color: "#1A2B1E" }}>
              {item.sub}
            </p>

            {item.updatedAt && (
              <p className="text-[10px] mb-2" style={{ color: "#1A2B1E" }}>
                更新: {item.updatedAt.toDate().toLocaleDateString("ja-JP")}
              </p>
            )}

            <a
              href={`/admin/edit/${item.id}`}
              className="text-[11px] px-5 py-1.5 rounded-full border-2 transition-all hover:bg-[#3C6B4F] hover:text-white hover:border-[#3C6B4F] font-medium"
              style={{ borderColor: "#3C6B4F", color: "#1A2B1E" }}
            >
              編集する
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
