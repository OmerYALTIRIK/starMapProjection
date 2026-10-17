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
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E5E0D5] px-4 lg:px-8 py-4">
      <div className="max-w-[1380px] mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#tasarla"
          className="font-cinzel text-lg lg:text-xl font-bold tracking-[0.22em] text-[#141413] whitespace-nowrap shrink-0"
        >
          CELESTIAL
        </a>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#57534E]">
          <a
            href="#tasarla"
            className="hover:text-[#141413] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0"
          >
            Harita Tasarla
          </a>
          <a
            href="#koleksiyonlar"
            className="hover:text-[#141413] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0"
          >
            Koleksiyonlar
          </a>
          <a
            href="#kalite"
            className="hover:text-[#141413] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0"
          >
            Tasarım & Kalite
          </a>
          <a
            href="#yorumlar"
            className="hover:text-[#141413] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0"
          >
            Müşteri Yorumları
          </a>
          <button
            type="button"
            onClick={onOpenAstronomy}
            className="hover:text-[#141413] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Astronomi Lab
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenDownload}
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#141413] text-[#FAF8F5] hover:bg-[#292826] text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer whitespace-nowrap shrink-0 tabular-nums shadow-sm"
          >
            <Download className="w-4 h-4 shrink-0 text-[#D4AF37]" />
            <span>{isPaid ? 'Paketi İndir (PNG + SVG)' : 'Satın Al & İndir · ₺250,00'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
