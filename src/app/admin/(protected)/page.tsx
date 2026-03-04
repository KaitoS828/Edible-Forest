import { getEnsembleList } from "@/lib/microcms";
import { ENSEMBLES } from "@/data/ensembles";

export default async function AdminDashboard() {
  const cmsItems = await getEnsembleList();
  const hasCMS = cmsItems.length > 0;

  const items = hasCMS
    ? cmsItems
    : ENSEMBLES.filter((e) => e.active).map((e) => ({
        id: e.id,
        name: e.name,
        region: e.region,
        regionColor: e.regionColor,
        sub: e.sub,
        img: e.img,
        updatedAt: null as string | null,
      }));

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "'Noto Serif JP', serif", color: "#005F02" }}
        >
          ダッシュボード
        </h1>
        <p className="text-sm" style={{ color: "#000000" }}>
          アンサンブルのコンテンツを管理します
        </p>
      </div>

      {!hasCMS && (
        <div
          className="rounded-2xl px-5 py-4 mb-8 text-sm"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(0,95,2,0.15)" }}
        >
          <p className="font-medium mb-1" style={{ color: "#000000" }}>microCMSが未設定です</p>
          <p style={{ color: "#000000" }}>
            <code className="text-xs bg-yellow-50 px-1 py-0.5 rounded">.env.local</code> に
            MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY を設定してください。現在は静的データを表示しています。
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
        {items.map((item) => (
          <div key={item.id} className="circle-card flex flex-col items-center text-center card-enter">
            {/* 丸画像 */}
            <div
              className="relative overflow-hidden rounded-full mb-3"
              style={{
                width: "140px",
                height: "140px",
                boxShadow: `0 0 0 3px white, 0 0 0 5px ${item.regionColor}40`,
                backgroundColor: "#FFFFFF",
              }}
            >
              {"img" in item && item.img ? (
                <img
                  src={item.img as string}
                  alt={item.name}
                  className="circle-img w-full h-full object-cover transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: "#FFFFFF" }} />
              )}
            </div>

            {/* 地域バッジ */}
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

            {/* 名前 */}
            <p className="text-xs font-bold mb-0.5 leading-tight" style={{ color: "#005F02" }}>
              {item.name}
            </p>
            <p className="text-[11px] mb-3" style={{ color: "#000000" }}>
              {"sub" in item ? (item.sub as string) : ""}
            </p>

            {"updatedAt" in item && item.updatedAt && (
              <p className="text-[10px] mb-2" style={{ color: "#000000" }}>
                更新: {new Date(item.updatedAt as string).toLocaleDateString("ja-JP")}
              </p>
            )}

            <a
              href={`/admin/edit/${item.id}`}
              className="text-[11px] px-5 py-1.5 rounded-full border-2 transition-all hover:bg-[#005F02] hover:text-white hover:border-[#005F02] font-medium"
              style={{ borderColor: "#005F02", color: "#000000" }}
            >
              編集する
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
