import type { CmsSlide } from "@/lib/firestore";
import {
  HOME_CONCEPT_DEFAULT,
  FOREST_SECTION_TITLE_DEFAULT,
  ENSEMBLE_SECTION_TITLE_DEFAULT,
} from "@/data/homeContent";

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
  }
): CmsPageFormData {
  // top ページは未設定時に現在のサイト表示テキストをデフォルト表示する
  const isTop = pageId === "top";
  return {
    heroTitle: data?.heroTitle ?? "",
    heroCaption: data?.heroCaption ?? "",
    body: data?.body ?? "",
    conceptTag: data?.conceptTag || (isTop ? HOME_CONCEPT_DEFAULT.tag : ""),
    conceptTitle: data?.conceptTitle || (isTop ? HOME_CONCEPT_DEFAULT.title : ""),
    conceptLinkLabel: data?.conceptLinkLabel || (isTop ? HOME_CONCEPT_DEFAULT.linkLabel : ""),
    forestSectionTitle: data?.forestSectionTitle || (isTop ? FOREST_SECTION_TITLE_DEFAULT : ""),
    ensembleSectionTitle: data?.ensembleSectionTitle || (isTop ? ENSEMBLE_SECTION_TITLE_DEFAULT : ""),
    slides: data?.slides?.map(toSlideForm) ?? [],
    active: data?.active ?? true,
  };
}

export type { SlideForm };
