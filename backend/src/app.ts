import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import rawQuranData from "../data/quran.json";
import type { SearchResult, Surah, SurahSummary } from "./types";

type ImportedQuranData = Surah[] | { default?: Surah[] };

function resolveQuranData(source: ImportedQuranData): {
  data: Surah[];
  error: string | null;
} {
  const normalizedSource =
    !Array.isArray(source) && source && typeof source === "object" && "default" in source
      ? source.default
      : source;

  if (!Array.isArray(normalizedSource)) {
    return {
      data: [],
      error:
        "Quran data failed to load: invalid JSON import shape. Check deployment bundling for data/quran.json.",
    };
  }

  if (normalizedSource.length !== 114) {
    return {
      data: [],
      error: "Invalid Quran data. Expected backend/data/quran.json to contain 114 surahs.",
    };
  }

  return {
    data: normalizedSource,
    error: null,
  };
}

const { data: quranData, error: quranDataLoadError } = resolveQuranData(
  rawQuranData as ImportedQuranData,
);

function getQuranDataOrThrow(): Surah[] {
  if (quranDataLoadError) {
    throw new HTTPException(500, {
      message: quranDataLoadError,
    });
  }

  return quranData;
}

const app = new Hono();

app.get("/", (c) =>
  c.json({
    message: "Quran API is running.",
  }),
);

app.use("/api/*", cors({ origin: "*" }));

app.get("/api/health", (c) =>
  c.json({
    ok: true,
    service: "quran-api",
  }),
);

app.get("/api/surahs", (c) => {
  const surahSummaries: SurahSummary[] = getQuranDataOrThrow().map((surah) => ({
    id: surah.id,
    name: surah.name,
    transliteration: surah.transliteration,
    translation: surah.translation,
    total_verses: surah.total_verses,
    type: surah.type,
  }));

  return c.json(surahSummaries);
});

app.get("/api/surah/:id", (c) => {
  const data = getQuranDataOrThrow();
  const rawId = c.req.param("id");
  const surahId = Number(rawId);

  if (!Number.isInteger(surahId) || surahId < 1 || surahId > 114) {
    throw new HTTPException(400, {
      message: "Invalid surah id. Please provide an integer between 1 and 114.",
    });
  }

  const surah = data.find((entry) => entry.id === surahId);

  if (!surah) {
    throw new HTTPException(404, { message: `Surah ${surahId} not found.` });
  }

  return c.json(surah);
});

app.get("/api/search", (c) => {
  const data = getQuranDataOrThrow();
  const query = c.req.query("q")?.trim() ?? "";

  if (query.length < 3) {
    return c.json([]);
  }

  const normalizedQuery = query.toLowerCase();
  const matches: SearchResult[] = [];

  for (const surah of data) {
    for (const verse of surah.verses) {
      if (!verse.translation.toLowerCase().includes(normalizedQuery)) {
        continue;
      }

      matches.push({
        surahId: surah.id,
        surahName: surah.transliteration,
        verseId: verse.id,
        arabicText: verse.text,
        translation: verse.translation,
      });

      if (matches.length >= 50) {
        return c.json(matches);
      }
    }
  }

  return c.json(matches);
});

app.notFound((c) => c.json({ message: "Route not found." }, 404));

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  }

  console.error("Unhandled error:", err);
  return c.json({ message: "Internal server error." }, 500);
});

export default app;
