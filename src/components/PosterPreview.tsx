import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import { PosterData } from '../types';
import { formatCoordinates, formatDisplayDate } from '../utils/exportPoster';

interface PosterPreviewProps {
  poster: PosterData;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

type WallFinish = 'alabaster' | 'stone' | 'charcoal';

export const PosterPreview: React.FC<PosterPreviewProps> = ({
  poster,
  onZoomIn,
  onZoomOut,
}) => {
  const [wallFinish, setWallFinish] = useState<WallFinish>('alabaster');

  const isLightPoster = poster.theme === 'classic-white';

  // Studio wall background classes
  const getWallClass = () => {
    switch (wallFinish) {
      case 'stone':
        return 'bg-[#E5DFD3]';
      case 'charcoal':
        return 'bg-[#1F2024]';
      case 'alabaster':
      default:
        return 'bg-[#EFECE6]';
    }
  };

  // Poster paper background
  const getPosterPaperClass = () => {
    switch (poster.theme) {
      case 'classic-white':
        return 'bg-[#FAF8F5] text-[#141413]';
      case 'midnight':
        return 'bg-[#0B1528] text-[#FAF8F5]';
      case 'obsidian':
        return 'bg-[#0A0A0D] text-[#FAF8F5]';
      case 'emerald':
        return 'bg-[#0D2120] text-[#FAF8F5]';
      case 'rose':
        return 'bg-[#241016] text-[#FAF8F5]';
      case 'minimal':
        return 'bg-[#161922] text-[#FAF8F5]';
      default:
        return 'bg-[#0B1528] text-[#FAF8F5]';
    }
  };

  // Realistic physical frame styling
  const getFrameClass = () => {
    switch (poster.frame) {
      case 'black':
        return 'p-3 sm:p-4 bg-[#F7F4EE] border-[14px] sm:border-[18px] border-[#161616] shadow-[0_35px_70px_-15px_rgba(20,20,19,0.42),0_10px_25px_-5px_rgba(20,20,19,0.22)] ring-1 ring-black/20';
      case 'oak':
        return 'p-3 sm:p-4 bg-[#F7F4EE] border-[14px] sm:border-[18px] border-[#9C7A54] shadow-[0_35px_70px_-15px_rgba(20,20,19,0.38),0_10px_25px_-5px_rgba(20,20,19,0.2)] ring-1 ring-[#6E5233]/30';
      case 'gold':
        return 'p-3 sm:p-4 bg-[#F7F4EE] border-[14px] sm:border-[18px] border-[#B69146] shadow-[0_35px_70px_-15px_rgba(20,20,19,0.4),0_10px_25px_-5px_rgba(20,20,19,0.22)] ring-1 ring-[#8A6A28]/40';
      case 'white':
        return 'p-3 sm:p-4 bg-[#F7F4EE] border-[14px] sm:border-[18px] border-[#FBF9F5] shadow-[0_35px_70px_-15px_rgba(20,20,19,0.32),0_10px_25px_-5px_rgba(20,20,19,0.16)] ring-1 ring-[#D6D1C7]';
      case 'none':
      default:
        return 'shadow-[0_30px_60px_-15px_rgba(20,20,19,0.35)] ring-1 ring-black/10';
    }
  };

  // Typography font class
  const getTitleFontClass = () => {
    switch (poster.font) {
      case 'playfair':
        return 'font-playfair font-bold tracking-wide';
      case 'script':
        return 'font-script text-3xl sm:text-4xl lg:text-[42px] font-normal';
      case 'sans':
        return 'font-sans font-bold uppercase tracking-[0.18em] text-lg sm:text-xl lg:text-2xl';
      case 'cinzel':
      default:
        return 'font-cinzel font-bold tracking-[0.14em]';
    }
  };

  const formattedDate = formatDisplayDate(poster.date, poster.time);
  const formattedCoords = formatCoordinates(poster.lat, poster.lng);

  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-10 relative min-h-[560px] transition-colors duration-300 ${getWallClass()}`}
    >
      {/* Subtle architectural window light & shadow gradient on the studio wall */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            wallFinish === 'charcoal'
              ? 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.06), transparent 70%)'
              : 'radial-gradient(circle at 28% 18%, rgba(255,255,255,0.65), rgba(0,0,0,0.04) 75%)',
        }}
      />

      {/* Top-Left Floating Map Zoom Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-md border border-[#DED8CD] rounded-lg p-1 shadow-sm">
        <button
          type="button"
          onClick={onZoomIn}
          className="p-2 rounded-md text-[#3F3C38] hover:text-[#141413] hover:bg-[#F3EFEA] transition cursor-pointer"
          title="Haritayı Yakınlaştır (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          className="p-2 rounded-md text-[#3F3C38] hover:text-[#141413] hover:bg-[#F3EFEA] transition cursor-pointer"
          title="Haritayı Uzaklaştır (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-[#E5E0D5] mx-0.5" />
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 text-[11px] font-medium text-[#57534E]">
          <Move className="w-3.5 h-3.5 text-[#9A7432]" />
          <span>Gökyüzünü döndürmek için sürükleyin</span>
        </div>
      </div>

      {/* Top-Right Wall Finish Switcher */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-md border border-[#DED8CD] rounded-lg p-1 shadow-sm text-[11px]">
        <span className="px-2 text-[#6E6A63] hidden sm:inline">Duvar Rengi:</span>
        {[
          { id: 'alabaster', label: 'Galeri Krem', swatch: 'bg-[#EFECE6] border-[#C8C1B4]' },
          { id: 'stone', label: 'Sıcak Taş', swatch: 'bg-[#DFD7C8] border-[#B8AFA0]' },
          { id: 'charcoal', label: 'Koyu Antrasit', swatch: 'bg-[#232429] border-[#141413]' },
        ].map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => setWallFinish(w.id as WallFinish)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              wallFinish === w.id
                ? 'bg-[#141413] text-white'
                : 'text-[#57534E] hover:text-[#141413] hover:bg-[#F3EFEA]'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full border ${w.swatch}`} />
            <span>{w.label}</span>
          </button>
        ))}
      </div>

      {/* Framed Fine-Art Poster Mockup */}
      <div
        className={`w-full max-w-[490px] my-8 lg:my-4 transition-all duration-300 relative z-10 ${getFrameClass()}`}
      >
        <div
          className={`aspect-[1/1.414] w-full p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-colors duration-300 ${getPosterPaperClass()}`}
        >
          {/* Fine-Art Double Hairline Poster Border */}
          <div
            className={`absolute inset-3.5 border pointer-events-none ${
              isLightPoster ? 'border-[#141413]/15' : 'border-white/12'
            }`}
          />
          <div
            className={`absolute inset-[18px] border pointer-events-none ${
              isLightPoster ? 'border-[#141413]/06' : 'border-white/05'
            }`}
          />

          {/* Central Celestial Map Area */}
          <div className="flex-1 flex items-center justify-center relative my-1">
            <div
              className={`relative flex items-center justify-center transition-all ${
                poster.shape === 'circle'
                  ? 'w-[255px] h-[255px] sm:w-[310px] sm:h-[310px] rounded-full'
                  : poster.shape === 'heart'
                  ? 'w-[255px] h-[255px] sm:w-[310px] sm:h-[310px] [clip-path:polygon(50%_15%,65%_0%,100%_0%,100%_40%,50%_95%,0%_40%,0%_0%,35%_0%)]'
                  : 'w-full h-full rounded-sm'
              }`}
            >
              {/* Precision Vector Astrolabe Compass Ring for Circle Shape */}
              {poster.shape === 'circle' && (
                <svg
                  viewBox="0 0 360 360"
                  className="absolute -inset-4 sm:-inset-5 w-[calc(100%+32px)] sm:w-[calc(100%+40px)] h-[calc(100%+32px)] sm:h-[calc(100%+40px)] pointer-events-none z-10"
                >
                  <circle
                    cx="180"
                    cy="180"
                    r="174"
                    fill="none"
                    stroke={isLightPoster ? 'rgba(20,20,19,0.28)' : 'rgba(212,175,55,0.38)'}
                    strokeWidth="0.9"
                  />
                  <circle
                    cx="180"
                    cy="180"
                    r="167"
                    fill="none"
                    stroke={isLightPoster ? 'rgba(20,20,19,0.16)' : 'rgba(255,255,255,0.18)'}
                    strokeWidth="0.7"
                  />
                  {Array.from({ length: 72 }).map((_, i) => {
                    const deg = i * 5;
                    const rad = (deg * Math.PI) / 180;
                    const r1 = deg % 30 === 0 ? 162 : deg % 15 === 0 ? 164.5 : 165.5;
                    const r2 = 167;
                    const x1 = 180 + Math.cos(rad) * r1;
                    const y1 = 180 + Math.sin(rad) * r1;
                    const x2 = 180 + Math.cos(rad) * r2;
                    const y2 = 180 + Math.sin(rad) * r2;
                    return (
                      <line
                        key={deg}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={
                          isLightPoster
                            ? deg % 30 === 0
                              ? 'rgba(20,20,19,0.55)'
                              : 'rgba(20,20,19,0.22)'
                            : deg % 30 === 0
                            ? 'rgba(212,175,55,0.65)'
                            : 'rgba(255,255,255,0.22)'
                        }
                        strokeWidth={deg % 30 === 0 ? '1.2' : '0.6'}
                      />
                    );
                  })}
                </svg>
              )}

              {/* CELESTIAL CANVAS MOUNT CONTAINER */}
              <div
                id="celestial-map"
                className={`w-full h-full overflow-hidden shadow-inner ${
                  poster.shape === 'circle' ? 'rounded-full' : ''
                }`}
              />
            </div>
          </div>

          {/* Editorial Typography Footer on the Poster */}
          <div className="text-center pt-3 pb-1 relative z-10">
            {/* Minimalist Celestial Divider */}
            <div
              className={`text-[10px] tracking-[0.35em] mb-2 font-serif ${
                isLightPoster ? 'text-[#9A7432]' : 'text-[#D4AF37]'
              }`}
            >
              ✦ · ✧ · ✦
            </div>

            {/* Poster Title */}
            <h2
              className={`text-xl sm:text-2xl lg:text-[26px] mb-1.5 leading-snug ${getTitleFontClass()} ${
                isLightPoster ? 'text-[#141413]' : 'text-[#FAF8F5]'
              }`}
            >
              {poster.title || 'Seni İlk Gördüğüm Gece'}
            </h2>

            {/* Subtitle */}
            {poster.subtitle && (
              <p
                className={`text-xs sm:text-[13px] italic font-playfair mb-3 max-w-[88%] mx-auto line-clamp-2 ${
                  isLightPoster ? 'text-[#57534E]' : 'text-[#CBD5E1]'
                }`}
              >
                {poster.subtitle}
              </p>
            )}

            {/* Fine Hairline Rule */}
            <div
              className={`w-20 h-px mx-auto mb-2.5 ${
                isLightPoster ? 'bg-[#141413]/20' : 'bg-[#D4AF37]/40'
              }`}
            />

            {/* Formatted Date & Time */}
            <div
              className={`text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold mb-0.5 tabular-nums ${
                isLightPoster ? 'text-[#292524]' : 'text-[#E2E8F0]'
              }`}
            >
              {formattedDate}
            </div>

            {/* Location Name */}
            <div
              className={`text-[10px] sm:text-[11px] font-medium tracking-[0.16em] uppercase ${
                isLightPoster ? 'text-[#57534E]' : 'text-[#94A3B8]'
              }`}
            >
              {poster.locationName || 'İSTANBUL, TÜRKİYE'}
            </div>

            {/* Coordinates */}
            {poster.showCoordinatesText && (
              <div
                className={`text-[9px] sm:text-[10px] font-mono tracking-[0.14em] mt-0.5 tabular-nums ${
                  isLightPoster ? 'text-[#9A7432]' : 'text-[#D4AF37]/85'
                }`}
              >
                {formattedCoords}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
