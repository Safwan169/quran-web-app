"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search English translation...",
}: SearchBarProps) {
  return (
    <form onSubmit={(event) => event.preventDefault()} className="w-full">
      <label htmlFor="quran-search" className="sr-only">
        Search verses
      </label>
      <input
        id="quran-search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-textPrimary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
      />
    </form>
  );
}
