import type { CmsSlide } from "@/lib/firestore";

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
  conceptLinkLabel: string;
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

export function buildPageInitialData(data?: {
  heroTitle?: string;
  heroCaption?: string;
  body?: string;
  conceptTag?: string;
  conceptLinkLabel?: string;
  slides?: CmsSlide[];
  active?: boolean;
}): CmsPageFormData {
  return {
    heroTitle: data?.heroTitle ?? "",
    heroCaption: data?.heroCaption ?? "",
    body: data?.body ?? "",
    conceptTag: data?.conceptTag ?? "",
    conceptLinkLabel: data?.conceptLinkLabel ?? "",
    slides: data?.slides?.map(toSlideForm) ?? [],
    active: data?.active ?? true,
  };
}

export type { SlideForm };
