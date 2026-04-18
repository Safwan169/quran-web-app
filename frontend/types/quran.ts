export type SurahType = "meccan" | "medinan";
export type ArabicFontOption = "amiri" | "scheherazade";

export interface Verse {
  id: number;
  text: string;
  translation: string;
}

export interface Surah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: SurahType;
  total_verses: number;
  verses: Verse[];
}

export interface SearchResult {
  surahId: number;
  surahName: string;
  verseId: number;
  arabicText: string;
  translation: string;
}

export interface QuranSettings {
  arabicFont: ArabicFontOption;
  arabicFontSize: number;
  translationFontSize: number;
}
