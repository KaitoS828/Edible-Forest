# 実装計画 — 食べられる森アンサンブル倶楽部（会員サイト化）

> 並列開発の共通契約。各ストリームはこの仕様に従って実装する。
> 最終更新: 2026-06-11

## ゴール（クライアント要望 8 項目）

1. 公開ページが一通り完成（素材は仮置きOK）
2. マイページが一通り完成
3. データベースが一通り完成・連携
4. DB連動で、マイページ表示・イベント参加ボタンが**会員種別ごとに変わる**
5. それらに**CMS**が実装されている（microCMSで“ほぼ全文言”を管理）
6. 会員登録画面 → DB連携
7. サイトログインに**Google連携**
8. DBに**メルマガ（Benchmark Email）**が連携

## 確定方針（2026-06-11 ユーザー判断）

- CMS統合: **Edible-Forest 側で新規実装**（`edible-forest-microcms` は参考）
- 進め方: **仮スキーマで全要望を並列実装**（6/12 のスプレッドシート確定後に差分調整）
- メルマガ: **Benchmark API 連携**
- イベントUX: 未ログインは「**無料会員登録して参加**」ボタン化（藤下さん要望 第1案）

## 技術スタック（既存踏襲）

- Next.js 16 (App Router) + Tailwind v4 / TypeScript
- 会員認証: Firebase Auth（メール/パス + これに **Google Provider** を追加）+ sessionCookie
- 管理者: NextAuth + Firebase Custom Claims
- DB: Firestore（Admin SDK）/ 決済: Stripe
- CMS: **microCMS**（`MICROCMS_SERVICE_DOMAIN=excergy`）
- ポート: 3000

## microCMS 実スキーマ（本番 `excergy`）

- `pages`: `pageId`(top/concept...), `heroTitle`, `heroCaption`, `body`, `conceptTag`, `conceptLinkLabel`, `slides[]` → **公開ページ文言**
- `ensembles`: `type`(ensemble|spot), `title`, `sub`, `forestType`, `tags`, `heroImage`, `philosophy`, `caution`, `gallery[]`, `stats[]`, `activity[]`, `bookingUrl`
- `reports`: `title`, `category`, `date`, `image`, `body`
- アクセス: `src/lib/microcms.ts`（`getPage` / `getEnsembles` / `getSpots` / `getEnsemble` / `getReports` / `getReport`）。未設定時は空値フォールバック。

## 会員種別 × アクセス制御（中心抽象）

`src/lib/access.ts` に集約。**6/12 確定後はこのファイルの `CAPABILITIES` 差し替えで全体反映**。

- 種別: `free / member / supporter / organizer / staff`
- `can(memberType, capability)` で判定
- `resolveEventGate({ memberOnly, isLoggedIn, memberType })` → イベント参加ボタン状態（open / joinable / needs_login / needs_upgrade）

## Firestore スキーマ（仮・拡張）

`users/{uid}` … 既存 + 登録項目（6/12 で確定。現状は email/displayName/memberType/profileCompleted 等）
`ensembles/{id}` … 既存（会員投稿用）。**公開表示は microCMS を正とする方針**（要確認: CMS と Firestore の役割分担）
`events/{id}`（新規・仮） … イベント参加管理: `title`, `memberOnly`, `requiredType`, `date`, `capacity`, `participants[]`
`mailSubscribers/{email}`（新規・仮） … メルマガ連携状態: `email`, `benchmarkContactId`, `status`, `syncedAt`

## 並列ストリーム

- **S0 基盤（完了）**: `lib/access.ts` / `lib/microcms.ts` / env / PLAN.md
- **S1 公開ページCMS化**: トップ/concept/ensembles/spots/reports を microCMS 駆動に（参考: edible-forest-microcms の HomeClient/ReportsClient）。仮素材フォールバック維持。
- **S2 会員ログイン拡張**: Firebase に **Google Provider** 追加（`/login` `/signup` `AuthContext`）
- **S3 マイページ**: `/member/dashboard` を種別連動表示に。`can()` で出し分け。
- **S4 イベント参加UX**: 会員限定イベントの参加ボタンを `resolveEventGate` で出し分け（未ログイン→登録導線）。
- **S5 会員登録 → DB**: `/signup` 登録項目 → Firestore `users`。仮項目で実装、6/12 で確定。
- **S6 Benchmark メルマガ**: API ラッパ `lib/benchmark.ts` + 登録フォーム→リスト追加 + 会員登録時の任意購読。
- **S7 管理CMS導線**: 管理画面から microCMS への導線整理（任意・後回し可）。

## 未確定（ユーザー確認待ち）

- 6/12: 会員登録項目 / マイページ表示項目 / 種別別アクセス範囲（スプレッドシート）
- Benchmark: API キー取得（管理画面 → 連携設定）
- 公開コンテンツの正データソース: microCMS と Firestore `ensembles` の役割分担
