import type { CmsSlide } from "@/lib/firestore";
import {
  HOME_CONCEPT_DEFAULT,
  FOREST_SECTION_TITLE_DEFAULT,
  ENSEMBLE_SECTION_TITLE_DEFAULT,
} from "@/data/homeContent";
import type { SiteLocale } from "@/data/siteSettings";

type SlideForm = {
  fieldId: string;
  imageUrl: string;
  label: string;
  title: string;
  link: string;
  linkLabel: string;
};

export type CmsPageFormData = {
  heroTitle: string;
  heroCaption: string;
  body: string;
  conceptTag: string;
  conceptTitle: string;
  conceptLinkLabel: string;
  forestSectionTitle: string;
  ensembleSectionTitle: string;
  slides: SlideForm[];
  active: boolean;
};

function toSlideForm(slide: CmsSlide, index: number): SlideForm {
  return {
    fieldId: slide.fieldId || String(index),
    imageUrl: slide.image?.url ?? "",
    label: slide.label ?? "",
    title: slide.title ?? "",
    link: slide.link ?? "",
    linkLabel: slide.linkLabel ?? "",
  };
}

export function buildPageInitialData(
  pageId: string,
  data?: {
    heroTitle?: string;
    heroCaption?: string;
    body?: string;
    conceptTag?: string;
    conceptTitle?: string;
    conceptLinkLabel?: string;
    forestSectionTitle?: string;
    ensembleSectionTitle?: string;
    slides?: CmsSlide[];
    active?: boolean;
  },
  locale: SiteLocale = "ja"
): CmsPageFormData {
  // top ページは未設定時に現在のサイト表示テキストをデフォルト表示する
  const isTop = pageId === "top";
  const isEn = locale === "en";
  const enConceptTitle = "Living in harmony with natural systems";
  const enConceptBody = `<p>An edible forest is not only a place where food grows. It is a living landscape where people, plants, animals, water, soil, and local knowledge support one another.</p><p>Across Japan, we look at seas, dunes, cities, pastures, gardens, and lodging places through the same lens: how can a place help people live while enriching the ecosystem around it?</p><p>The Edible Forest Ensemble Club connects these local experiments and invites people to visit, learn, host, and take part.</p>`;

  return {
    heroTitle: data?.heroTitle ?? (isEn && !isTop ? "What Is an Edible Forest?" : ""),
    heroCaption: data?.heroCaption ?? (isEn && !isTop ? "A way of seeing food, ecology, and local life as one living system." : ""),
    body: data?.body ?? (isEn && !isTop ? enConceptBody : ""),
    conceptTag: data?.conceptTag || (isTop ? (isEn ? "Living with natural systems" : HOME_CONCEPT_DEFAULT.tag) : ""),
    conceptTitle: data?.conceptTitle || (isTop ? (isEn ? enConceptTitle : HOME_CONCEPT_DEFAULT.title) : ""),
    conceptLinkLabel: data?.conceptLinkLabel || (isTop ? (isEn ? "Learn more" : HOME_CONCEPT_DEFAULT.linkLabel) : ""),
    forestSectionTitle: data?.forestSectionTitle || (isTop ? (isEn ? "Travel to discover many kinds of edible forests" : FOREST_SECTION_TITLE_DEFAULT) : ""),
    ensembleSectionTitle: data?.ensembleSectionTitle || (isTop ? (isEn ? "Choose an ensemble event to join" : ENSEMBLE_SECTION_TITLE_DEFAULT) : ""),
    slides: data?.slides?.map(toSlideForm) ?? [],
    active: data?.active ?? true,
  };
}

export type { SlideForm };
