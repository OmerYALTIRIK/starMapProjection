import React from 'react';
import { ZoomIn, ZoomOut, Move, Sparkles } from 'lucide-react';
import { PosterData } from '../types';
import { formatCoordinates, formatDisplayDate } from '../utils/exportPoster';

interface PosterPreviewProps {
  poster: PosterData;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const PosterPreview: React.FC<PosterPreviewProps> = ({
  poster,
  onZoomIn,
  onZoomOut,
}) => {
  // Theme Backgrounds
  const getThemeClass = () => {
    switch (poster.theme) {
      case 'midnight':
        return 'bg-gradient-to-b from-[#040816] via-[#070f28] to-[#02050e] text-slate-100';
      case 'obsidian':
        return 'bg-[#060608] text-slate-100';
      case 'cosmic':
        return 'bg-gradient-to-b from-[#120d2c] via-[#080616] to-[#020108] text-slate-100';
      case 'rose':
        return 'bg-gradient-to-b from-[#180e18] via-[#221122] to-[#0d060e] text-rose-50';
      case 'minimal':
        return 'bg-[#0a0d18] text-slate-100';
      default:
        return 'bg-[#040816] text-slate-100';
    }
  };

  // Frame Styles
  const getFrameClass = () => {
    switch (poster.frame) {
      case 'black':
        return 'p-4 sm:p-6 bg-[#080808] border-[12px] sm:border-[16px] border-[#111113] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/10 rounded-lg';
      case 'oak':
        return 'p-4 sm:p-6 bg-[#2d1e12] border-[12px] sm:border-[16px] border-[#4a3523] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-[#735538]/50 rounded-lg';
      case 'gold':
        return 'p-4 sm:p-6 bg-[#1a1408] border-[12px] sm:border-[16px] border-[#9c7a28] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-[#ffd97a]/40 rounded-lg';
      case 'white':
        return 'p-4 sm:p-6 bg-[#e2e8f0] border-[12px] sm:border-[16px] border-[#f8fafc] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-slate-300 rounded-lg text-slate-900';
      case 'none':
      default:
        return 'shadow-2xl shadow-black/80 rounded-xl border border-white/10';
    }
  };

  // Typography font class
  const getTitleFontClass = () => {
    switch (poster.font) {
      case 'playfair':
        return 'font-playfair font-bold';
      case 'script':
        return 'font-script text-3xl sm:text-4xl lg:text-5xl';
      case 'sans':
        return 'font-sans font-extrabold uppercase tracking-widest';
      case 'cinzel':
      default:
        return 'font-cinzel font-bold tracking-widest';
    }
  };

  const formattedDate = formatDisplayDate(poster.date, poster.time);
  const formattedCoords = formatCoordinates(poster.lat, poster.lng);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 overflow-y-auto relative min-h-[500px]">
      {/* Floating Canvas Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[#09112b]/80 backdrop-blur-md border border-[#1e2d5c] rounded-xl p-1 shadow-lg">
        <button
          type="button"
          onClick={onZoomIn}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#15234f] transition cursor-pointer"
          title="Yakınlaştır (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#15234f] transition cursor-pointer"
          title="Uzaklaştır (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-[#1e2d5c] mx-0.5" />
        <div className="hidden sm:flex items-center gap-1 px-2 text-[11px] text-slate-400">
          <Move className="w-3 h-3 text-sky-400" />
          <span>Döndürmek için sürükleyin</span>
        </div>
      </div>

      {/* Realistic Poster Container */}
      <div
        className={`w-full max-w-[520px] transition-all duration-300 ${getFrameClass()}`}
      >
        <div
          className={`aspect-[1/1.414] w-full p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-colors duration-500 ${getThemeClass()}`}
        >
          {/* Subtle Poster Double Border */}
          <div className="absolute inset-3 border border-white/10 pointer-events-none rounded-sm" />
          <div className="absolute inset-4 border border-white/5 pointer-events-none rounded-sm" />

          {/* Central Star Map Area */}
          <div className="flex-1 flex items-center justify-center relative my-2">
            {/* The circular or heart astrolabe container */}
            <div
              className={`relative flex items-center justify-center transition-all ${
                poster.shape === 'circle'
                  ? 'w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-full'
                  : poster.shape === 'heart'
                  ? 'w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] [clip-path:polygon(50%_15%,65%_0%,100%_0%,100%_40%,50%_95%,0%_40%,0%_0%,35%_0%)]'
                  : 'w-full h-full rounded-lg'
              }`}
            >
              {/* Decorative Astrolabe Ring for Circle */}
              {poster.shape === 'circle' && (
                <>
                  <div className="absolute inset-0 rounded-full border border-amber-400/40 pointer-events-none" />
                  <div className="absolute -inset-2 rounded-full border border-white/15 pointer-events-none" />
                  <div className="absolute -inset-3.5 rounded-full border border-amber-400/20 pointer-events-none" />
                </>
              )}

              {/* CELESTIAL CANVAS MOUNT CONTAINER */}
              <div
                id="celestial-map"
                className={`w-full h-full overflow-hidden ${
                  poster.shape === 'circle'
                    ? 'rounded-full'
                    : ''
                }`}
              />
            </div>
          </div>

          {/* Personalization Typography Section */}
          <div className="text-center pt-2 pb-1 relative z-10">
            {/* Celestial Stars Divider */}
            <div className="text-amber-400 text-xs tracking-[0.3em] mb-2 font-serif opacity-80">
              ✦ • ✧ • ✦
            </div>

            {/* Poster Title */}
            <h1
              className={`text-xl sm:text-2xl lg:text-3xl text-slate-100 drop-shadow-sm mb-1.5 leading-tight ${getTitleFontClass()}`}
            >
              {poster.title || 'Seni İlk Gördüğüm Gece'}
            </h1>

            {/* Subtitle */}
            {poster.subtitle && (
              <p className="text-xs sm:text-sm text-slate-300/90 italic font-playfair mb-3 max-w-[90%] mx-auto line-clamp-2">
                "{poster.subtitle}"
              </p>
            )}

            {/* Thin Gold Divider */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mx-auto mb-2.5" />

            {/* Formatted Date & Time */}
            <div className="text-[11px] sm:text-xs tracking-widest uppercase font-medium text-slate-300 mb-0.5">
              {formattedDate}
            </div>

            {/* Location Name */}
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-wider uppercase">
              {poster.locationName || 'İSTANBUL, TÜRKİYE'}
            </div>

            {/* Coordinates */}
            {poster.showCoordinatesText && (
              <div className="text-[10px] sm:text-[11px] font-mono text-amber-300/80 tracking-wider mt-0.5">
                {formattedCoords}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
