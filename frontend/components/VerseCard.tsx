import type { Verse } from "@/types/quran";

interface VerseCardProps {
  verse: Verse;
}

export default function VerseCard({ verse }: VerseCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="mb-4 flex items-center">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">
          {verse.id}
        </span>
      </div>

      <p
        dir="rtl"
        className="arabic-font-dynamic mb-6 text-right leading-[2] text-arabic arabic-size-dynamic"
      >
        {verse.text}
      </p>

      <div className="mb-5 h-px w-full bg-border" />

      <p className="leading-8 text-textPrimary translation-size-dynamic">
        {verse.translation}
      </p>
    </article>
  );
}
