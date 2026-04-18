import type { SearchResult, Surah } from "@/types/quran";

type NextRequestInit = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function fetchApi<T>(path: string, init?: NextRequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status}): ${path}`);
  }

  return (await response.json()) as T;
}

export function getSurahs(): Promise<Surah[]> {
  return fetchApi<Surah[]>("/api/surahs", {
    cache: "force-cache",
    next: { revalidate: false },
  });
}

export function getSurah(id: number): Promise<Surah> {
  return fetchApi<Surah>(`/api/surah/${id}`, {
    cache: "force-cache",
    next: { revalidate: false },
  });
}

export function searchAyahs(query: string): Promise<SearchResult[]> {
  const trimmed = query.trim();

  if (trimmed.length < 3) {
    return Promise.resolve([]);
  }

  return fetchApi<SearchResult[]>(`/api/search?q=${encodeURIComponent(trimmed)}`, {
    cache: "no-store",
  });
}
