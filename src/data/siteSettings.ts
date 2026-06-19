import type { RegionInfo } from "@/components/JapanMap/mapData";
import { REGIONS } from "@/components/JapanMap/mapData";

export type NavItemSetting = {
  label: string;
  href: string;
};

export type SiteLocale = "ja" | "en";

export type ExternalLinkSetting = {
  label: string;
  href?: string;
  icon?: "note" | "facebook" | "x" | "link";
};

export type LanguageLinkSetting = {
  label: string;
  shortLabel: string;
  href?: string;
  active?: boolean;
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
    externalLinks?: ExternalLinkSetting[];
    languageLinks?: LanguageLinkSetting[];
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
    externalLinks: [
      { label: "note", href: "https://note.com/exergy_foresters", icon: "note" },
      { label: "Facebook", icon: "facebook" },
      { label: "X", icon: "x" },
    ],
    languageLinks: [
      { label: "日本語", shortLabel: "JP", href: "/?lang=ja", active: true },
      { label: "English", shortLabel: "EN", href: "/?lang=en" },
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

export const SITE_SETTINGS_EN_DEFAULT: SiteSettings = {
  ...SITE_SETTINGS_DEFAULT,
  navigation: {
    ...SITE_SETTINGS_DEFAULT.navigation,
    headerItems: [
      { label: "Find Edible Forests", href: "/spots?lang=en" },
      { label: "Join Ensemble Events", href: "/ensembles?lang=en" },
    ],
    languageLinks: [
      { label: "Japanese", shortLabel: "JP", href: "/?lang=ja" },
      { label: "English", shortLabel: "EN", href: "/?lang=en", active: true },
    ],
    joinLabel: "Join",
    loginLabel: "Login",
    myPageLabel: "My Page",
    logoutLabel: "Logout",
  },
  footer: {
    ...SITE_SETTINGS_DEFAULT.footer,
    links: [
      { label: "Privacy Policy", href: "/privacy?lang=en" },
      { label: "Terms", href: "/terms?lang=en" },
      { label: "Company", href: "/company?lang=en" },
    ],
    copyright: "© 2024 Edible Forest Ensemble Club",
  },
  home: {
    forestTypes: [
      { emoji: "🌊", label: "Sea Forests", href: "/spots?type=sea&lang=en" },
      { emoji: "🌵", label: "Dune Forests", href: "/spots?type=dune&lang=en" },
      { emoji: "🏙️", label: "Urban Forests", href: "/spots?type=urban&lang=en" },
      { emoji: "🐄", label: "Pasture Forests", href: "/spots?type=farm&lang=en" },
    ],
    ensembleCategories: [
      {
        sub: "With Agriculture",
        label: "Join the Work",
        img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80",
        href: "/join?type=farm&lang=en",
      },
      {
        sub: "With Nature",
        label: "Care for Living Landscapes",
        img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
        href: "/join?type=nature&lang=en",
      },
      {
        sub: "With Many Bodies",
        label: "Gather, Touch, and Taste",
        img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
        href: "/join?type=gather&lang=en",
      },
      {
        sub: "With Places",
        label: "Make Use of Space and Ecology",
        img: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&q=80",
        href: "/join?type=space&lang=en",
      },
    ],
    ensembleActions: [
      {
        emoji: "🌿",
        title: "Join an Ensemble",
        desc: "Take part in programs hosted by edible forests across Japan. Start from a region that speaks to you.",
        href: "/join?lang=en",
      },
      {
        emoji: "🎪",
        title: "Host an Ensemble",
        desc: "For people who want to organize local programs. We can help shape the first plan together.",
        href: "/contact?type=ensemble&lang=en",
      },
      {
        emoji: "🏡",
        title: "Register a Place",
        desc: "For hosts who want to register or make use of lodging, gardens, farms, or local bases.",
        href: "/contact?type=spot&lang=en",
      },
    ],
  },
  concept: {
    examples: [
      { emoji: "🌊", title: "Sea Forests", desc: "Growing kelp can also mean cultivating a sea forest: a living ecosystem where fish, shellfish, and seaweed thrive together." },
      { emoji: "🏜️", title: "Dune Forests", desc: "Even sandy landscapes that seem empty can hold edible plants, local knowledge, and ways of living with the land." },
      { emoji: "🏙️", title: "Urban Forests", desc: "Rooftops, alleys, small gardens, and shared yards can all become small edible forests within the city." },
      { emoji: "🐄", title: "Pasture Forests", desc: "Raising animals can also be part of a local cycle. Behind every pasture is a landscape that supports life and food." },
    ],
    ctaLabel: "Explore Edible Forests",
    ctaHref: "/ensembles?lang=en",
  },
  pages: {
    ensembles: {
      eyebrow: "Events",
      title: "Ensembles",
      description: "Explore local communities and ensemble programs across Japan.",
      ctaLabel: "Join the Club",
      ctaHref: "/join?lang=en",
    },
    spots: {
      eyebrow: "Places",
      title: "Places to Stay",
      description: "Lodging facilities and local bases operated by members of the Edible Forest Ensemble Club.",
    },
    reports: {
      eyebrow: "Reports",
      title: "Activity Reports",
      description: "Read stories from local bases, exchanges, and experiments across the network.",
    },
    events: {
      eyebrow: "Events",
      title: "Upcoming Events",
      description: "A list of events hosted across edible forests and local communities.",
    },
  },
};
