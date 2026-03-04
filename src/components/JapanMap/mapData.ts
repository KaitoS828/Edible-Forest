export type RegionId =
  | "hokkaido"
  | "tohoku"
  | "kanto"
  | "shinetsu"
  | "tokai"
  | "kinki"
  | "chugoku"
  | "kyushu";

export interface LCSpot {
  name: string;
  sub: string;
  desc: string;
  img: string;
}

export interface RegionInfo {
  id: RegionId;
  name: string;
  active: boolean;
  color: string;
  hoverColor: string;
  spots: LCSpot[];
}

export const REGIONS: Record<RegionId, RegionInfo> = {
  hokkaido: {
    id: "hokkaido",
    name: "北海道",
    active: true,
    color: "#005F02",
    hoverColor: "#005F02",
    spots: [
      {
        name: "広尾町アンサンブル",
        sub: "十勝郡広尾町",
        desc: "十勝の広大な大地で食べられる植物を育て、庭づくりワークショップや宿泊体験を展開しています。",
        img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=70",
      },
      {
        name: "浦幌町アンサンブル",
        sub: "十勝郡浦幌町",
        desc: "浦幌の森と川の生態系をフィールドに、在来種の記録と食べられる森のマッピングを進めています。",
        img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=70",
      },
    ],
  },
  tohoku: {
    id: "tohoku",
    name: "東北",
    active: false,
    color: "rgba(0,95,2,0.15)",
    hoverColor: "rgba(0,95,2,0.28)",
    spots: [],
  },
  kanto: {
    id: "kanto",
    name: "関東",
    active: true,
    color: "#005F02",
    hoverColor: "#005F02",
    spots: [
      {
        name: "武蔵野アンサンブル",
        sub: "東京都武蔵野市",
        desc: "都市の中に「生活生産」を取り込む試み。商店街の再構築や都市農園を通じて新しい暮らしを実験しています。",
        img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=70",
      },
      {
        name: "ぶんじ食堂",
        sub: "東京都国分寺市",
        desc: "地域の駅として機能するコミュニティ拠点。食を中心に人と人をつなぎ、都市の生活生産を実践します。",
        img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=70",
      },
    ],
  },
  shinetsu: {
    id: "shinetsu",
    name: "信越・北陸",
    active: false,
    color: "rgba(0,95,2,0.15)",
    hoverColor: "rgba(0,95,2,0.28)",
    spots: [],
  },
  tokai: {
    id: "tokai",
    name: "東海",
    active: true,
    color: "#005F02",
    hoverColor: "#005F02",
    spots: [
      {
        name: "御前崎アンサンブル",
        sub: "静岡県御前崎市",
        desc: "海と山に囲まれた御前崎で、海産物と森の恵みをかけ合わせた「食と暮らし」の新モデルを探求しています。",
        img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=70",
      },
    ],
  },
  kinki: {
    id: "kinki",
    name: "近畿",
    active: true,
    color: "#005F02",
    hoverColor: "#005F02",
    spots: [
      {
        name: "竹野アンサンブル",
        sub: "兵庫県豊岡市竹野町",
        desc: "竹野の豊かな自然の中で、伝統的な生活様式と現代テクノロジーを融合させた実験的な暮らしを実践します。",
        img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=70",
      },
    ],
  },
  chugoku: {
    id: "chugoku",
    name: "中国・四国",
    active: true,
    color: "#005F02",
    hoverColor: "#005F02",
    spots: [
      {
        name: "四万十アンサンブル",
        sub: "高知県四万十市",
        desc: "四万十川流域の豊かな生態系から学び、川と共にある暮らしを実践する拠点。食べられる森の本質を体感できます。",
        img: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600&q=70",
      },
    ],
  },
  kyushu: {
    id: "kyushu",
    name: "九州・沖縄",
    active: false,
    color: "rgba(0,95,2,0.15)",
    hoverColor: "rgba(0,95,2,0.28)",
    spots: [],
  },
};

// 都道府県ID（1-47）→ 地域ID マッピング
export const PREF_TO_REGION: Record<number, RegionId> = {
  1:  "hokkaido",
  2:  "tohoku",  3:  "tohoku",  4:  "tohoku",  5:  "tohoku",  6:  "tohoku",  7:  "tohoku",
  8:  "kanto",   9:  "kanto",  10:  "kanto",  11:  "kanto",  12:  "kanto",  13:  "kanto",  14:  "kanto",
  15: "shinetsu", 16: "shinetsu", 17: "shinetsu", 18: "shinetsu", 19: "shinetsu", 20: "shinetsu",
  21: "tokai",  22: "tokai",  23: "tokai",
  24: "kinki",  25: "kinki",  26: "kinki",  27: "kinki",  28: "kinki",  29: "kinki",  30: "kinki",
  31: "chugoku", 32: "chugoku", 33: "chugoku", 34: "chugoku", 35: "chugoku",
  36: "chugoku", 37: "chugoku", 38: "chugoku", 39: "chugoku",
  40: "kyushu",  41: "kyushu",  42: "kyushu",  43: "kyushu",  44: "kyushu",  45: "kyushu",  46: "kyushu",  47: "kyushu",
};
