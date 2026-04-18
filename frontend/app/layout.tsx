import type { Metadata } from "next";
import {
  Amiri,
  Lato,
  Playfair_Display,
  Scheherazade_New,
} from "next/font/google";
import PageTransition from "@/components/PageTransition";
import Sidebar from "@/components/Sidebar";
import { SettingsProvider } from "@/contexts/SettingsContext";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

const scheherazade = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-scheherazade",
});

const bootstrapSettingsScript = `
  (function () {
    try {
      var stored = localStorage.getItem("quran-settings");
      if (!stored) return;
      var parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== "object") return;

      if (parsed.arabicFont === "amiri" || parsed.arabicFont === "scheherazade") {
        document.documentElement.dataset.arabicFont = parsed.arabicFont;
      }

      if (typeof parsed.arabicFontSize === "number") {
        document.documentElement.style.setProperty("--arabic-font-size", parsed.arabicFontSize + "px");
      }

      if (typeof parsed.translationFontSize === "number") {
        document.documentElement.style.setProperty("--translation-font-size", parsed.translationFontSize + "px");
      }
    } catch (error) {}
  })();
`;

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Al-Quran | The Holy Quran",
    template: "%s | Al-Quran",
  },
  description:
    "An elegant Quran web application with Surah browsing, verse reading, and translation search.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrapSettingsScript }} />
      </head>
      <body
        className={`${lato.variable} ${playfair.variable} ${amiri.variable} ${scheherazade.variable}`}
      >
        <SettingsProvider>
          <Sidebar />
          <div className="md:pl-[280px]">
            <main className="min-h-screen px-4 pb-10 pt-20 md:px-10 md:pt-10">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </SettingsProvider>
      </body>
    </html>
  );
}
