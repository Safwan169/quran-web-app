"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { QuranSettings } from "@/types/quran";

const STORAGE_KEY = "quran-settings";

const defaultSettings: QuranSettings = {
  arabicFont: "amiri",
  arabicFontSize: 28,
  translationFontSize: 16,
};

interface SettingsContextValue {
  settings: QuranSettings;
  updateSettings: (nextSettings: Partial<QuranSettings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);

function normalizeSettings(value: unknown): QuranSettings {
  if (!value || typeof value !== "object") {
    return defaultSettings;
  }

  const maybeSettings = value as Partial<QuranSettings>;

  return {
    arabicFont:
      maybeSettings.arabicFont === "scheherazade" ? "scheherazade" : "amiri",
    arabicFontSize:
      typeof maybeSettings.arabicFontSize === "number"
        ? Math.min(48, Math.max(20, maybeSettings.arabicFontSize))
        : defaultSettings.arabicFontSize,
    translationFontSize:
      typeof maybeSettings.translationFontSize === "number"
        ? Math.min(24, Math.max(12, maybeSettings.translationFontSize))
        : defaultSettings.translationFontSize,
  };
}

function applySettingsToDocument(settings: QuranSettings): void {
  document.documentElement.dataset.arabicFont = settings.arabicFont;
  document.documentElement.style.setProperty(
    "--arabic-font-size",
    `${settings.arabicFontSize}px`,
  );
  document.documentElement.style.setProperty(
    "--translation-font-size",
    `${settings.translationFontSize}px`,
  );
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<QuranSettings>(defaultSettings);
  const hasLoadedFromStorage = useRef(false);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      const parsed = storedValue ? JSON.parse(storedValue) : null;
      const normalized = normalizeSettings(parsed);
      setSettings(normalized);
      applySettingsToDocument(normalized);
    } catch {
      setSettings(defaultSettings);
      applySettingsToDocument(defaultSettings);
    } finally {
      hasLoadedFromStorage.current = true;
    }
  }, []);

  useEffect(() => {
    applySettingsToDocument(settings);

    if (!hasLoadedFromStorage.current) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage failures (private mode/quota) and keep UI responsive.
    }
  }, [settings]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      updateSettings: (nextSettings) => {
        setSettings((prev) => normalizeSettings({ ...prev, ...nextSettings }));
      },
    }),
    [settings],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider.");
  }

  return context;
}
