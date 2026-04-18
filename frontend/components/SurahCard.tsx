import Link from "next/link";
import type { Surah } from "@/types/quran";

interface SurahCardProps {
  surah: Omit<Surah, "verses">;
}

function toTitleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export default function SurahCard({ surah }: SurahCardProps) {
  return (
    <Link
      href={`/surah/${surah.id}`}
      className="group block rounded-2xl border border-border bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg hover:shadow-black/30"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {surah.id}
        </span>
        <span className="rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs uppercase tracking-wide text-secondary">
          {toTitleCase(surah.type)}
        </span>
      </div>

      <h3
        dir="rtl"
        className="arabic-font-dynamic mb-2 text-right text-3xl leading-relaxed text-arabic"
      >
        {surah.name}
      </h3>

      <h4 className="font-heading text-xl text-textPrimary">{surah.translation}</h4>
      <p className="mt-1 text-sm text-textMuted">{surah.transliteration}</p>

      <div className="mt-4 border-t border-border pt-3 text-sm text-textMuted">
        {surah.total_verses} verses
      </div>
    </Link>
  );
}
