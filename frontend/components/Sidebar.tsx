"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SettingsPanel from "@/components/SettingsPanel";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
];

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex items-center justify-center rounded-md border border-border bg-card p-2 text-textPrimary md:hidden"
        aria-label="Open sidebar menu"
      >
        <span className="block h-0.5 w-5 bg-textPrimary" />
        <span className="ml-0 mt-1 block h-0.5 w-5 bg-textPrimary" />
        <span className="ml-0 mt-1 block h-0.5 w-5 bg-textPrimary" />
      </button>

      {isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          aria-label="Close sidebar backdrop"
        />
      ) : null}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-40 flex w-[280px] flex-col border-r border-border bg-card px-5 py-6 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <h1 dir="rtl" className="arabic-font-dynamic text-3xl text-primary">
            القرآن الكريم
          </h1>
          <p className="mt-1 text-sm text-textMuted">The Holy Quran</p>
        </div>

        <nav className="mt-8 space-y-2">
          {navigationLinks.map((link) => {
            const active = isActiveRoute(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-textPrimary hover:bg-black/30"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <SettingsPanel />
        </div>
      </aside>
    </>
  );
}
