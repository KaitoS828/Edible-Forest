# 食べられる森アンサンブル倶楽部

> 自然界の仕組みで、新しい生き方を。全国各地のローカルコミュニティ（LC）と宿泊拠点（LS）を結ぶ会員制サイト。

---

## 目次

1. [概要](#概要)
2. [技術スタック](#技術スタック)
3. [アーキテクチャ図](#アーキテクチャ図)
4. [サイト構成図（URL マップ）](#サイト構成図url-マップ)
5. [ディレクトリ構成](#ディレクトリ構成)
6. [主要機能](#主要機能)
7. [認証フロー](#認証フロー)
8. [Stripe 決済フロー](#stripe-決済フロー)
9. [Firestore コレクション設計](#firestore-コレクション設計)
10. [API ルート一覧](#api-ルート一覧)
11. [Vercel Blob 画像アップロード運用](#vercel-blob-画像アップロード運用)
12. [環境変数](#環境変数)
13. [ローカル開発](#ローカル開発)

---

## 概要

「食べられる森アンサンブル倶楽部」は、全国各地で食・農・自然と共に生きる活動（アンサンブル）を行うメンバーのためのプラットフォームです。

- **一般ユーザー**：公開されたアンサンブル（LC）・宿泊拠点（LS）を閲覧できます。
- **会員（月額 ¥1,000）**：全アンサンブル・拠点の閲覧、活動レポート全文読み、コメント・いいね機能が使えます。
- **アンサンブルオーガナイザー**：会員ダッシュボードからアンサンブルや宿泊拠点のコンテンツを作成・編集できます。
- **管理者（Admin）**：全コンテンツの管理、ユーザー管理が可能です。

---

## 技術スタック

| カテゴリ | 採用技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5 |
| スタイリング | Tailwind CSS v4 |
| アニメーション | Framer Motion |
| 認証（メンバー） | Firebase Auth（メール/パスワード）+ Session Cookie (`fb_session`) |
| 認証（管理者） | NextAuth.js v5（Credentials Provider + Firebase Custom Claim `admin: true`） |
| データベース | Firestore (Firebase Admin SDK) |
| ファイルストレージ | Vercel Blob（管理画面CMS画像） / Firebase Storage（既存Firebase連携・互換用途） |
| 決済 | Stripe（月額 ¥1,000 サブスクリプション） |
| CMS | 管理画面 + Firestore + TipTap リッチテキストエディター |
| 地図 | D3-Geo + TopoJSON（日本地図） |
| ホスティング | Vercel |

---

## アーキテクチャ図

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ブラウザ（クライアント）                       │
│                                                                     │
│  ┌──────────────┐   ┌───────────────┐   ┌──────────────────────┐   │
│  │  一般ページ   │   │  会員ページ    │   │   管理者ページ        │   │
│  │  / /ensembles│   │  /member/*    │   │   /admin/*           │   │
│  │  /spots /join│   │  /reports     │   │   (NextAuth保護)      │   │
│  └──────┬───────┘   └──────┬────────┘   └──────────┬───────────┘   │
│         │                  │                        │               │
│         │  Firebase Auth   │  Session Cookie        │  NextAuth     │
│         │  (Client SDK)    │  (fb_session)          │  Session      │
└─────────┼──────────────────┼────────────────────────┼───────────────┘
          │                  │                        │
          ▼                  ▼                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Next.js API Routes (Server)                    │
│                                                                     │
│  /api/session        ← ログイン・ログアウト、セッション Cookie 発行    │
│  /api/contact        ← お問い合わせ受付（Firestore inquiries 保存）   │
│  /api/checkout       ← Stripe Checkout Session 作成                 │
│  /api/webhook        ← Stripe Webhook 受信                          │
│  /api/member/*       ← 会員向け CRUD（アンサンブル・拠点・プロフィール）│
│  /api/admin/*        ← 管理者向け（メンバー管理・コンテンツ更新）      │
│  /api/public/spots   ← 公開 API（未認証でも取得可）                  │
└────────────┬──────────────────────────────┬────────────────────────┘
             │                              │
             ▼                              ▼
┌────────────────────────┐    ┌─────────────────────────────────────┐
│   Firebase Admin SDK   │    │              Stripe API              │
│                        │    │                                      │
│  ┌──────────────────┐  │    │  Checkout Sessions (subscription)    │
│  │   Firestore      │  │    │  Webhooks:                           │
│  │  ・users         │  │    │   checkout.session.completed         │
│  │  ・ensembles     │  │    │   customer.subscription.updated      │
│  │  ・spots         │  │    │   customer.subscription.deleted      │
│  │  ・inquiries     │  │    │   invoice.payment_failed             │
│  │  ・reportLikes   │  │    └─────────────────────────────────────┘
│  │  ・reportComments│  │
│  │  ・pendingSubs   │  │
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │  Firebase Auth   │  │
│  │  (Admin 検証)    │  │
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │ Firebase Storage │  │
│  │  (既存互換用途)  │  │
│  └──────────────────┘  │
└────────────────────────┘
```

管理画面から挿入するCMS画像は、`/api/admin/upload` を通して Vercel Blob に保存します。Firestoreには画像ファイル本体ではなく、Blobの公開URLを保存します。

---

## サイト構成図（URL マップ）

```
/                               トップページ
│  ├─ Hero（カルーセル）※ログイン状態で CTA が変化
│  ├─ About セクション
│  ├─ 地域から探す（日本地図 + LC/LS 統計）
│  ├─ アンサンブル一覧（LC）
│  ├─ 宿泊拠点一覧（LS）
│  ├─ 活動レポート（タブ）
│  └─ お問い合わせ
│
├─ /concept                     食べられる森について
│
├─ /ensembles                   アンサンブル一覧ページ
│   └─ /ensembles/[id]          アンサンブル詳細
│        ├─ Hero 画像グリッド（メイン 3/4 + サブ 2枚 1/4）
│        ├─ タグ（地域・森の種類）+ タイトル
│        ├─ 2カラムレイアウト
│        │   ├─ 左：理念・注意事項・旅行条件・アクティビティ・
│        │   │       オーガナイザー・ギャラリー
│        │   └─ 右：スティッキー開催概要カード + CTA
│        └─ 関連アンサンブル
│
├─ /spots                       宿泊拠点一覧ページ
│   └─ /spots/[id]              宿泊拠点詳細
│
├─ /reports                     活動レポート一覧
│   └─ /reports/[id]            レポート詳細
│        ├─ [ログイン済み] 全文 + いいね・コメント
│        └─ [未ログイン]  冒頭ティーザー + ログインゲート
│
├─ /join                        会員登録（Firebase Auth + プロフィール設定）
│   └─ /join/success            登録完了ページ
│
├─ /login                       ログイン（メール/パスワード + パスワードリセット）
├─ /signup                      → /join へリダイレクト
├─ /contact                     お問い合わせ（Firestore inquiries へ保存）
│
├─ /member/*                    ── 会員専用（要ログイン） ──
│   ├─ /member                  会員トップ（拠点一覧）
│   ├─ /member/dashboard        ダッシュボード（プロフィール・コンテンツ一覧）
│   ├─ /member/setup            初回プロフィール設定
│   ├─ /member/new              アンサンブル新規作成
│   ├─ /member/edit/[id]        アンサンブル編集
│   ├─ /member/new-spot         宿泊拠点新規作成
│   └─ /member/edit-spot/[id]   宿泊拠点編集
│
└─ /admin/*                     ── 管理者専用（NextAuth 保護） ──
    ├─ /admin/login             管理者ログイン（メール/パスワード + admin カスタムクレーム）
    ├─ /admin                   管理ダッシュボード（コンテンツ一覧）
    ├─ /admin/edit/[id]         アンサンブル詳細編集（TipTap エディター）
    └─ /admin/members/[uid]     メンバー詳細管理
```

---

## ディレクトリ構成

```
exergy-forest/
├─ public/                               静的ファイル（OGP画像・favicon など）
├─ carousel/                             Hero スライド画像
├─ scripts/                              シードスクリプトなど
│
├─ src/
│   ├─ app/                              Next.js App Router
│   │   ├─ layout.tsx                    ルートレイアウト（AuthProvider）
│   │   ├─ page.tsx                      トップページ（全セクション）
│   │   ├─ loading.tsx                   グローバルローディング
│   │   ├─ globals.css                   グローバルスタイル
│   │   │
│   │   ├─ concept/page.tsx              食べられる森について
│   │   │
│   │   ├─ ensembles/
│   │   │   ├─ page.tsx                  一覧ページ
│   │   │   └─ [id]/
│   │   │       ├─ page.tsx              詳細ページ（Server Component）
│   │   │       └─ JoinButton.tsx        参加ボタン（Client Component）
│   │   │
│   │   ├─ spots/
│   │   │   ├─ page.tsx                  一覧ページ
│   │   │   └─ [id]/page.tsx             詳細ページ
│   │   │
│   │   ├─ reports/
│   │   │   ├─ page.tsx                  一覧ページ
│   │   │   └─ [id]/page.tsx             詳細ページ（認証ゲート）
│   │   │
│   │   ├─ join/
│   │   │   ├─ page.tsx                  会員登録（Firebase Auth 作成 → セッション → setup）
│   │   │   └─ success/page.tsx          登録完了
│   │   │
│   │   ├─ login/page.tsx                ログイン + パスワードリセット
│   │   ├─ signup/page.tsx               /join へリダイレクト
│   │   ├─ contact/page.tsx              お問い合わせ（/api/contact 経由で Firestore 保存）
│   │   │
│   │   ├─ member/
│   │   │   ├─ layout.tsx                会員セクション共通レイアウト
│   │   │   ├─ page.tsx                  会員トップ（拠点一覧）
│   │   │   ├─ setup/page.tsx            初回プロフィール設定
│   │   │   ├─ dashboard/
│   │   │   │   ├─ layout.tsx            ダッシュボードレイアウト
│   │   │   │   └─ page.tsx              ダッシュボード本体
│   │   │   ├─ EnsembleForm.tsx          アンサンブル作成・編集フォーム
│   │   │   ├─ SpotForm.tsx              拠点作成・編集フォーム
│   │   │   ├─ MemberEnsembleList.tsx    自分のアンサンブル一覧
│   │   │   ├─ MemberSpotList.tsx        自分の拠点一覧
│   │   │   ├─ MemberNav.tsx             会員ナビゲーション
│   │   │   └─ (managed)/               Route Group（URL に影響しない）
│   │   │       ├─ layout.tsx            認証チェックレイアウト
│   │   │       ├─ new/page.tsx          アンサンブル新規作成
│   │   │       ├─ edit/[id]/page.tsx    アンサンブル編集
│   │   │       ├─ new-spot/page.tsx     拠点新規作成
│   │   │       └─ edit-spot/[id]/page.tsx 拠点編集
│   │   │
│   │   ├─ admin/
│   │   │   ├─ login/
│   │   │   │   ├─ page.tsx              管理者ログイン画面
│   │   │   │   └─ CredentialsForm.tsx   認証フォーム
│   │   │   └─ (protected)/             Route Group（管理者保護）
│   │   │       ├─ layout.tsx            Admin 認証チェック
│   │   │       ├─ page.tsx              管理ダッシュボード
│   │   │       ├─ edit/[id]/
│   │   │       │   ├─ page.tsx          アンサンブル編集ページ
│   │   │       │   └─ EnsembleEditForm.tsx TipTap エディターフォーム
│   │   │       └─ members/[uid]/page.tsx   メンバー詳細管理
│   │   │
│   │   └─ api/
│   │       ├─ auth/[...nextauth]/route.ts  NextAuth ハンドラー
│   │       ├─ session/route.ts             POST: ログイン / DELETE: ログアウト
│   │       ├─ contact/route.ts             POST: お問い合わせ受付
│   │       ├─ checkout/route.ts            POST: Stripe Checkout Session 作成
│   │       ├─ webhook/route.ts             POST: Stripe Webhook 受信
│   │       ├─ public/spots/route.ts        GET: 公開拠点一覧
│   │       ├─ ensemble/[id]/route.ts       PATCH: 管理者用 ensemble 更新
│   │       ├─ admin/members/[uid]/route.ts PATCH: メンバー情報更新（管理者）
│   │       └─ member/
│   │           ├─ profile/route.ts         PATCH: プロフィール更新
│   │           ├─ ensemble/route.ts        POST: アンサンブル作成
│   │           ├─ ensemble/[id]/route.ts   PATCH/DELETE: アンサンブル更新・削除
│   │           ├─ spot/route.ts            POST: 拠点作成
│   │           └─ spot/[id]/route.ts       PATCH/DELETE: 拠点更新・削除
│   │
│   ├─ components/
│   │   ├─ Header.tsx                    グローバルヘッダー（半透明・blur）
│   │   ├─ Footer.tsx                    グローバルフッター
│   │   ├─ Logo.tsx                      ロゴコンポーネント
│   │   ├─ ReportInteractions.tsx        いいね・コメント（Firestore リアルタイム）
│   │   ├─ JapanMap/
│   │   │   ├─ JapanMap.tsx              インタラクティブ日本地図
│   │   │   └─ mapData.ts               地域 ID・ラベルマッピング
│   │   ├─ editor/
│   │   │   └─ RichTextEditor.tsx        TipTap エディター（管理者用）
│   │   └─ ensembles/
│   │       └─ EnsembleCard.tsx          アンサンブルカード
│   │
│   ├─ contexts/
│   │   └─ AuthContext.tsx               Firebase Auth 状態管理（useAuth フック）
│   │
│   ├─ data/
│   │   ├─ ensembles.ts                  静的アンサンブルデータ（notes・travelConditions を含む）
│   │   └─ reports.ts                   静的レポートデータ
│   │
│   ├─ lib/
│   │   ├─ firebase.ts                   Firebase クライアント SDK 初期化
│   │   ├─ firebase-admin.ts             Firebase Admin SDK（Lazy Proxy 初期化）
│   │   ├─ firestore.ts                  Firestore CRUD ユーティリティ + 型定義
│   │   ├─ cms.ts                        自作CMS公開表示レイヤー
│   │   └─ stripe.ts                     Stripe クライアント + Price ID 管理
│   │
│   ├─ actions/
│   │   └─ auth.ts                       Server Actions（認証関連）
│   │
│   ├─ auth.ts                           NextAuth 設定（管理者 Credentials 認証）
│   └─ constants/
│       └─ japan.json                    都道府県 TopoJSON データ
│
├─ middleware.ts                         /member/* /admin/* 認証ガード
├─ next.config.ts
├─ tsconfig.json
└─ package.json
```

---

## 主要機能

### 公開機能

| 機能 | 説明 |
|---|---|
| トップページ | Hero スライドショー（ログイン状態で CTA 変化）、About、地域地図検索、アンサンブル・拠点一覧、レポート |
| 日本地図検索 | インタラクティブ地図でクリックした地域の LC・LS を表示 |
| アンサンブル詳細 | 画像グリッド Hero・2カラムレイアウト・philosophy・注意事項・旅行条件・アクティビティ・オーガナイザー・ギャラリー・スティッキーサイドバー（開催概要 + 集合場所 Google Maps 自動埋め込み） |
| 宿泊拠点詳細 | 施設情報・ギャラリー |
| レポート一覧 | 活動レポートカード一覧 |
| お問い合わせ | フォーム送信 → Firestore `inquiries` コレクションへ保存 |

### 会員機能（要ログイン）

| 機能 | 説明 |
|---|---|
| 月額課金 | Stripe Checkout で ¥1,000/月 のサブスクリプション |
| レポート全文 | 活動レポートの全文閲覧（未会員はログインゲート） |
| いいね・コメント | Firestore リアルタイム同期（`onSnapshot`） |
| プロフィール設定 | 初回ログイン時に名前・bio・アバター画像を設定 |
| コンテンツ管理 | アンサンブル・宿泊拠点の作成・編集・削除（開催概要は開催期間・所要時間・料金・定員・持ち物・集合場所の固定フィールド） |

### 管理者機能（NextAuth 保護）

| 機能 | 説明 |
|---|---|
| コンテンツ一覧 | 全アンサンブル・拠点の管理 |
| TipTap エディター | リッチテキストでアンサンブル詳細を編集 |
| ステータス管理 | draft / published の切り替え |
| メンバー管理 | メンバー情報の確認・更新（`/admin/members/[uid]`） |

---

## 認証フロー

### メンバー認証（Firebase Auth + Session Cookie）

```
1. クライアント：Firebase Auth SDK でログイン
   signInWithEmailAndPassword(auth, email, password)

2. クライアント：ID トークン取得
   cred.user.getIdToken()

3. クライアント → /api/session [POST]
   body: { idToken }

4. サーバー：Firebase Admin で ID トークン検証
   adminAuth.verifyIdToken(idToken)

5. サーバー：Firestore にユーザー情報 upsert
   ・初回 → profileCompleted: false
   ・既存 → profileCompleted の値を確認

6. サーバー：セッション Cookie 発行（7日間）
   adminAuth.createSessionCookie(idToken, { expiresIn })
   res.cookies.set("fb_session", cookie, { httpOnly: true })

7. レスポンス：{ ok: true, profileCompleted: boolean }
   ・false → /member/setup へリダイレクト（初回プロフィール設定）
   ・true  → callbackUrl or /member/dashboard へ

8. 以降のリクエスト：
   middleware.ts が fb_session Cookie を確認
   /member/* は Cookie がなければ /login へリダイレクト
```

### 会員登録フロー（/join）

```
1. フォーム入力：姓名・メールアドレス・パスワード・確認用パスワード
               （電話番号・参加動機はオプション）

2. createUserWithEmailAndPassword(auth, email, password)

3. updateProfile(user, { displayName })

4. user.getIdToken() → POST /api/session

5. profileCompleted: false → /member/setup（プロフィール完成）
   profileCompleted: true  → /member/dashboard
```

### パスワードリセット

```
ログインページ「パスワードを忘れた方」→ リセット画面
  sendPasswordResetEmail(auth, email)
  → 登録済みメールにリセットリンクを送信
```

### 管理者認証（NextAuth v5 + Credentials）

```
/admin/* へのアクセス
  → middleware.ts が next-auth.session-token を確認
  → なければ /admin/login へリダイレクト

/admin/login でメール + パスワード入力
  → Firebase REST API でサインイン検証
  → adminAuth.verifyIdToken で decoded.admin === true を確認
  → true のみ NextAuth セッション発行（JWT に isAdmin フラグ付与）

API ルート（/api/admin/*）でも isAdmin を二重チェック
```

---

## Stripe 決済フロー

```
1. ユーザー：/member/dashboard などから課金フォームへ

2. クライアント → /api/checkout [POST]
   body: { email, name }

3. サーバー：Stripe Customer 作成
   stripe.customers.create({ email, name })

4. サーバー：Checkout Session 作成
   mode: "subscription", price: ¥1,000/月
   success_url: /join/success
   cancel_url: /join?canceled=1

5. クライアント：Stripe の決済ページにリダイレクト

6. Stripe：決済完了後 Webhook を送信
   POST /api/webhook

7. Webhook 処理：
   checkout.session.completed
     → upsertSubscription() で Firestore に保存
     → ユーザー未登録の場合は pendingSubscriptions に一時保存

8. ユーザー：Firebase で新規登録 or ログイン
   → mergePendingSubscription() で pending データをマージ

9. 継続課金・解約・失敗は各 Webhook イベントで対応:
   subscription.updated / deleted / invoice.payment_failed
   → subscriptionStatus を Firestore に反映
```

---

## Firestore コレクション設計

```
users/{uid}
  uid: string
  email: string
  displayName: string
  photoURL: string
  role: "member" | "admin"
  bio?: string
  avatarUrl?: string
  profileCompleted?: boolean
  stripeCustomerId?: string
  subscriptionId?: string
  subscriptionStatus?: "active" | "past_due" | "canceled" | "trialing" | "none"
  subscriptionPeriodEnd?: number   // Unix timestamp
  createdAt: Timestamp
  updatedAt: Timestamp

pendingSubscriptions/{email}       // Firebase 登録前の Stripe 決済者を一時保管
  email: string
  stripeCustomerId: string
  subscriptionId: string
  subscriptionStatus: string
  subscriptionPeriodEnd: number
  customerName: string
  createdAt: Timestamp

ensembles/{id}
  authorId: string
  authorName: string
  name: string
  sub: string
  region: string
  regionColor: string
  forestType?: string
  desc: string
  philosophy: string               // HTML（TipTap 出力）
  notes?: string[]                 // 注意事項（箇条書き）
  travelConditions?: string        // 旅行条件等（テキスト）
  img: string
  activities: { icon, title, desc }[]
  stats: { label, value }[]
  // stats の固定ラベル（フォームで入力 → サイドバーに表示）
  // 開催期間 / 所要時間 / 料金 / 定員 / 持ち物 / 集合場所
  // ※ 集合場所は住所を入れると Google Maps を自動埋め込み
  gallery: string[]
  organizer?: { name, role, bio, avatar? }
  active: boolean
  status: "draft" | "published"
  isOfficial: boolean
  createdAt: Timestamp
  updatedAt: Timestamp

spots/{id}
  authorId: string
  name: string
  sub: string
  region: string
  regionColor: string
  desc: string
  content: string                  // HTML
  img: string
  address: string
  capacity: string
  price: string
  access: string
  active: boolean
  status: "draft" | "published"
  isOfficial: boolean
  createdAt: Timestamp
  updatedAt: Timestamp

inquiries/{id}                     // お問い合わせ
  name: string
  email: string
  subject: string
  message: string
  createdAt: Timestamp

reportLikes/{reportId}/users/{uid}
  uid: string
  createdAt: Timestamp

reportComments/{commentId}
  reportId: string
  userId: string
  userName: string
  content: string
  createdAt: Timestamp
```

### Firestore セキュリティルール（推奨設定）

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    match /ensembles/{id} {
      allow read: if resource.data.status == "published";
      allow write: if request.auth != null;
    }

    match /spots/{id} {
      allow read: if resource.data.status == "published";
      allow write: if request.auth != null;
    }

    match /inquiries/{id} {
      allow create: if true;   // 未認証でも送信可
      allow read, update, delete: if false;
    }

    match /reportLikes/{reportId}/users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /reportComments/{commentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## API ルート一覧

| メソッド | パス | 認証 | 説明 |
|---|---|---|---|
| POST | `/api/session` | 不要 | ログイン・Session Cookie 発行 |
| DELETE | `/api/session` | 不要 | ログアウト・Cookie 削除 |
| POST | `/api/contact` | 不要 | お問い合わせ受付（Firestore 保存） |
| POST | `/api/checkout` | 不要 | Stripe Checkout Session 作成 |
| POST | `/api/webhook` | Stripe 署名 | Stripe Webhook 受信 |
| GET | `/api/public/spots` | 不要 | 公開拠点一覧取得 |
| PATCH | `/api/ensemble/[id]` | Admin Session | アンサンブル更新（管理者） |
| PATCH | `/api/admin/members/[uid]` | Admin Session + isAdmin | メンバー情報更新（管理者） |
| PATCH | `/api/member/profile` | fb_session | プロフィール更新 |
| POST | `/api/member/ensemble` | fb_session | アンサンブル作成 |
| PATCH | `/api/member/ensemble/[id]` | fb_session | アンサンブル更新 |
| DELETE | `/api/member/ensemble/[id]` | fb_session | アンサンブル削除 |
| POST | `/api/member/spot` | fb_session | 拠点作成 |
| PATCH | `/api/member/spot/[id]` | fb_session | 拠点更新 |
| DELETE | `/api/member/spot/[id]` | fb_session | 拠点削除 |

---

## Vercel Blob 画像アップロード運用

管理画面の画像アップロードは `src/app/api/admin/upload/route.ts` に集約しています。活動レポート、アンサンブル、宿泊施設、サイト設定、TipTapリッチテキスト内の画像は、同じ内部APIを使って Vercel Blob へ保存します。

### 保存フロー

```text
admin画面で画像選択
  → POST /api/admin/upload
  → NextAuthセッション + admin権限チェック
  → Vercel Blobへ保存
  → 返却された公開URLをFirestoreへ保存
  → 公開ページのUIに反映
```

### 仕様

- admin認証必須。未ログイン、またはadmin権限なしの場合は403。
- `image/*` のみアップロード可能。
- 1ファイル2MBまで。Vercel Blobの無料枠を使いすぎないように、CMS運用向けの現実的な上限にしています。
- 保存先はPublicの Vercel Blob Store。画像URLを知っている人は閲覧できます。
- FirestoreにはBlob URLだけを保存するため、Firestoreの容量を画像で圧迫しません。
- リッチテキストエディターのドラッグ&ドロップ、ペースト、画像ボタンも同じAPIを使います。

### Vercel側で必要な設定

Vercel DashboardでBlob Storeを作成し、このプロジェクトに接続してください。接続済みの場合、Vercel環境変数に以下が入ります。

```env
BLOB_STORE_ID=
BLOB_WEBHOOK_PUBLIC_KEY=
```

現在の `@vercel/blob` SDK は、Vercel本番環境では接続済みBlob StoreとOIDC認証で動作します。古いSDKやローカル検証でトークンが必要な場合だけ、以下を追加します。

```env
BLOB_READ_WRITE_TOKEN=
```

ローカルで本番と同じBlob Storeを使って検証する場合は、Vercel CLIで環境変数を取得します。

```bash
vercel link
vercel env pull .env.local
```

`BLOB_READ_WRITE_TOKEN` を手動で使う場合も、`.env.local` のみに置き、READMEやGitには実値を残さないでください。

---

## 環境変数

`.env.local` に以下を設定してください。

```env
# ── Firebase (クライアント) ──────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# ── Firebase Admin SDK (サーバー) ────────────────────
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# ── Stripe ───────────────────────────────────────────
STRIPE_SECRET_KEY=sk_live_...        # 本番: sk_live_ / 開発: sk_test_
STRIPE_WEBHOOK_SECRET=whsec_...      # Stripe Dashboard → Webhooks から取得

# ── NextAuth (管理者認証) ────────────────────────────
AUTH_SECRET=                         # openssl rand -base64 32

# ── サイト URL ───────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# ── Vercel Blob（管理画面CMS画像） ───────────────────
BLOB_STORE_ID=
BLOB_WEBHOOK_PUBLIC_KEY=
# ローカル検証や旧SDKで必要な場合のみ
BLOB_READ_WRITE_TOKEN=
```

---

## ローカル開発

```bash
# 依存関係インストール
npm install

# 開発サーバー起動（ポート 3000）
npm run dev

# 型チェック
npx tsc --noEmit

# ビルド確認
npm run build
```

### Stripe Webhook のローカルテスト

```bash
# Stripe CLI でローカルにトンネルを作成
stripe listen --forward-to localhost:3000/api/webhook

# テスト用イベントを発火
stripe trigger checkout.session.completed
```

### Firebase Storage CORS 設定（既存Firebase Storageを使う場合のみ）

管理画面CMS画像は Vercel Blob に保存します。以下は既存のFirebase Storage連携を使う場合の参考設定です。

```json
[
  {
    "origin": ["http://localhost:3000", "https://your-domain.vercel.app"],
    "method": ["GET", "PUT", "POST"],
    "maxAgeSeconds": 3600
  }
]
```

```bash
gsutil cors set cors.json gs://your-project.firebasestorage.app
```

---

## 2026-06-19 現在の実装状況

この章は、既存READMEの追補です。会員サイト化の実装が進んだため、現在のコードベースで動いている主要機能と、古い説明との差分をまとめています。

### 現在のプロジェクト概要

本プロジェクトは、食べられる森アンサンブル倶楽部の公開サイト兼会員サイトです。公開ページはFirestoreベースの自作CMSを中心に表示し、会員登録・ログイン・イベント参加・開催会員によるイベント作成・施設審査・管理者向け会員管理までをNext.js App Router上で扱います。

主な役割は次の通りです。

| 領域 | 現在の実装 |
|---|---|
| 公開サイト | トップ、コンセプト、アンサンブル、宿泊拠点、活動レポート、イベント一覧 |
| CMS | Firestoreの`siteSettings`、`ensembles`、`spots`、`reports`を参照。管理画面から編集 |
| 会員認証 | Firebase Authのメール/パスワード + Googleログイン、`fb_session` Cookie |
| 会員種別 | `participant`、`organizer`、`inner` の3種別。管理者はNextAuth側の別軸 |
| イベント | Firestore `events` に保存。開催会員以上が作成、会員は参加可能 |
| 施設 | 開催会員が登録し、管理者が `pending / approved / rejected` を審査 |
| 管理 | NextAuth保護の管理画面。会員一覧、会員CSV、施設審査 |
| メルマガ | Benchmark Email新API + Firestore `mailSubscribers` に記録 |
| 決済 | Stripe Checkout/Webhook の既存実装あり |

### 現在のサイト構成

```text
/                         トップ。CMSスライド + Firestore reports 更新履歴（日付の新しい順） + ForestTypes + アンサンブル参加導線
/concept                  コンセプト。siteSettings の concept を反映
/ensembles                アンサンブル一覧。Firestore ensembles を反映
/ensembles/[id]           アンサンブル詳細。Firestore詳細 + 参加導線
/spots                    宿泊拠点一覧。Firestore spots を反映
/spots/[id]               宿泊拠点詳細。予約URLまたは問い合わせ導線
/reports                  活動レポート一覧。Firestore reports
/reports/[id]             レポート詳細。未ログインはティーザー + ログインゲート
/events                   Firestore events の公開イベント一覧
/events/[id]              イベント詳細。参加済み判定、会員限定ゲート、参加API連携
/join                     会員登録。プロフィール項目、施設登録、メルマガ任意購読
/login                    メール/パスワード + Googleログイン
/signup                   登録ページ互換ルート
/member                   会員トップ
/member/dashboard         会員ダッシュボード。プロフィール、権限別導線、イベント履歴
/member/setup             初回/再編集プロフィール
/member/new-event         開催会員以上のイベント作成
/admin                    管理ダッシュボード
/admin/members            会員一覧、CSVエクスポート
/admin/ensembles          アンサンブル管理
/admin/spots              宿泊施設管理
/admin/site-settings      サイト共通文言・導線・トップ森タイプ・地図データのJSON編集
/admin/reports            活動レポート管理。記事 + トップ更新履歴を兼ねる
/admin/facilities         開催会員が登録した施設の審査
```

### 会員種別と権限

会員種別は `src/lib/access.ts` に集約されています。

| 種別 | 表示名 | 主な権限 |
|---|---|---|
| `participant` | 参加会員 | イベント参加 |
| `organizer` | 開催会員 | イベント参加、イベント作成、施設登録 |
| `inner` | 森の奥 | 開催会員権限 + 他メンバー閲覧 |

`inner` は自己登録では選べず、管理側で付与する想定です。管理者はNextAuth + Firebase Custom Claim `admin: true` の別系統で扱います。

### 会員登録・プロフィール

登録フォームは `MemberProfileFields` を使い、次の項目を扱います。

- 会員種別: 参加会員 / 開催会員
- 姓名、フリガナ、外国人向けフリガナ省略
- 居住国、住所
- 連絡用メール、ログインメールと同じチェック
- 電話番号、紹介者
- 興味分野の複数選択
- 職業、コメント
- 開催会員のみ: 運営母体名、宿泊施設名、施設住所、地域

プロフィール保存は `src/lib/profile.ts` の `applyProfile()` でサニタイズします。開催会員が施設を入力した場合は、`facilities` コレクションに `pending` 状態で作成し、管理画面で承認します。

### イベント機能

イベントは Firestore `events` コレクションに保存されます。

主な項目:

- `organizerId`, `organizerName`
- `organizerFacilityId`, `organizerBodyName`
- `title`, `summary`
- `startAt`, `endAt`
- `venueFacilityId`
- `format`: `onsite / online / both`
- `image`
- `terms`
- `memberOnly`
- `status`: `draft / published`
- `participants`

開催会員以上は `/member/new-event` からイベントを作成できます。会場は承認済みの自施設から選択します。イベント規約はブラウザのlocalStorageにテンプレートとして保存/読込できます。

参加は `/api/member/event/[id]/join` で行い、`participants` にUIDを追加します。会員限定イベントは未ログイン時に登録/ログイン導線へ誘導します。

### 施設審査

開催会員が登録した施設は Firestore `facilities` に保存されます。

```text
facilities/{id}
  ownerId
  ownerName
  name
  operatingBody
  region
  address
  status: pending | approved | rejected
  createdAt
  updatedAt
```

管理画面 `/admin/facilities` で施設を確認し、`/api/admin/facilities/[id]` からステータスを更新します。イベント会場として選べるのは、承認済みの自施設のみです。

### メルマガ連携

Benchmark Emailは旧APIではなく、新REST APIを使います。

```text
Base URL: BENCHMARK_API_BASE
Auth: X-API-Key: BENCHMARK_API_KEY
POST: /api/contact
```

アプリ側の入口は `/api/newsletter` です。Benchmark連携に成功した場合は `mailSubscribers/{email}` を `subscribed`、未設定や失敗時は `pending` として保存します。会員登録時のメルマガ購読チェックはデフォルトONですが、購読失敗で登録フローは止めません。

追加の環境変数:

```env
BENCHMARK_API_BASE=
BENCHMARK_API_KEY=
BENCHMARK_LIST_ID=
BENCHMARK_CONTACT_STRUCTURE_ID=
BENCHMARK_FIELD_FIRSTNAME_ID=
BENCHMARK_FIELD_LASTNAME_ID=
```

### 自作CMS

`src/lib/cms.ts` が公開ページ向けCMS表示レイヤーです。管理画面からFirestoreを更新し、公開ページはこのレイヤー経由で表示します。

| Firestore collection | 用途 |
|---|---|
| `siteSettings` | トップ（スライド/見出し）、コンセプト本文、規約・会社ページ、ヘッダー、フッター、トップ森タイプ、コンセプト補助カード、主要ページ見出し/CTA、地図データ |
| `ensembles` | アンサンブル |
| `spots` | 宿泊拠点 |
| `reports` | 活動レポート（トップ更新履歴も兼ねる） |

CMS更新の基本フロー:

```text
管理画面 (/admin/*)
  → 内部API (/api/admin/*)
  → Firebase Admin SDK
  → Firestore更新
  → revalidatePath() で対象ページを再生成
  → Vercel本番にも反映
```

Vercel本番環境で変更を反映するには、`FIREBASE_ADMIN_PROJECT_ID`、`FIREBASE_ADMIN_CLIENT_EMAIL`、`FIREBASE_ADMIN_PRIVATE_KEY` が正しいFirebaseプロジェクトを指している必要があります。管理画面の保存処理はサーバー側APIで実行されるため、microCMSの管理画面やWebhookは不要です。

トップページの更新履歴と `/reports` の記事一覧/詳細は、いずれも `reports` コレクションを参照します。管理画面 `/admin/reports` で作成・編集・削除した活動レポートが、そのままトップの更新履歴（日付の新しい順、先頭4件）にも反映されます。かつて存在した `/admin/news`（ニュース管理）は、`news` と `reports` の二重管理を避けるため廃止し、活動レポートへ一本化しました。

「○○メディアに掲載されました」のように外部サイトへ誘導したい告知も、活動レポートを1件作成し、本文（リッチテキスト）に外部リンクを記載すれば対応できます。専用のニュース枠や外部リンクフィールドは設けていません。

サイト全体の固定文言は `/admin/site-settings` から `siteSettings/general` を編集します。Firestoreに未保存の場合は `src/data/siteSettings.ts` のデフォルト値で表示されます。

microCMSからの移行は `scripts/import-microcms-to-firestore.mjs` を使います。`news` エンドポイントがない場合は `reports` の既存データを `news` にも複製し、管理画面から以後の作成・編集・削除を行えます。

リッチテキスト編集は `src/components/editor/RichTextEditor.tsx` のTipTapエディターを使います。管理者向け画像アップロードは `/api/admin/upload` で Vercel Blob へ保存し、本文HTMLに画像URLを挿入します。ドラッグ&ドロップ、ペースト、画像URL挿入にも対応しています。

### 管理画面

管理画面はNextAuthで保護されています。

- `/admin`: 管理トップ
- `/admin/members`: 会員一覧、種別・プロフィール状況確認、CSVエクスポート
- `/admin/facilities`: 開催会員が登録した施設の審査
- `/admin/ensembles`: アンサンブル管理
- `/admin/spots`: 宿泊施設管理
- `/admin/site-settings`: サイト共通設定管理
- `/admin/reports`: 活動レポート管理
- `/admin/edit/[id]`: 既存のアンサンブル編集

会員CSVには、氏名、フリガナ、ログインメール、連絡メール、電話番号、住所、会員種別、職業、興味分野、コメント、紹介者、団体名、プロフィール完了、登録日が含まれます。

管理画面ログインはメールアドレスとパスワードのみです。Googleログインは管理画面では使いません。Firebase Authで認証後、Firebase Custom Claim `admin: true` を持つアカウントだけがNextAuthセッションを発行できます。

### UI/表示まわりの現在仕様

- ヘッダーは `siteSettings.navigation` の文言を使い、外部リンクとしてnoteへの導線を追加しています。
- トップのカルーセルは自動切り替えを維持しています。
- トップのスクロール出現アニメーションとローディングアニメーションは削除し、初期表示を軽くしています。
- トップの森タイプアイコン列は横幅いっぱいに散らさず、中央寄せのまとまった幅で表示します。
- ヘッダー/フッター、トップ森タイプ、コンセプト補助カード、主要ページ見出し/CTA、地図データは `siteSettings/general` へ切り出しています。

### 主要API追補

| メソッド | パス | 認証 | 説明 |
|---|---|---|---|
| POST | `/api/newsletter` | 不要 | Benchmarkメルマガ登録 + Firestore保存 |
| GET | `/api/public/site-settings` | 不要 | サイト共通設定取得 |
| POST | `/api/revalidate` | 現状なし | CMS更新後のISR再生成 |
| POST | `/api/member/event` | `fb_session` | 開催会員以上のイベント作成 |
| POST | `/api/member/event/[id]/join` | `fb_session` | イベント参加 |
| GET/PATCH | `/api/admin/site-settings` | Admin Session | サイト共通設定取得・更新 |
| POST | `/api/admin/upload` | Admin Session | 管理者向け画像アップロード |
| PATCH | `/api/admin/facilities/[id]` | Admin Session | 施設審査ステータス更新 |
| GET | `/api/admin/members/export` | Admin Cookie | 会員CSVダウンロード |

### 注意点

- README本文の一部には、旧仕様の `free / member / supporter / organizer / staff` や、トップページにLC/活動レポートセクションがある前提の説明が残っています。現コードの会員種別は `participant / organizer / inner` です。
- Benchmark APIキーなどのシークレットは `.env.local` とVercel環境変数で管理し、ログやREADMEに実値を書かないでください。
- `MICROCMS_*` は移行スクリプト用に残せますが、公開表示と管理画面更新はFirestoreベースの自作CMSへ移行しています。
- GitHub URL: https://github.com/KaitoS828/Edible-Forest

### 追補（2026-06-19）多言語・固定ページ・画像アップロード

- **規約系固定ページのCMS化**: `/privacy`（プライバシーポリシー）・`/terms`（利用規約）・`/company`（運営会社）を追加。デフォルト文面は `src/data/legalContent.ts` に変数として保持し、`/admin/cms/pages/{id}` から上書き編集できます。CMS未設定時はソースのデフォルトにフォールバックするため本番でも空表示になりません。初期投入は `node scripts/seed-legal-pages.mjs --write`。
- **各CMSの日本語 / English 切替**: 固定ページ・ニュース・活動レポート・アンサンブル・サイト設定の編集画面に言語タブを追加。英語版は同じコンテンツIDの `translations.en` に保存し（`?lang=en`）、日本語URL・既存データを壊さず英語文言だけ追加できます。公開側は `?lang=en` で `translations.en` を優先表示します。共通タブは `src/components/admin/LanguageTabs.tsx`。
- **管理者向け画像アップロード**: 各adminフォームの画像欄でURL入力に加えファイル添付が可能（`src/components/admin/ImageUpload.tsx`）。保存は `POST /api/admin/upload` で Vercel Blob に集約（admin認証必須、未認証は403）。**画像のみ・2MBまで**。Vercel側ではBlob Storeをプロジェクトへ接続し、`BLOB_STORE_ID` / `BLOB_WEBHOOK_PUBLIC_KEY` が入っていることを確認してください。ローカル検証で必要な場合のみ `BLOB_READ_WRITE_TOKEN` を使います。
- **トップ表示調整**: 「旅に出よう「様々な食べられる森をさがしに」」見出しの文字色を白に変更。

### 追補（2026-06-20）固定ページCMS・ニュースの統合

- **固定ページCMSをサイト設定へ一本化**: `/admin/cms/pages`（固定ページCMS）を廃止。トップ（スライド・見出し）とコンセプト本文はサイト設定（`/admin/site-settings`）の各タブ、プライバシー/利用規約/運営会社は新設の「規約・会社」タブで編集します。公開ページ（`/`・`/concept`・`/privacy`・`/terms`・`/company`）はいずれも `siteSettings` を参照します。ja/en 切替もサイト設定側で対応済みです。
- **ニュース管理を活動レポートへ一本化**: `/admin/news`（ニュース管理）を廃止。トップの更新履歴は `reports` を日付の新しい順（先頭4件）で表示します。外部サイトへの誘導告知も、活動レポート本文にリンクを記載して対応します。
- 上記に伴い `scripts/seed-legal-pages.mjs`、`/api/admin/cms/pages`、`/api/admin/news` などの関連ファイルは削除済みです。`src/lib` の `getPage`/`getNews` などの旧ヘルパーは呼び出し元のないデッドコードとして残しています。
