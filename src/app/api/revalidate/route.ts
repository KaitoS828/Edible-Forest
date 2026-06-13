import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// microCMS Webhook 用の On-Demand ISR エンドポイント。
// microCMS 管理画面の Webhook 設定で、コンテンツ更新時に
// POST {origin}/api/revalidate を叩くよう設定する。
//
// TODO: 本番運用時は ?secret=... もしくは X-MICROCMS-Signature を検証して、
//       不正な再生成リクエストを弾くこと（現状は secret 検証を省略）。

// microCMS の api（エンドポイント名）→ 再生成すべきパス
const PATHS_BY_API: Record<string, string[]> = {
  pages: ["/", "/concept"],
  ensembles: ["/", "/ensembles", "/spots"],
  reports: ["/", "/reports"],
};

export async function POST(req: NextRequest) {
  let api: string | undefined;
  let contentId: string | undefined;

  try {
    const body = await req.json();
    api = body?.api;
    contentId = body?.id ?? body?.contents?.new?.id ?? body?.contents?.old?.id;
  } catch {
    // ボディ無し／不正 JSON でも全体再生成にフォールバック
  }

  const paths = new Set<string>(["/"]);

  if (api && PATHS_BY_API[api]) {
    PATHS_BY_API[api].forEach((p) => paths.add(p));
  } else {
    // api 不明時は主要ページをまとめて再生成
    ["/", "/concept", "/ensembles", "/spots", "/reports"].forEach((p) => paths.add(p));
  }

  // 個別の詳細ページ
  if (contentId) {
    if (api === "ensembles") {
      paths.add(`/ensembles/${contentId}`);
      paths.add(`/spots/${contentId}`);
    } else if (api === "reports") {
      paths.add(`/reports/${contentId}`);
    }
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, paths: Array.from(paths), now: Date.now() });
}
