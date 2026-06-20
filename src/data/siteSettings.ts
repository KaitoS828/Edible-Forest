import type { RegionInfo } from "@/components/JapanMap/mapData";
import { REGIONS } from "@/components/JapanMap/mapData";
import {
  HOME_CONCEPT_DEFAULT,
  FOREST_SECTION_TITLE_DEFAULT,
  ENSEMBLE_SECTION_TITLE_DEFAULT,
} from "@/data/homeContent";
import { LEGAL_DEFAULTS } from "@/data/legalContent";

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

export type HeroSlideSetting = {
  img: string;
  label: string;
  title: string;
  link: string;
  linkLabel: string;
};

// 規約・会社情報など、タイトル＋本文(HTML)で構成される文書ページ
export type DocPageSetting = {
  title: string;
  body: string;
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
    slides: HeroSlideSetting[];
    conceptTag: string;
    conceptTitle: string;
    conceptLinkLabel: string;
    forestSectionTitle: string;
    ensembleSectionTitle: string;
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
    title: string;
    body: string;
    examples: ConceptCardSetting[];
    ctaLabel: string;
    ctaHref: string;
  };
  legal: {
    privacy: DocPageSetting;
    terms: DocPageSetting;
    company: DocPageSetting;
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
    slides: [
      { img: "/carousel/aa.png", label: "広尾の森", title: "十勝の大地で、食べられる植物を育てる。", link: "/ensembles/hiroo", linkLabel: "詳しくみる" },
      { img: "/carousel/img_02.jpg", label: "アンサンブル倶楽部～食べられる森を目指して～", title: "自然界の仕組みが、新しい生き方を教えてくれる。", link: "/concept", linkLabel: "詳しくみる" },
      { img: "/carousel/image6.png", label: "全国各地のLC", title: "食べる・育てる・つながる。生活生産の喜びを各地で。", link: "/#events", linkLabel: "拠点を見る" },
      { img: "/carousel/image4.png", label: "インターローカル", title: "地域と都市をつなぐ、暮らしの実験場。", link: "/join", linkLabel: "参加する" },
      { img: "/carousel/image5.png", label: "四万十の森", title: "清流と共にある暮らしを、四万十川の流域で。", link: "/ensembles/shimanto", linkLabel: "詳しくみる" },
    ],
    conceptTag: HOME_CONCEPT_DEFAULT.tag,
    conceptTitle: HOME_CONCEPT_DEFAULT.title,
    conceptLinkLabel: HOME_CONCEPT_DEFAULT.linkLabel,
    forestSectionTitle: FOREST_SECTION_TITLE_DEFAULT,
    ensembleSectionTitle: ENSEMBLE_SECTION_TITLE_DEFAULT,
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
        href: "/ensembles",
      },
      {
        sub: "自然との協奏",
        label: "自然に働きかける協奏",
        img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
        href: "/ensembles",
      },
      {
        sub: "複数の身体との協奏",
        label: "触れ合う・食べる協奏",
        img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
        href: "/ensembles",
      },
      {
        sub: "空間世界との協奏",
        label: "空間・環境を生かす協奏",
        img: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&q=80",
        href: "/ensembles",
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
    title: "食べられる森とは",
    body: `<p>食べられる森とは、産業が生まれる以前から続く「食べていくための森」のことです。効率よく何かを大量生産する畑や養殖場とは違い、自然界の仕組みのなかで、人が暮らし、食べていける環境そのものを指します。</p><p>たとえば昆布漁。海で昆布を一生懸命に育てている人は、昆布だけを見ているわけではありません。魚や貝、ほかの海藻が共に育つ海の生態系を整えている——つまり「海の森」を育てているのです。</p><p>エビの養殖だけがうまくいけばいいと考え、まわりの海が死んでいくような営みは、食べられる森にはなりません。隣にあるものと一緒に豊かになっていく。それが、食べられる森の本来の姿です。</p><p>私たちは、各地の暮らしをこの同じ切り口で捉え直しています。地域だけで完結させるのではなく、海の森も、砂丘の森も、都市の小さな庭も、同じ「食べられる森」として並べて発信していく。そうすることで、これまでとは違う旅の形、人やものの移動が生まれてくると考えています。</p>`,
    examples: [
      { emoji: "🌊", title: "海の森", desc: "昆布を育てることは、海の森を育てること。漁師たちは魚や貝、海藻が共に生きる海の生態系そのものを耕しています。" },
      { emoji: "🏜️", title: "砂丘の森", desc: "一見なにもないように見える砂地にも、その土地ならではの食べられる植物と暮らしの知恵が根づいています。" },
      { emoji: "🏙️", title: "都市の森", desc: "屋上や路地、小さな庭。どんなに小さくても、都市のなかにも食べられる森はつくれます。" },
      { emoji: "🐄", title: "牧畜の森", desc: "家畜を育てることも、その土地の循環の一部。牧場の背景にも、食べていくための森があります。" },
    ],
    ctaLabel: "各地の食べられる森を見る →",
    ctaHref: "/ensembles",
  },
  legal: {
    privacy: { title: LEGAL_DEFAULTS.privacy.title, body: LEGAL_DEFAULTS.privacy.body },
    terms: { title: LEGAL_DEFAULTS.terms.title, body: LEGAL_DEFAULTS.terms.body },
    company: { title: LEGAL_DEFAULTS.company.title, body: LEGAL_DEFAULTS.company.body },
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
    slides: [
      { img: "/carousel/aa.png", label: "Hiroo Forest", title: "Growing edible plants on the vast land of Tokachi.", link: "/ensembles/hiroo?lang=en", linkLabel: "Learn more" },
      { img: "/carousel/img_02.jpg", label: "Edible Forest Ensemble Club", title: "Natural systems can teach us new ways of living.", link: "/concept?lang=en", linkLabel: "Learn more" },
      { img: "/carousel/image6.png", label: "Local communities nationwide", title: "Eat, grow, and connect — the joy of living production, everywhere.", link: "/#events", linkLabel: "See places" },
      { img: "/carousel/image4.png", label: "Inter-local", title: "A living laboratory connecting regions and cities.", link: "/join?lang=en", linkLabel: "Join" },
      { img: "/carousel/image5.png", label: "Shimanto Forest", title: "Living alongside clear streams in the Shimanto basin.", link: "/ensembles/shimanto?lang=en", linkLabel: "Learn more" },
    ],
    conceptTag: "Living with natural systems",
    conceptTitle: "Living in harmony with natural systems",
    conceptLinkLabel: "Learn more",
    forestSectionTitle: "Travel to discover many kinds of edible forests",
    ensembleSectionTitle: "Choose an ensemble event to join",
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
        href: "/ensembles?lang=en",
      },
      {
        sub: "With Nature",
        label: "Care for Living Landscapes",
        img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
        href: "/ensembles?lang=en",
      },
      {
        sub: "With Many Bodies",
        label: "Gather, Touch, and Taste",
        img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
        href: "/ensembles?lang=en",
      },
      {
        sub: "With Places",
        label: "Make Use of Space and Ecology",
        img: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&q=80",
        href: "/ensembles?lang=en",
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
    title: "What Is an Edible Forest?",
    body: `<p>An edible forest is not only a place where food grows. It is a living landscape where people, plants, animals, water, soil, and local knowledge support one another.</p><p>Take kelp fishing. Someone growing kelp in the sea is not looking at kelp alone — they tend the whole ecosystem where fish, shellfish, and other seaweed grow together. In other words, they are cultivating a "sea forest."</p><p>Across Japan we look at local life through the same lens: sea forests, dune forests, and small city gardens are all framed together as edible forests. From there, new forms of travel and new movements of people and goods can emerge.</p>`,
    examples: [
      { emoji: "🌊", title: "Sea Forests", desc: "Growing kelp can also mean cultivating a sea forest: a living ecosystem where fish, shellfish, and seaweed thrive together." },
      { emoji: "🏜️", title: "Dune Forests", desc: "Even sandy landscapes that seem empty can hold edible plants, local knowledge, and ways of living with the land." },
      { emoji: "🏙️", title: "Urban Forests", desc: "Rooftops, alleys, small gardens, and shared yards can all become small edible forests within the city." },
      { emoji: "🐄", title: "Pasture Forests", desc: "Raising animals can also be part of a local cycle. Behind every pasture is a landscape that supports life and food." },
    ],
    ctaLabel: "Explore Edible Forests",
    ctaHref: "/ensembles?lang=en",
  },
  legal: {
    privacy: {
      title: "Privacy Policy",
      body: `<p>The Edible Forest Ensemble Club ("the Club") handles the personal information of members and users with care, in accordance with this Privacy Policy.</p><h2>1. Information We Collect</h2><p>We collect information you provide during membership registration or inquiries, such as your name, email address, address, and phone number.</p><h2>2. Purpose of Use</h2><ul><li>Providing and operating membership services</li><li>Sending event and program information</li><li>Responding to inquiries</li><li>Analysis to improve our services</li></ul><h2>3. Disclosure to Third Parties</h2><p>We do not provide personal information to third parties without consent, except as required by law.</p><h2>4. Disclosure, Correction, and Deletion</h2><p>Upon request, we will respond to disclosure, correction, or deletion of personal information within a reasonable scope.</p><h2>5. Contact</h2><p>For questions about this policy, please contact us through the inquiry form.</p>`,
    },
    terms: {
      title: "Terms of Service",
      body: `<p>These Terms of Service ("Terms") set out the conditions for using the services ("the Service") provided by the Edible Forest Ensemble Club ("the Club").</p><h2>1. Application</h2><p>These Terms apply to all relationships between users and the Club regarding the Service.</p><h2>2. Registration</h2><p>Registration is complete when an applicant applies in the manner prescribed by the Club and the Club approves it.</p><h2>3. Prohibited Conduct</h2><ul><li>Acts that violate laws or public order</li><li>Acts that infringe the rights of the Club or third parties</li><li>Acts that interfere with the operation of the Service</li></ul><h2>4. Disclaimer</h2><p>Except in cases of willful misconduct or gross negligence by the Club, the Club is not liable for damages arising from the Service.</p><h2>5. Changes</h2><p>The Club may change these Terms without prior notice when deemed necessary.</p><h2>6. Governing Law</h2><p>These Terms are governed by the laws of Japan.</p>`,
    },
    company: {
      title: "Company",
      body: `<h2>Operator</h2><p>Edible Forest Ensemble Club</p><h2>Address</h2><p>(Please fill in.)</p><h2>Representative</h2><p>(Please fill in.)</p><h2>Activities</h2><ul><li>Operating a membership community</li><li>Planning and running local bases and events</li><li>Sharing information about edible forests</li></ul><h2>Contact</h2><p>Please contact us through the inquiry form.</p>`,
    },
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
