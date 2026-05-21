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
11. [環境変数](#環境変数)
12. [ローカル開発](#ローカル開発)

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
| ファイルストレージ | Firebase Storage（アバター画像） |
| 決済 | Stripe（月額 ¥1,000 サブスクリプション） |
| CMS（管理者用） | TipTap リッチテキストエディター |
| CMS（オプション） | microCMS（外部コンテンツ管理） |
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
│  │  (アバター画像)  │  │
│  └──────────────────┘  │
└────────────────────────┘
```

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
│   │   ├─ stripe.ts                     Stripe クライアント + Price ID 管理
│   │   └─ microcms.ts                   microCMS クライアント（オプション）
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

# ── microCMS (オプション) ────────────────────────────
MICROCMS_SERVICE_DOMAIN=
MICROCMS_API_KEY=
MICROCMS_WRITE_API_KEY=

# ── サイト URL ───────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
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

### Firebase Storage CORS 設定（アバターアップロード用）

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
