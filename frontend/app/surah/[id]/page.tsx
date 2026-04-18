import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VerseCard from "@/components/VerseCard";
import { getSurah } from "@/lib/api";
import type { Surah } from "@/types/quran";

interface SurahPageProps {
  params: {
    id: string;
  };
}

function parseSurahId(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 114) {
    return null;
  }
  return parsed;
}

export async function generateMetadata({
  params,
}: SurahPageProps): Promise<Metadata> {
  const surahId = parseSurahId(params.id);

  if (!surahId) {
    return {
      title: "Surah Not Found",
    };
  }

  try {
    const surah = await getSurah(surahId);

    return {
      title: `${surah.transliteration} (${surah.id})`,
      description: `${surah.translation} (${surah.type}) with all verses and translation.`,
    };
  } catch {
    return {
      title: "Surah Not Found",
    };
  }
}

export const dynamic = "force-dynamic";

export default async function SurahPage({ params }: SurahPageProps) {
  const surahId = parseSurahId(params.id);

  if (!surahId) {
    notFound();
  }

  let surah: Surah;
  try {
    surah = await getSurah(surahId);
  } catch {
    notFound();
  }

  const previousSurahId = surah.id > 1 ? surah.id - 1 : null;
  const nextSurahId = surah.id < 114 ? surah.id + 1 : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-textPrimary transition hover:border-primary"
        >
          Back to Surah List
        </Link>
      </div>

      <header className="rounded-2xl border border-border bg-card px-5 py-6 md:px-8 md:py-8">
        <p className="mb-2 text-sm text-primary">Surah {surah.id}</p>
        <h1
          dir="rtl"
          className="arabic-font-dynamic mb-3 text-right text-4xl leading-[2] text-arabic md:text-5xl"
        >
          {surah.name}
        </h1>
        <h2 className="font-heading text-2xl text-textPrimary md:text-3xl">
          {surah.translation}
        </h2>
        <p className="mt-2 text-textMuted">
          {surah.transliteration} - {surah.total_verses} verses -{" "}
          {surah.type.charAt(0).toUpperCase() + surah.type.slice(1)}
        </p>
      </header>

      {surah.id !== 9 ? (
        <section className="rounded-2xl border border-primary/30 bg-primary/10 px-5 py-6 text-center">
          <p dir="rtl" className="arabic-font-dynamic text-3xl text-primary md:text-4xl">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
        </section>
      ) : null}

      <section className="space-y-4">
        {surah.verses.map((verse) => (
          <VerseCard key={verse.id} verse={verse} />
        ))}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        {previousSurahId ? (
          <Link
            href={`/surah/${previousSurahId}`}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-textPrimary transition hover:border-primary"
          >
            Previous Surah
          </Link>
        ) : (
          <span />
        )}
        {nextSurahId ? (
          <Link
            href={`/surah/${nextSurahId}`}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-textPrimary transition hover:border-primary"
          >
            Next Surah
          </Link>
        ) : null}
      </div>
    </div>
  );
}
