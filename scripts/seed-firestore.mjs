/**
 * Firestore シードスクリプト
 * ダミーユーザー / アンサンブル / 宿泊拠点 を一括投入します
 * 実行: node --env-file=.env.local scripts/seed-firestore.mjs
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// ─── Firebase 初期化 ───────────────────────────────────────────────────────
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}
const db = getFirestore();

// ─── ダミーユーザー ──────────────────────────────────────────────────────────
const USERS = [
  {
    uid: "user_tanaka",
    email: "tanaka@example.com",
    displayName: "田中 誠",
    photoURL: "https://i.pravatar.cc/150?u=tanaka",
    role: "member",
  },
  {
    uid: "user_yamaguchi",
    email: "yamaguchi@example.com",
    displayName: "山口 葵",
    photoURL: "https://i.pravatar.cc/150?u=yamaguchi",
    role: "member",
  },
  {
    uid: "user_sato",
    email: "sato@example.com",
    displayName: "佐藤 悠",
    photoURL: "https://i.pravatar.cc/150?u=sato",
    role: "member",
  },
  {
    uid: "user_nakamura",
    email: "nakamura@example.com",
    displayName: "中村 凛",
    photoURL: "https://i.pravatar.cc/150?u=nakamura",
    role: "member",
  },
  {
    uid: "user_ito",
    email: "ito@example.com",
    displayName: "伊藤 大地",
    photoURL: "https://i.pravatar.cc/150?u=ito",
    role: "member",
  },
];

// ─── アンサンブル ────────────────────────────────────────────────────────────
// id は静的データ(src/data/ensembles.ts)と同じキーを使用
const ENSEMBLES = [
  {
    id: "hiroo",
    authorId: "user_tanaka",
    authorName: "田中 誠",
    name: "広尾町アンサンブル",
    sub: "北海道十勝郡広尾町",
    region: "北海道",
    regionColor: "#005F02",
    desc: "十勝の大地で食べられる植物を育て、庭づくりワークショップや宿泊体験を展開しています。",
    tagline: "十勝の大地で、食べられる森をつくる。",
    philosophy: "<p>広大な十勝平野の一角に、農業以前の自然の仕組みを持ち込んだ食べられる森を育てています。収穫だけでなく、育てること・観ることそのものが生活の豊かさになる場所です。</p>",
    img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    activities: [],
    stats: [],
    gallery: [],
    active: true,
    status: "published",
    isOfficial: true,
  },
  {
    id: "urahoro",
    authorId: "user_tanaka",
    authorName: "田中 誠",
    name: "浦幌町アンサンブル",
    sub: "北海道十勝郡浦幌町",
    region: "北海道",
    regionColor: "#005F02",
    desc: "浦幌の森と川の生態系をフィールドに、在来種の記録と食べられる森のマッピングを進めています。",
    tagline: "川と森が教えてくれる、本来の生き方。",
    philosophy: "<p>浦幌の豊かな自然は、人間が農業を始める前から続く生態系の記憶を持っています。その記憶を読み解き、現代の生活に活かす実験をしています。</p>",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    activities: [],
    stats: [],
    gallery: [],
    active: true,
    status: "published",
    isOfficial: true,
  },
  {
    id: "musashino",
    authorId: "user_yamaguchi",
    authorName: "山口 葵",
    name: "武蔵野アンサンブル",
    sub: "東京都武蔵野市",
    region: "関東",
    regionColor: "#D96868",
    desc: "都市に「生活生産」を取り込む試み。商店街再構築・都市農園を通じて新しい暮らしを実験中。",
    tagline: "都市の中に、もう一つの自然をつくる。",
    philosophy: "<p>武蔵野の豊かな緑地と商店街を舞台に、都市生活者が「生活生産」に関わる接点をつくります。買うだけでなく、育て・作り・つながる都市の新しいモデルです。</p>",
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    activities: [],
    stats: [],
    gallery: [],
    active: true,
    status: "published",
    isOfficial: true,
  },
  {
    id: "bunji",
    authorId: "user_yamaguchi",
    authorName: "山口 葵",
    name: "ぶんじ食堂",
    sub: "東京都国分寺市",
    region: "関東",
    regionColor: "#D96868",
    desc: "地域の駅として機能するコミュニティ拠点。食を中心に人と人をつなぎ、都市の生活生産を実践。",
    tagline: "食卓が、地域をつなぐ交差点になる。",
    philosophy: "<p>ぶんじ食堂は単なる飲食店ではなく、人・食・情報が行き交う「地域の駅」です。食べることを中心に据えながら、生活生産の喜びを都市の日常に取り戻す実験場として機能しています。</p>",
    img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
    activities: [],
    stats: [],
    gallery: [],
    active: true,
    status: "published",
    isOfficial: true,
  },
  {
    id: "omaezaki",
    authorId: "user_nakamura",
    authorName: "中村 凛",
    name: "御前崎アンサンブル",
    sub: "静岡県御前崎市",
    region: "東海",
    regionColor: "#D96868",
    desc: "海と山に囲まれた御前崎で、海産物と森の恵みをかけ合わせた「食と暮らし」の新モデルを探求。",
    tagline: "海と山の恵みが出会う、食の実験場。",
    philosophy: "<p>御前崎は海岸線と山地が隣接する稀有な場所。漁師・農家・都市住民が一堂に会し、それぞれの知恵と資源を持ち寄ることで、産業生産社会では見えなかった新しい食の形を模索しています。</p>",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    activities: [],
    stats: [],
    gallery: [],
    active: true,
    status: "published",
    isOfficial: true,
  },
  {
    id: "takeno",
    authorId: "user_ito",
    authorName: "伊藤 大地",
    name: "竹野アンサンブル",
    sub: "兵庫県豊岡市竹野町",
    region: "近畿",
    regionColor: "#005F02",
    desc: "竹野の豊かな自然の中で、伝統的な生活様式と現代テクノロジーを融合させた暮らしを実践。",
    tagline: "竹野の自然が、次の生き方を示す。",
    philosophy: "<p>竹野は日本海に面した小さな漁村ですが、豊かな自然と伝統的な暮らしの知恵が残っています。その知恵をAIと組み合わせ、持続可能な生活モデルを現代に蘇らせます。</p>",
    img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80",
    activities: [],
    stats: [],
    gallery: [],
    active: true,
    status: "published",
    isOfficial: true,
  },
  {
    id: "shimanto",
    authorId: "user_sato",
    authorName: "佐藤 悠",
    name: "四万十アンサンブル",
    sub: "高知県四万十市",
    region: "中国・四国",
    regionColor: "#D96868",
    desc: "四万十川流域の豊かな生態系から学び、川と共にある暮らしを実践。食べられる森の本質を体感できる拠点。",
    tagline: "四万十川が、生命の循環を教えてくれる。",
    philosophy: "<p>四万十川は日本最後の清流と呼ばれ、手つかずに近い生態系が残っています。川と森と人間が本来持っていた豊かな関係を取り戻し、現代の生活に活かす実験をしています。</p>",
    img: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80",
    activities: [],
    stats: [],
    gallery: [],
    active: true,
    status: "published",
    isOfficial: true,
  },
];

// ─── 宿泊拠点（Spots） ───────────────────────────────────────────────────────
const SPOTS = [
  {
    id: "spot_tokachi_forest",
    authorId: "user_tanaka",
    authorName: "田中 誠",
    name: "十勝の森コテージ",
    sub: "食べられる森に泊まる、静寂の一夜",
    region: "北海道",
    regionColor: "#005F02",
    desc: "広尾アンサンブルが管理する食べられる森の中に佇む小さなコテージ。ブナとナラの森に囲まれ、朝食には採れたてのハーブをつかったスープが振る舞われます。",
    content: "<p>十勝の広大な森の中、静かに佇む一棟貸しのコテージです。薪ストーブが灯る夜、満天の星空と澄んだ空気が日常の疲れを洗い流してくれます。</p><p>翌朝は食べられる森のガイドツアーへ。田中さんと一緒に、森の中で食べられる植物を探す体験ができます。</p>",
    img: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80",
    address: "北海道広尾郡広尾町字茂寄",
    capacity: "最大4名",
    price: "¥12,000〜 / 棟",
    access: "帯広空港より車で約50分",
    active: true,
    status: "published",
    isOfficial: true,
  },
  {
    id: "spot_urahoro_river",
    authorId: "user_tanaka",
    authorName: "田中 誠",
    name: "浦幌川リバーロッジ",
    sub: "清流のほとりで、ととのう自然滞在",
    region: "北海道",
    regionColor: "#005F02",
    desc: "浦幌川沿いに建つ木造のロッジ。川のせせらぎを聞きながら眠れる特別な場所。浦幌アンサンブルのフィールドワークへの参加もできます。",
    content: "<p>浦幌川の清流沿いに建つ、一棟貸しのナチュラルロッジです。自然素材をふんだんに使った空間で、本当の意味での「何もしない時間」を過ごせます。</p>",
    img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80",
    address: "北海道十勝郡浦幌町字北進",
    capacity: "最大6名",
    price: "¥9,800〜 / 棟",
    access: "浦幌駅より車で約20分",
    active: true,
    status: "published",
    isOfficial: true,
  },
  {
    id: "spot_musashino_house",
    authorId: "user_yamaguchi",
    authorName: "山口 葵",
    name: "武蔵野ゲストハウス「木漏れ日」",
    sub: "緑の武蔵野台地に宿る、都市の隠れ家",
    region: "関東",
    regionColor: "#D96868",
    desc: "武蔵野の屋敷林に囲まれた一軒家をリノベーションしたゲストハウス。東京から30分とは思えない静けさの中で、武蔵野アンサンブルの活動拠点としても機能しています。",
    content: "<p>武蔵野の雑木林に面した一軒家ゲストハウスです。古民家をモダンにリノベーションした空間は、都市の喧騒を忘れさせてくれます。</p><p>近くには山口さんが管理する都市農園があり、収穫体験も楽しめます。</p>",
    img: "https://images.unsplash.com/photo-1543968996-ee822b8176ba?w=800&q=80",
    address: "東京都武蔵野市境南町",
    capacity: "最大8名",
    price: "¥4,500〜 / 人",
    access: "武蔵境駅より徒歩12分",
    active: true,
    status: "published",
    isOfficial: true,
  },
  {
    id: "spot_takeno_kominka",
    authorId: "user_ito",
    authorName: "伊藤 大地",
    name: "竹野の古民家宿「海と山と」",
    sub: "日本海を望む、百年の記憶が宿る家",
    region: "近畿",
    regionColor: "#005F02",
    desc: "竹野海岸を一望できる高台に建つ古民家を、竹野アンサンブルが丁寧にリノベーション。茅葺き屋根はそのままに、水回りと寝室を現代的な快適さへ刷新しました。",
    content: "<p>築120年の古民家を、伊藤さんが3年かけてリノベーションした一棟貸しの宿です。囲炉裏の前で地元の食材を使った夕食を楽しんだあとは、満天の星を眺めながら過ごす特別な夜が待っています。</p>",
    img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    address: "兵庫県豊岡市竹野町竹野",
    capacity: "最大5名",
    price: "¥15,000〜 / 棟",
    access: "竹野駅より徒歩15分、または車で5分",
    active: true,
    status: "published",
    isOfficial: true,
  },
  {
    id: "spot_omaezaki_umibe",
    authorId: "user_nakamura",
    authorName: "中村 凛",
    name: "御前崎 海辺の宿「汐音」",
    sub: "波音と朝日が目覚ましの、岬の隠れ宿",
    region: "東海",
    regionColor: "#D96868",
    desc: "御前崎の灯台近くに建つ、海を望む小さな宿。中村さんが地元漁師と協力して用意する朝採れの魚介が絶品。御前崎アンサンブルの海辺フィールドワークの拠点でもあります。",
    content: "<p>御前崎の突端、灯台の見える丘に立つプライベートな宿泊施設です。全室オーシャンビューで、波の音を子守唄に眠れます。</p><p>朝食は地元漁師の朝獲れ魚介を使ったプレートをご用意します。</p>",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    address: "静岡県御前崎市御前崎",
    capacity: "最大4名",
    price: "¥18,000〜 / 棟",
    access: "菊川駅よりバス＋徒歩 約60分、または車で40分",
    active: true,
    status: "published",
    isOfficial: true,
  },
  {
    id: "spot_shimanto_lodge",
    authorId: "user_sato",
    authorName: "佐藤 悠",
    name: "四万十川 清流ロッジ",
    sub: "日本最後の清流のほとり、沈下橋が見える宿",
    region: "中国・四国",
    regionColor: "#D96868",
    desc: "四万十川の沈下橋を望む丘の上に建つログハウス。佐藤さんが川の生態系を守りながら運営する自然共生型の宿。清流のカヌー体験と一緒に楽しめます。",
    content: "<p>四万十川の沈下橋が見えるログハウスです。川のせせらぎと鳥の声だけが聞こえる静かな環境で、本当の意味でのリセット体験ができます。</p><p>川カヌー体験や、佐藤さんによる食べられる河川植物ガイドツアーもオプションでご用意しています。</p>",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    address: "高知県四万十市西土佐江川崎",
    capacity: "最大6名",
    price: "¥11,000〜 / 棟",
    access: "江川崎駅より車で約10分",
    active: true,
    status: "published",
    isOfficial: true,
  },
];

// ─── 書き込み ─────────────────────────────────────────────────────────────────
async function seed() {
  const batch1 = db.batch();

  // Users
  console.log("👤 ユーザーを書き込み中...");
  for (const u of USERS) {
    const ref = db.collection("users").doc(u.uid);
    batch1.set(ref, {
      ...u,
      createdAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  }
  await batch1.commit();
  console.log(`  ✅ ${USERS.length} 件のユーザーを登録しました`);

  // Ensembles（IDを指定して set）
  console.log("🌿 アンサンブルを書き込み中...");
  const batch2 = db.batch();
  for (const e of ENSEMBLES) {
    const { id, ...data } = e;
    const ref = db.collection("ensembles").doc(id);
    batch2.set(ref, {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  }
  await batch2.commit();
  console.log(`  ✅ ${ENSEMBLES.length} 件のアンサンブルを登録しました`);

  // Spots（IDを指定して set）
  console.log("🏡 宿泊拠点を書き込み中...");
  const batch3 = db.batch();
  for (const s of SPOTS) {
    const { id, ...data } = s;
    const ref = db.collection("spots").doc(id);
    batch3.set(ref, {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  }
  await batch3.commit();
  console.log(`  ✅ ${SPOTS.length} 件の宿泊拠点を登録しました`);

  console.log("\n🎉 シード完了！");
}

seed().catch((err) => {
  console.error("❌ エラー:", err);
  process.exit(1);
});
