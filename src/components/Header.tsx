import React from 'react';
import { Sparkles, Compass, Download, ShieldCheck, Moon } from 'lucide-react';

interface HeaderProps {
  onOpenAstronomy: () => void;
  onOpenDownload: () => void;
  isPaid: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAstronomy, onOpenDownload, isPaid }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#060a1d]/90 backdrop-blur-md border-b border-[#1b254b] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 via-indigo-500/30 to-purple-600/40 border border-amber-400/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg lg:text-xl font-bold tracking-wider text-slate-100">
                CELESTIAL
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-medium">
                PRO 300 DPI
              </span>
              {isPaid && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium">
                  <ShieldCheck className="w-3 h-3" /> Lisanslı
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Gerçek Zamanlı Gökyüzü Projeksiyonu & Kişiye Özel Yıldız Posteri
            </p>
          </div>
        </div>

        {/* Feature Highlights (Desktop) */}
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e1633] border border-[#212f5a]">
            <Moon className="w-3.5 h-3.5 text-indigo-300" />
            <span>Gerçek Gezegen & Ay Hesabı</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e1633] border border-[#212f5a]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Işıltılı Parlak Yıldızlar</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAstronomy}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0f1838] hover:bg-[#18234e] text-slate-200 border border-[#26376c] text-xs font-medium transition cursor-pointer"
            title="Projeksiyon, koordinatlar ve detaylı astronomi haritası ayarları"
          >
            <Compass className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Astronomi & Projeksiyon</span>
          </button>

          <button
            onClick={onOpenDownload}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-400/20 text-xs sm:text-sm font-bold tracking-wide transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isPaid ? 'Posteri İndir' : 'Satın Al & İndir (₺10)'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
