"use client";

import { useMemo, useState } from "react";
import SurahCard from "@/components/SurahCard";
import type { Surah } from "@/types/quran";

interface HomeSurahGridProps {
  surahs: Omit<Surah, "verses">[];
}

export default function HomeSurahGrid({ surahs }: HomeSurahGridProps) {
  const [query, setQuery] = useState("");

  const filteredSurahs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return surahs;
    }

    return surahs.filter((surah) =>
      [surah.name, surah.transliteration, surah.translation]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, surahs]);

  return (
    <section className="mt-10">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="w-full md:max-w-xl">
          <span className="mb-2 block text-sm text-textMuted">Filter surahs</span>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by Arabic name, transliteration, or translation..."
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-textPrimary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
        </label>
        <p className="text-sm text-textMuted">
          Showing {filteredSurahs.length} of {surahs.length} surahs
        </p>
      </div>

      {filteredSurahs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSurahs.map((surah) => (
            <SurahCard key={surah.id} surah={surah} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-textMuted">
          No surahs matched your filter.
        </div>
      )}
    </section>
  );
}
