"use client";

import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import SearchBar from "@/components/SearchBar";
import { searchAyahs } from "@/lib/api";
import type { SearchResult } from "@/types/quran";

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const chunks = useMemo(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 3) {
      return [text];
    }

    const regex = new RegExp(`(${escapeRegExp(normalizedQuery)})`, "gi");
    return text.split(regex);
  }, [query, text]);

  const lowerQuery = query.toLowerCase();

  return (
    <>
      {chunks.map((chunk, index) => {
        const isMatch = chunk.toLowerCase() === lowerQuery;

        if (!isMatch) {
          return <span key={`${chunk}-${index}`}>{chunk}</span>;
        }

        return (
          <mark
            key={`${chunk}-${index}`}
            className="rounded bg-primary/20 px-1 text-primary"
          >
            {chunk}
          </mark>
        );
      })}
    </>
  );
}

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const activeQuery = debouncedQuery.trim();

    if (activeQuery.length < 3) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchAyahs(activeQuery)
      .then((response) => {
        setResults(response);
        setHasSearched(true);
      })
      .catch((error: unknown) => {
        if ((error as Error).name !== "AbortError") {
          setResults([]);
          setHasSearched(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [debouncedQuery]);

  return (
    <section className="space-y-6">
      <SearchBar value={query} onChange={setQuery} />

      {query.trim().length < 3 ? (
        <div className="rounded-xl border border-border bg-card p-5 text-sm text-textMuted">
          Type at least 3 characters to search.
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 text-textMuted">
          <LoadingSpinner className="h-6 w-6" />
          Searching Quran translation...
        </div>
      ) : null}

      {!isLoading && hasSearched ? (
        <p className="text-sm text-textMuted">Total results: {results.length}</p>
      ) : null}

      {!isLoading && hasSearched && results.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-6 w-6"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.65" y1="16.65" x2="21" y2="21" />
            </svg>
          </div>
          <p className="text-textMuted">No results found.</p>
        </div>
      ) : null}

      {!isLoading && results.length > 0 ? (
        <div className="space-y-4">
          {results.map((result) => (
            <article
              key={`${result.surahId}-${result.verseId}`}
              className="rounded-xl border border-border bg-card p-5"
            >
              <p className="mb-3 text-sm text-primary">
                {result.surahName} - Verse {result.verseId}
              </p>
              <p
                dir="rtl"
                className="arabic-font-dynamic arabic-size-dynamic mb-4 text-right leading-[2] text-arabic"
              >
                {result.arabicText}
              </p>
              <p className="translation-size-dynamic leading-8 text-textPrimary">
                <HighlightedText text={result.translation} query={debouncedQuery} />
              </p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
