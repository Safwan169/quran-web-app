"use client";

import { useSettings } from "@/contexts/SettingsContext";

export default function SettingsPanel() {
  const { settings, updateSettings } = useSettings();

  return (
    <section className="rounded-xl border border-border bg-black/30 p-4">
      <h3 className="font-heading text-lg text-textPrimary">Settings</h3>
      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-sm text-textMuted">Arabic Font</label>
          <select
            value={settings.arabicFont}
            onChange={(event) =>
              updateSettings({
                arabicFont: event.target.value as "amiri" | "scheherazade",
              })
            }
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-textPrimary outline-none transition focus:border-primary"
          >
            <option value="amiri">Amiri</option>
            <option value="scheherazade">Scheherazade New</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-textMuted">
            Arabic Font Size ({settings.arabicFontSize}px)
          </label>
          <input
            type="range"
            min={20}
            max={48}
            step={1}
            value={settings.arabicFontSize}
            onChange={(event) =>
              updateSettings({
                arabicFontSize: Number(event.target.value),
              })
            }
            aria-label="Arabic font size"
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-textMuted">
            Translation Font Size ({settings.translationFontSize}px)
          </label>
          <input
            type="range"
            min={12}
            max={24}
            step={1}
            value={settings.translationFontSize}
            onChange={(event) =>
              updateSettings({
                translationFontSize: Number(event.target.value),
              })
            }
            aria-label="Translation font size"
            className="w-full accent-primary"
          />
        </div>
      </div>
    </section>
  );
}

