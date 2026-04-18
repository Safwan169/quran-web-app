import type { Metadata } from "next";
import HomeSurahGrid from "@/components/HomeSurahGrid";
import { getSurahs } from "@/lib/api";
import type { Surah } from "@/types/quran";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Browse all 114 surahs with an elegant Quran reader interface and personalized settings.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const surahs = (await getSurahs()) as Omit<Surah, "verses">[];

  return (
    <div>
      <section className="rounded-2xl border border-primary/25 bg-card/80 px-6 py-10 text-center md:px-10 md:py-14">
        <p
          dir="rtl"
          className="arabic-font-dynamic arabic-size-dynamic mb-6 leading-[2.1] text-primary"
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        <p className="translation-size-dynamic mx-auto max-w-3xl text-textMuted">
          In the name of Allah, the Most Gracious, the Most Merciful
        </p>
      </section>

      <HomeSurahGrid surahs={surahs} />
    </div>
  );
}
