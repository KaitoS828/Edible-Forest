/**
 * microCMS シードスクリプト
 * src/data/ensembles.ts の静的データを microCMS に一括投入します
 * 実行: node scripts/seed-microcms.mjs
 */

const SERVICE_DOMAIN = "morinooku";
const API_KEY = "na150APn6O8zHbk1I9ycKK5WZ1pVgDJjOeGu";
const ENDPOINT = "ansanbulu";
const BASE_URL = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}`;

const ENSEMBLES = [
  {
    id: "hiroo",
    name: "広尾町アンサンブル",
    sub: "北海道十勝郡広尾町",
    region: "北海道",
    regionColor: "#6BA26D",
    desc: "十勝の大地で食べられる植物を育て、庭づくりワークショップや宿泊体験を展開しています。",
    tagline: "十勝の大地で、食べられる森をつくる。",
    philosophy: "広大な十勝平野の一角に、農業以前の自然の仕組みを持ち込んだ食べられる森を育てています。収穫だけでなく、育てること・観ることそのものが生活の豊かさになる場所です。",
    img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    active: true,
    activities: [
      { icon: "🌱", title: "庭づくりワークショップ", desc: "食べられる植物の苗植えや土づくりを体験。専門家と一緒に自分の食べられる庭をデザインします。" },
      { icon: "🏡", title: "森の宿泊体験", desc: "食べられる森の中で一夜を過ごす体験プログラム。朝食には自分で摘んだハーブティーを。" },
      { icon: "📍", title: "在来種マッピング", desc: "十勝の在来食用植物を記録・データ化するプロジェクト。地域の食の記憶を次世代に伝えます。" },
    ],
    stats: [
      { label: "活動開始", value: "2022年" },
      { label: "面積", value: "約2ha" },
      { label: "在来種記録数", value: "25種" },
    ],
  },
  {
    id: "urahoro",
    name: "浦幌町アンサンブル",
    sub: "北海道十勝郡浦幌町",
    region: "北海道",
    regionColor: "#6BA26D",
    desc: "浦幌の森と川の生態系をフィールドに、在来種の記録と食べられる森のマッピングを進めています。",
    tagline: "川と森が教えてくれる、本来の生き方。",
    philosophy: "浦幌の豊かな自然は、人間が農業を始める前から続く生態系の記憶を持っています。その記憶を読み解き、現代の生活に活かす実験をしています。",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    active: true,
    activities: [
      { icon: "🗺️", title: "食べられる森マッピング", desc: "GPS・AIを活用して在来食用植物の分布を記録。誰でも使えるオープンマップとして公開予定。" },
      { icon: "🌊", title: "川と共にある暮らし体験", desc: "浦幌川の生態系を観察しながら、川がもたらす恵みを学ぶフィールドワーク。" },
      { icon: "🤝", title: "地域住民との共創", desc: "地元の農家・漁師・高齢者と協力して、地域の食の知恵をデジタルアーカイブ化します。" },
    ],
    stats: [
      { label: "活動開始", value: "2023年" },
      { label: "記録種数", value: "32種" },
      { label: "協力農家数", value: "8軒" },
    ],
  },
  {
    id: "musashino",
    name: "武蔵野アンサンブル",
    sub: "東京都武蔵野市",
    region: "関東",
    regionColor: "#E58251",
    desc: "都市に「生活生産」を取り込む試み。商店街再構築・都市農園を通じて新しい暮らしを実験中。",
    tagline: "都市の中に、もう一つの自然をつくる。",
    philosophy: "武蔵野の豊かな緑地と商店街を舞台に、都市生活者が「生活生産（生きるための活動）」に関わる接点をつくります。買うだけでなく、育て・作り・つながる都市の新しいモデルです。",
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    active: true,
    activities: [
      { icon: "🏪", title: "商店街再構築プロジェクト", desc: "空き店舗を食の生産・交換・体験の場にリデザイン。地域経済の新しい形を実験します。" },
      { icon: "🌿", title: "都市農園ネットワーク", desc: "屋上・路地・公園を活用した小さな農園をつなぎ、都市の緑と食のインフラを構築。" },
      { icon: "💡", title: "AI × 生活生産ラボ", desc: "AIを使った栽培管理・地域情報共有のツールを開発。テクノロジーで生活生産を豊かに。" },
    ],
    stats: [
      { label: "活動開始", value: "2023年" },
      { label: "都市農園数", value: "12箇所" },
      { label: "連携店舗", value: "5店" },
    ],
  },
  {
    id: "bunji",
    name: "ぶんじ食堂",
    sub: "東京都国分寺市",
    region: "関東",
    regionColor: "#E58251",
    desc: "地域の駅として機能するコミュニティ拠点。食を中心に人と人をつなぎ、都市の生活生産を実践。",
    tagline: "食卓が、地域をつなぐ交差点になる。",
    philosophy: "ぶんじ食堂は単なる飲食店ではなく、人・食・情報が行き交う「地域の駅」です。食べることを中心に据えながら、生活生産の喜びを都市の日常に取り戻す実験場として機能しています。",
    img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
    active: true,
    activities: [
      { icon: "🍽️", title: "地域食材を使った食堂", desc: "各地のアンサンブルから届く食材を使ったメニューを提供。食べることで全国のLCとつながれます。" },
      { icon: "📚", title: "生活生産ワークショップ", desc: "料理・発酵・クラフトなど、都市で実践できる生活生産を体験するプログラムを定期開催。" },
      { icon: "🔗", title: "アンサンブル交流イベント", desc: "各地からメンバーが集まる交流の場。インターローカルなつながりを体感できます。" },
    ],
    stats: [
      { label: "活動開始", value: "2022年" },
      { label: "月間来店者", value: "約200人" },
      { label: "連携LC数", value: "5拠点" },
    ],
  },
  {
    id: "omaezaki",
    name: "御前崎アンサンブル",
    sub: "静岡県御前崎市",
    region: "東海",
    regionColor: "#DBCD52",
    desc: "海と山に囲まれた御前崎で、海産物と森の恵みをかけ合わせた「食と暮らし」の新モデルを探求。",
    tagline: "海と山の恵みが出会う、食の実験場。",
    philosophy: "御前崎は海岸線と山地が隣接する稀有な場所。漁師・農家・都市住民が一堂に会し、それぞれの知恵と資源を持ち寄ることで、産業生産社会では見えなかった新しい食の形を模索しています。",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    active: true,
    activities: [
      { icon: "🎣", title: "漁師×農家×都市民 三者交流", desc: "それぞれの立場から食の未来を語り合う交流会。海産物と農産物の物々交換も実施。" },
      { icon: "🌿", title: "海岸林の食べられる森づくり", desc: "海風に強い在来種を活用した防砂林×食べられる森の実験プロジェクト。" },
      { icon: "🏄", title: "海の生態系フィールドワーク", desc: "海岸の生態系から学ぶプログラム。海藻・貝類の持続的な採取方法を体験します。" },
    ],
    stats: [
      { label: "活動開始", value: "2023年" },
      { label: "連携漁師数", value: "4名" },
      { label: "連携農家数", value: "6軒" },
    ],
  },
  {
    id: "takeno",
    name: "竹野アンサンブル",
    sub: "兵庫県豊岡市竹野町",
    region: "近畿",
    regionColor: "#6BA26D",
    desc: "竹野の豊かな自然の中で、伝統的な生活様式と現代テクノロジーを融合させた暮らしを実践。",
    tagline: "竹野の自然が、次の生き方を示す。",
    philosophy: "竹野は日本海に面した小さな漁村ですが、豊かな自然と伝統的な暮らしの知恵が残っています。その知恵をAIと組み合わせ、持続可能な生活モデルを現代に蘇らせます。",
    img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80",
    active: true,
    activities: [
      { icon: "🌊", title: "海と山の複合生態系探索", desc: "山から海へ続く生態系を一日で体験するガイドツアー。食べられる植物・海藻・魚を観察。" },
      { icon: "🏘️", title: "伝統民家リノベーション", desc: "空き家を食べられる森の拠点にリノベートする実験。伝統工法と現代設計の融合。" },
      { icon: "📡", title: "デジタル×伝統知恵アーカイブ", desc: "地域の長老から聞き取った自然の知恵をAIで整理・共有するプロジェクト。" },
    ],
    stats: [
      { label: "活動開始", value: "2023年" },
      { label: "空き家活用数", value: "2棟" },
      { label: "伝統知恵記録数", value: "180件" },
    ],
  },
  {
    id: "shimanto",
    name: "四万十アンサンブル",
    sub: "高知県四万十市",
    region: "中国・四国",
    regionColor: "#E58251",
    desc: "四万十川流域の豊かな生態系から学び、川と共にある暮らしを実践。食べられる森の本質を体感できる拠点。",
    tagline: "四万十川が、生命の循環を教えてくれる。",
    philosophy: "四万十川は日本最後の清流と呼ばれ、手つかずに近い生態系が残っています。川と森と人間が本来持っていた豊かな関係を取り戻し、現代の生活に活かす実験をしています。",
    img: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80",
    active: true,
    activities: [
      { icon: "🦋", title: "清流フィールドワーク", desc: "四万十川の生態系を観察するガイドウォーク。川魚・水生昆虫・河岸植物を専門家と観察。" },
      { icon: "🌿", title: "食べられる川辺の森づくり", desc: "川辺の在来種を活かした食べられる森の整備。洪水対策にもなる生態的デザイン。" },
      { icon: "🎋", title: "四万十の伝統食再現", desc: "地元の食文化・保存食・発酵食を若い世代に伝えるワークショップを定期開催。" },
    ],
    stats: [
      { label: "活動開始", value: "2022年" },
      { label: "川辺整備区域", value: "約1.2km" },
      { label: "食文化記録数", value: "45品" },
    ],
  },
];

async function upsert(ensemble) {
  const { id, img, activities, stats, ...fields } = ensemble;

  // 繰り返しフィールドは fieldId が必要
  const body = {
    ...fields,
    activities: activities.map((a) => ({ ...a, fieldId: "activity" })),
    stats: stats.map((s) => ({ ...s, fieldId: "stat" })),
    // imgはURLだけ渡す（microCMSの画像フィールドには対応していないためスキップ）
  };

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-MICROCMS-API-KEY": API_KEY,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (res.ok) {
    console.log(`✅ ${id}: ${ensemble.name}`);
  } else {
    console.error(`❌ ${id}: ${JSON.stringify(json)}`);
  }
}

console.log("🌿 microCMS シードを開始します...\n");
for (const ensemble of ENSEMBLES) {
  await upsert(ensemble);
}
console.log("\n✨ 完了！microCMS のダッシュボードで確認してください。");
