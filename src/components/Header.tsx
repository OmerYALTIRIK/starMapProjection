import React from 'react';
import { Download } from 'lucide-react';

interface HeaderProps {
  onOpenAstronomy: () => void;
  onOpenDownload: () => void;
  isPaid: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAstronomy,
  onOpenDownload,
  isPaid,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#050816]/95 backdrop-blur-md border-b border-[#182246] px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#tasarla"
          className="font-cinzel text-lg lg:text-xl font-bold tracking-wider text-slate-100 whitespace-nowrap shrink-0"
        >
          CELESTIAL
        </a>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#tasarla"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Harita Tasarla
          </a>
          <a
            href="#koleksiyonlar"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Koleksiyonlar
          </a>
          <a
            href="#nasil-calisir"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Nasıl Çalışır
          </a>
          <a
            href="#yorumlar"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Yorumlar
          </a>
          <button
            type="button"
            onClick={onOpenAstronomy}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Astronomi Lab
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenDownload}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs sm:text-sm font-bold tracking-wide transition cursor-pointer whitespace-nowrap shrink-0 tabular-nums"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>{isPaid ? 'Paketi İndir (PNG + SVG)' : 'Satın Al & İndir · ₺250,00'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
