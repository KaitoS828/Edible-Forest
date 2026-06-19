// トップページの編集可能テキスト（CMS pages.top で上書き可能なデフォルト値）

export type HomeConcept = {
  tag: string;
  title: string;
  linkLabel: string;
};

export const HOME_CONCEPT_DEFAULT: HomeConcept = {
  tag: "奪うのではなく、調和する",
  title: "「心地よい暮らし」\n始めませんか？",
  linkLabel: "詳しく見る →",
};

export const FOREST_SECTION_TITLE_DEFAULT = "●旅に出よう「様々な食べられる森をさがしに」宿泊予約まで";
export const ENSEMBLE_SECTION_TITLE_DEFAULT = "●「アンサンブル」イベントへの参加を選ぼう";
