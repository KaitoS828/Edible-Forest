import type { RegionInfo } from "@/components/JapanMap/mapData";
import { REGIONS } from "@/components/JapanMap/mapData";

export type NavItemSetting = {
  label: string;
  href: string;
};

export type FooterLinkSetting = {
  label: string;
  href: string;
};

export type ForestTypeSetting = {
  emoji: string;
  label: string;
  href: string;
};

export type ConceptCardSetting = {
  emoji: string;
  title: string;
  desc: string;
};

export type PageTextSetting = {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type SiteSettings = {
  navigation: {
    headerItems: NavItemSetting[];
    joinLabel: string;
    loginLabel: string;
    myPageLabel: string;
    logoutLabel: string;
  };
  footer: {
    links: FooterLinkSetting[];
    copyright: string;
  };
  home: {
    forestTypes: ForestTypeSetting[];
    ensembleCategories: Array<{
      sub: string;
      label: string;
      img: string;
      href: string;
    }>;
    ensembleActions: Array<{
      emoji: string;
      title: string;
      desc: string;
      href: string;
    }>;
  };
  concept: {
    examples: ConceptCardSetting[];
    ctaLabel: string;
    ctaHref: string;
  };
  pages: {
    ensembles: PageTextSetting;
    spots: PageTextSetting;
    reports: PageTextSetting;
    events: PageTextSetting;
  };
  map: {
    regions: Record<string, RegionInfo>;
  };
};

export const SITE_SETTINGS_DEFAULT: SiteSettings = {
  navigation: {
    headerItems: [
      { label: "●旅に出よう「様々な食べられる森をさがしに」", href: "/spots" },
      { label: "●「アンサンブル」イベントへの参加を選ぼう", href: "/ensembles" },
    ],
    joinLabel: "参加する",
    loginLabel: "ログイン",
    myPageLabel: "マイページ",
    logoutLabel: "ログアウト",
  },
  footer: {
    links: [
      { label: "プライバシーポリシー", href: "/privacy" },
      { label: "利用規約", href: "/terms" },
      { label: "運営会社", href: "/company" },
    ],
    copyright: "© 2024 アンサンブル倶楽部～食べられる森を目指して～",
  },
  home: {
    forestTypes: [
      { emoji: "🌊", label: "海の森", href: "/spots?type=sea" },
      { emoji: "🌵", label: "砂丘の森", href: "/spots?type=dune" },
      { emoji: "🏙️", label: "都市の森", href: "/spots?type=urban" },
      { emoji: "🐄", label: "牧の森", href: "/spots?type=farm" },
    ],
    ensembleCategories: [
      {
        sub: "農との協奏",
        label: "仕事に加わる協奏",
        img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80",
        href: "/join?type=farm",
      },
      {
        sub: "自然との協奏",
        label: "自然に働きかける協奏",
        img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
        href: "/join?type=nature",
      },
      {
        sub: "複数の身体との協奏",
        label: "触れ合う・食べる協奏",
        img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
        href: "/join?type=gather",
      },
      {
        sub: "空間世界との協奏",
        label: "空間・環境を生かす協奏",
        img: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&q=80",
        href: "/join?type=space",
      },
    ],
    ensembleActions: [
      {
        emoji: "🌿",
        title: "アンサンブルに参加",
        desc: "各地の食べられる森のイベントに参加してみましょう。まずは気になる地域から。",
        href: "/join",
      },
      {
        emoji: "🎪",
        title: "アンサンブルを主催したい",
        desc: "地域でイベントを開いてみたい方。企画のご相談から承ります。",
        href: "/contact?type=ensemble",
      },
      {
        emoji: "🏡",
        title: "拠点を登録・活用したい",
        desc: "宿や場所を拠点として登録したい・活用してほしい方はこちら。",
        href: "/contact?type=spot",
      },
    ],
  },
  concept: {
    examples: [
      { emoji: "🌊", title: "海の森", desc: "昆布を育てることは、海の森を育てること。漁師たちは魚や貝、海藻が共に生きる海の生態系そのものを耕しています。" },
      { emoji: "🏜️", title: "砂丘の森", desc: "一見なにもないように見える砂地にも、その土地ならではの食べられる植物と暮らしの知恵が根づいています。" },
      { emoji: "🏙️", title: "都市の森", desc: "屋上や路地、小さな庭。どんなに小さくても、都市のなかにも食べられる森はつくれます。" },
      { emoji: "🐄", title: "牧畜の森", desc: "家畜を育てることも、その土地の循環の一部。牧場の背景にも、食べていくための森があります。" },
    ],
    ctaLabel: "各地の食べられる森を見る →",
    ctaHref: "/ensembles",
  },
  pages: {
    ensembles: {
      eyebrow: "イベント",
      title: "アンサンブル一覧",
      description: "全国各地のローカルコミュニティ（LC）をご紹介します。",
      ctaLabel: "倶楽部に参加する →",
      ctaHref: "/join",
    },
    spots: {
      eyebrow: "拠点",
      title: "全国の宿泊施設・拠点",
      description: "アンサンブル倶楽部～食べられる森を目指して～の会員が運営する、全国各地の宿泊施設・拠点を紹介します。",
    },
    reports: {
      eyebrow: "REPORTS",
      title: "活動レポート",
      description: "各拠点での活動や、インターローカルな交流イベントの記録をテーマ別にご覧いただけます。",
    },
    events: {
      eyebrow: "イベント",
      title: "開催中のイベント",
      description: "全国の食べられる森で開催されるイベントの一覧です。",
    },
  },
  map: {
    regions: REGIONS,
  },
};
