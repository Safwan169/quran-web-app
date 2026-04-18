import type { Metadata } from "next";
import SearchClient from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Quran verses by English translation text.",
};

export default function SearchPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-heading text-3xl text-textPrimary md:text-4xl">
          Search Ayahs
        </h1>
        <p className="mt-2 text-textMuted">
          Find verses by searching translation text across the entire Quran.
        </p>
      </header>

      <SearchClient />
    </div>
  );
}
