# TECHNICAL.md — 食べられる森アンサンブル倶楽部

> 技術仕様・設計メモ。開発時の参照用。

---

## スタック

| レイヤー | 技術 |
|---------|------|
| Frontend | Next.js 16 (App Router) + Tailwind CSS 4 |
| 言語 | TypeScript |
| 認証（会員） | Firebase Auth（メール/パスワード）+ セッションCookie |
| 認証（管理者） | NextAuth + Firebase Custom Claims |
| DB | Firestore（Firebase Admin SDK） |
| 決済 | Stripe サブスクリプション |
| Deploy | Vercel 想定 |
| ポート（開発） | Frontend 3000 |

---

## ディレクトリ構成

```
src/
├── app/
│   ├── (public)          # トップ・アンサンブル・スポット等
│   ├── admin/
│   │   ├── login/        # NextAuth管理者ログイン
│   │   └── (protected)/  # 管理画面（session必須）
│   │       ├── page.tsx        # アンサンブル一覧
│   │       ├── members/        # 会員管理
│   │       └── edit/[id]/      # アンサンブル編集
│   ├── member/
│   │   └── (managed)/    # 会員ダッシュボード（sessionCookie必須）
│   ├── api/
│   │   ├── session/      # Firebase sessionCookie発行
│   │   ├── admin/members/[uid]/ # 会員種別更新API
│   │   └── public/spots/ # 公開スポットAPI
│   └── ...
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── RevealOnScroll.tsx  # スクロールアニメーション
│   └── JapanMap/
├── lib/
│   ├── firebase.ts         # Client SDK
│   ├── firebase-admin.ts   # Admin SDK（遅延初期化Proxy）
│   └── firestore.ts        # DB操作関数・型定義
├── auth.ts                 # NextAuth設定
└── actions/auth.ts         # Server Action（管理者ログイン）
```

---

## Firestore スキーマ

### `users/{uid}`

| フィールド | 型 | 説明 |
|-----------|-----|------|
| email | string | メアド |
| displayName | string | 表示名 |
| photoURL | string | アバター |
| role | `"member" \| "admin"` | 基本ロール |
| memberType | `MemberType` | 会員種別（下記参照） |
| memberNote | string | 本部メモ |
| approvedAt | Timestamp | 承認日 |
| profileCompleted | boolean | プロフィール設定済み |
| stripeCustomerId | string | Stripe顧客ID |
| subscriptionId | string | StripeサブスクID |
| subscriptionStatus | `SubscriptionStatus` | Stripeステータス |
| subscriptionPeriodEnd | number | Unix timestamp |
| createdAt | Timestamp | 登録日 |

### `MemberType`
```ts
"free" | "member" | "supporter" | "organizer" | "staff"
```

| 値 | 表示名 | 権限 |
|----|--------|------|
| free | 無料会員 | 閲覧のみ |
| member | 正会員 | アンサンブル参加・宿泊予約 |
| supporter | サポーター | 活動支援者 |
| organizer | 拠点運営者 | 自分の拠点編集可能 |
| staff | スタッフ | 運営スタッフ |

### `ensembles/{id}`

| フィールド | 型 | 説明 |
|-----------|-----|------|
| authorId | string | 作成者UID |
| name / sub | string | 名称・サブタイトル |
| region / regionColor | string | 地域・カラー |
| status | `"draft" \| "published"` | 公開状態 |
| active | boolean | 有効フラグ |
| isOfficial | boolean | 公式フラグ |
| createdAt / updatedAt | Timestamp | |

### `spots/{id}`

| フィールド | 型 | 説明 |
|-----------|-----|------|
| authorId | string | 作成者UID |
| name / sub / desc | string | 名称等 |
| region / regionColor | string | |
| img | string | 画像URL |
| price / capacity | string | 価格・定員 |
| createdAt / updatedAt | Timestamp | |

---

## 認証フロー

### 会員（Firebase Auth）
```
1. /signup → createUserWithEmailAndPassword
2. getIdToken() → POST /api/session → sessionCookie発行（14日）
3. 各ページ: Cookie → adminAuth.verifySessionCookie()
4. 初回ログイン: profileCompleted=false → /member/setup へリダイレクト
```

### 管理者（NextAuth + Custom Claims）
```
1. /admin/login → Credentials Provider
2. Firebase REST API でメアド+パスワード検証
3. adminAuth.verifyIdToken() → decoded.admin === true を確認
4. JWT セッション発行
5. /admin/(protected)/layout.tsx で auth() チェック
```

### 管理者クレーム付与
```bash
npx tsx --env-file=.env.local scripts/set-admin.ts add <email> [password]
npx tsx --env-file=.env.local scripts/set-admin.ts list
npx tsx --env-file=.env.local scripts/set-admin.ts remove <email>
```

---

## API Routes

| Method | Path | 説明 |
|--------|------|------|
| POST | `/api/session` | Firebase sessionCookie発行 |
| DELETE | `/api/session` | ログアウト |
| GET | `/api/public/spots` | 公開スポット一覧 |
| GET | `/api/ensemble/[id]` | アンサンブル取得 |
| PATCH | `/api/admin/members/[uid]` | 会員種別更新（管理者のみ） |

---

## アニメーション

```css
/* イージング変数 */
--ease-out:   cubic-bezier(.83, 0, .17, 1)   /* メイン */
--ease-in-out: cubic-bezier(.76, 0, .24, 1)

/* duration */
--duration-fast: 0.45s
--duration-base: 0.65s
--duration-slow: 0.9s
```

**RevealOnScroll コンポーネント**（`src/components/RevealOnScroll.tsx`）
- Intersection Observer でビューポート進入を検知
- `from="bottom" | "left" | "right"` で方向指定
- `delay` prop でズラし

**ヒーロー入場**（CSSクラス）
```
.hero-label   → 0.2s delay
.hero-title   → 0.35s delay
.hero-caption → 0.5s delay
.hero-divider → 0.6s delay
.hero-cta     → 0.75s delay
```

---

## 環境変数（.env.local）

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY

AUTH_SECRET           # NextAuth シークレット
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

---

## 開発コマンド

```bash
npm run dev              # 開発サーバー起動（port 3000）
npx tsc --noEmit         # 型チェック
npm run build            # ビルド

# 管理者操作
npx tsx --env-file=.env.local scripts/set-admin.ts add <email> <password>
npx tsx --env-file=.env.local scripts/set-admin.ts list
```
