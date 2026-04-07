# DESIGN.md — 食べられる森アンサンブル倶楽部

> AIエージェントが正確な日本語UIを生成するためのデザイン仕様書。
> 値はすべて実際のCSS（globals.css・各コンポーネント）から抽出。

---

## 1. Visual Theme & Atmosphere

森・農・暮らしをテーマにした、ゆったりとした読み物型コミュニティサイト。

- **キーワード**: 穏やか、有機的、ナチュラル、温かみ、信頼感
- **配色**: フォレストグリーン軸。白背景に深みのある緑とテキストのコントラスト
- **余白**: 広め。情報は少量ずつ丁寧に提示する
- **アニメーション**: すべてゆるやか。`cubic-bezier(0.16, 1, 0.3, 1)` を基本イージングとして使用

---

## 2. Color Palette & Roles

| Token | Hex | 用途 |
|-------|-----|------|
| Primary | `#3C6B4F` | ブランドカラー。CTAボタン・見出し・アクセント全般 |
| Primary Mid | `#5A8D73` | ホバー・補助カラー |
| Primary Pale | `#F0F6F2` | 背景の差し色・ハイライト |
| Text | `#1A2B1E` | 本文・ラベル・補助テキスト（暗緑がかった黒） |
| Background | `#F7FAF7` | ページ全体の背景（わずかにグリーンがかった白） |
| Surface | `#FFFFFF` | カード・セクション・モーダルの面 |
| Border | `rgba(60,107,79,0.15)` | 区切り線・入力枠 |
| Border Subtle | `#e5e5e5` | タブ区切り・水平線 |

**透過度による強調**（色を変えずに情報の重みを調整）

- 強調: `opacity: 1`
- 補足: `opacity: 0.55`
- 薄め: `opacity: 0.35〜0.45`

---

## 3. Typography Rules

### 3.1 フォント

```css
/* 本文・見出し（デフォルト） */
font-family: 'Noto Serif JP', serif;

/* UIラベル・バッジ・キャプション */
font-family: 'Noto Sans JP', sans-serif;
```

```html
<!-- Google Fonts 読み込み -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />
```

### 3.2 サイズ・ウェイト階層

| Role | Size (mobile → desktop) | Weight | Line Height | Letter Spacing |
|------|------------------------|--------|-------------|----------------|
| Hero H1 | 30px → 48px | 700 | leading-tight | 0 |
| Heading 2 | 24px → 30px | 700 | leading-snug | 0 |
| Heading 3 | 18px → 20px | 700 | leading-snug | 0 |
| Body | 14px | 400 | 1.9 | 0.02em |
| Label / Badge | 11–12px | 500–600 | — | 0 |
| Caption | 11px | 400 | — | 0 |

### 3.3 行間・字間

- **本文 line-height**: `1.8`（body デフォルト）/ `1.9`（コンポーネント）/ `2`（prose）
- **見出し line-height**: `1.25〜1.375`（leading-tight〜snug）
- **letter-spacing**: `0.02em`（body 全体に適用）

### 3.4 禁則処理

```css
overflow-wrap: break-word;
line-break: strict;
```

### 3.5 OpenType（見出しに推奨）

```css
font-feature-settings: "palt" 1, "kern" 1;
```

---

## 4. Component Stylings

### Buttons

| Variant | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| Primary | `#3C6B4F` | white | — | opacity 0.9 |
| Secondary | transparent | `#3C6B4F` | `2px solid #3C6B4F` | bg `#3C6B4F`, text white |
| Ghost（ヒーロー上） | `rgba(255,255,255,0.15)` | white | `1px solid rgba(255,255,255,0.4)` + `backdrop-filter: blur(4px)` | opacity 0.9 |

全ボタン共通: `border-radius: 9999px`（rounded-full）、`font-size: 14px`、`font-weight: 500`、`padding: 12px 24px`

### Badges / Tags

```css
height: 23px; /* 小: 20px */
line-height: 23px;
border-radius: 11.5px; /* 高さの半分 */
background: #3C6B4F; /* または地域カラー */
color: white;
font-size: 12px;
font-weight: 500;
padding: 0 12px;
```

### Cards

```css
background: #FFFFFF;
border: 1px solid rgba(0,95,2,0.15);
border-radius: 16px; /* rounded-2xl。大カードは 24px */
padding: 20px;
box-shadow: 0 2px 16px rgba(0,0,0,0.06);

/* ホバー（.card-lift） */
transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease;
transform: translateY(-5px);
box-shadow: 0 12px 36px rgba(60,107,79,0.12);
```

### Circle Cards（アンサンブル）

```css
border-radius: 50%;
width: 180px; height: 180px; /* 検索結果: 120px */
box-shadow: 0 0 0 4px white, 0 0 0 6px <regionColor>40;

/* ホバー */
transform: scale(1.04);
transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
```

### Inputs

```css
background: #FFFFFF;
border: 1px solid rgba(60,107,79,0.15);
border-radius: 8px;
padding: 8px 12px;
font-size: 14px;

/* フォーカス */
border-color: #3C6B4F;
```

### Tabs

```css
/* Active */
color: #3C6B4F; font-weight: 700;
border-bottom: 2px solid #3C6B4F;

/* Inactive */
color: #1A2B1E; opacity: 0.5;
border-bottom: 2px solid transparent;

/* コンテナ */
border-bottom: 1px solid #e5e5e5;
```

### Prose（リッチテキスト）

```css
h2  { font-size: 1.25rem; font-weight: 700; color: #3C6B4F; margin-top: 2rem; }
h3  { font-size: 1.05rem; font-weight: 700; color: #3C6B4F; margin-top: 1.5rem; }
p   { line-height: 2; margin: 0.75rem 0; }
blockquote { border-left: 3px solid #3C6B4F; padding-left: 1rem; font-style: italic; }
img { border-radius: 12px; }
```

---

## 5. Layout Principles

### Container

| 用途 | Max Width | 横 Padding |
|------|----------|-----------|
| メインコンテンツ | 1200px | 20px / lg: 40px |
| レポート・記事 | 900px | 20px / lg: 40px |

### Section Spacing

- 縦 padding: `64px`（py-16）/ デスクトップ: `96px`（md:py-24）
- 見出し下マージン: `56px`（mb-14）

### Grid パターン

| 用途 | クラス |
|------|--------|
| カード一覧（最大4列） | `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4` |
| スポット一覧（最大3列） | `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` |
| 2カラム（About等） | `md:grid-cols-2` |
| Gap | `gap-8`〜`gap-10` |

---

## 6. Depth & Elevation

| Level | Value | 用途 |
|-------|-------|------|
| 0 | none | フラット要素・背景面 |
| 1 | `0 2px 16px rgba(0,0,0,0.06)` | カード（通常） |
| 2 | `0 12px 36px rgba(60,107,79,0.12)` | カード（ホバー） |
| Ring | `0 0 0 4px white, 0 0 0 6px <color>40` | 円形カード |

---

## 7. Do's and Don'ts

### Do

- 見出しは `'Noto Serif JP', serif` を必ず使用する
- 本文は `line-height: 1.8` 以上（推奨 1.9〜2.0）を維持する
- ボタンは `border-radius: 9999px`（ピルシェイプ）で統一する
- ボーダーは `rgba(60,107,79,0.15)` で薄く・上品に表現する
- アニメーションは `cubic-bezier(0.16, 1, 0.3, 1)` でゆるやかに
- セクション背景は `#FFFFFF` と `#F7FAF7` を交互に使いリズムを作る

### Don't

- `font-family` を Noto Serif JP なしで指定しない
- 本文に `line-height: 1.5` 以下を使わない
- `#000000` をテキストに使わない（`#1A2B1E` を使う）
- `border-radius` に 4px 以下の角張った値を使わない
- シャドウの alpha を 0.2 以上にしない（重くなる）
- アニメーション duration を 100ms 以下にしない

---

## 8. Responsive Behavior

| Breakpoint | Width | レイアウト |
|-----------|-------|-----------|
| Mobile | < 640px | 1カラム |
| sm | ≥ 640px | 2カラム開始 |
| md | ≥ 768px | 3〜4カラム、余白拡大 |
| lg | ≥ 1024px | コンテナ padding 拡大（px-10） |

- Hero: mobile `80vh / text-3xl` → desktop `92vh / text-5xl`
- タッチターゲット最小: `44px × 44px`（ボタン `py-3` = 48px 高）

---

## 9. Agent Prompt Guide

```
# 食べられる森アンサンブル倶楽部 — デザイントークン早見表

Primary:     #3C6B4F
Text:        #1A2B1E
Background:  #F7FAF7
Surface:     #FFFFFF
Border:      rgba(60,107,79,0.15)

Font:        'Noto Serif JP', serif  （UIラベルは Noto Sans JP）
Body size:   14px  |  line-height: 1.9  |  letter-spacing: 0.02em
Radius:      9999px（ボタン）/ 16px（カード）/ 24px（大カード）
Easing:      cubic-bezier(0.16, 1, 0.3, 1)
```

**UIを新規作成するときのチェックリスト**

1. フォントは `'Noto Serif JP', serif` か
2. 本文 `line-height` は 1.8 以上か
3. ボタンは `rounded-full` か
4. テキストカラーに `#000000` を使っていないか
5. カードに `border: 1px solid rgba(60,107,79,0.15)` があるか
6. ホバーアニメーションに `cubic-bezier(0.16,1,0.3,1)` を使っているか
