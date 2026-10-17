import React, { useEffect, useState, useRef } from 'react';
import { Header } from './components/Header';
import { PosterPreview } from './components/PosterPreview';
import { EditorSidebar } from './components/EditorSidebar';
import { PaywallModal } from './components/PaywallModal';
import { AdvancedAstronomyModal } from './components/AdvancedAstronomyModal';
import { CorporateSections } from './components/CorporateSections';
import { PosterData } from './types';

declare global {
  interface Window {
    Celestial?: any;
    d3?: any;
  }
}

const OCCASION_PRESETS = [
  {
    label: 'Galeri Klasik (Beyaz & Lacivert)',
    preset: {
      title: 'Seni İlk Gördüğüm Gece',
      subtitle: 'Yıldızlar o gece bizim için hizalandı',
      theme: 'classic-white' as const,
      shape: 'circle' as const,
      frame: 'oak' as const,
      font: 'cinzel' as const,
    },
  },
  {
    label: 'Geceyarısı & Siyah Çerçeve',
    preset: {
      title: 'Yıldızların Altında',
      subtitle: 'Sonsuz evrende bizim hikayemiz başladı',
      theme: 'midnight' as const,
      shape: 'circle' as const,
      frame: 'black' as const,
      font: 'playfair' as const,
    },
  },
  {
    label: 'Yıldönümü & Kalp Kesim',
    preset: {
      title: 'Evet Dediğim An',
      subtitle: 'Kalplerimizin ve yıldızların buluştuğu gece',
      theme: 'rose' as const,
      shape: 'heart' as const,
      frame: 'gold' as const,
      font: 'script' as const,
    },
  },
  {
    label: 'Bebek & Doğum Günü',
    preset: {
      title: 'Dünyaya Gözlerini Açtığın Gece',
      subtitle: 'Hoş geldin küçük yıldızımız',
      theme: 'emerald' as const,
      shape: 'circle' as const,
      frame: 'oak' as const,
      font: 'playfair' as const,
    },
  },
];

export default function App() {
  const [poster, setPoster] = useState<PosterData>({
    title: 'Seni İlk Gördüğüm Gece',
    subtitle: 'Yıldızlar o gece bizim için hizalandı',
    date: new Date().toISOString().slice(0, 10),
    time: '22:30',
    locationName: 'İstanbul, Türkiye',
    lat: 41.0082,
    lng: 28.9784,
    theme: 'classic-white',
    shape: 'circle',
    frame: 'oak',
    font: 'cinzel',
    showConstellationLines: true,
    showConstellationNames: true,
    showMilkyWay: true,
    showPlanets: true,
    showGraticule: true,
    showStars: true,
    starMagnitude: 5.6,
    starGlow: true,
    glowIntensity: 3.0,
    showCoordinatesText: true,
  });

  const [isPaid, setIsPaid] = useState<boolean>(() => {
    try {
      return localStorage.getItem('celestial_paid') === '1';
    } catch {
      return false;
    }
  });

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isAstronomyOpen, setIsAstronomyOpen] = useState(false);
  const [currentProjection, setCurrentProjection] = useState('stereographic');
  const initializedRef = useRef(false);

  // Initialize Celestial Map once
  useEffect(() => {
    const checkAndInit = () => {
      if (window.Celestial && !initializedRef.current) {
        initializedRef.current = true;

        const config = {
          container: 'celestial-map',
          datapath: '/data/',
          form: false,
          interactive: true,
          controls: false,
          projection: 'stereographic',
          projectionRatio: 1.0,
          transform: 'equatorial',
          follow: 'zenith',
          geopos: [poster.lat, poster.lng],
          stars: {
            data: 'stars.6.json',
            show: poster.showStars,
            limit: poster.starMagnitude,
            glow: poster.starGlow,
            glowSize: 3.2,
            colors: true,
            size: 6.5,
            exponent: -0.28,
            designation: false,
            propername: false,
          },
          dsos: {
            data: 'dsos.bright.json',
            show: true,
            limit: 4.5,
            colors: true,
            names: false,
          },
          constellations: {
            show: true,
            lines: poster.showConstellationLines,
            names: poster.showConstellationNames,
            namesType: 'tr',
            bounds: false,
          },
          mw: {
            show: poster.showMilkyWay,
            style: { fill: '#ffffff', opacity: 0.14 },
          },
          lines: {
            graticule: {
              show: poster.showGraticule,
              stroke: '#ffffff',
              width: 0.55,
              opacity: 0.3,
            },
            equatorial: { show: false },
            ecliptic: { show: false },
            galactic: { show: false },
            supergalactic: { show: false },
          },
          background: {
            fill: '#0B1528',
            opacity: 1,
            stroke: 'transparent',
            width: 0,
          },
          horizon: {
            show: false,
          },
          daylight: {
            show: false,
          },
          planets: {
            show: poster.showPlanets,
            which: ['sol', 'lun', 'mer', 'ven', 'mar', 'jup', 'sat'],
          },
        };

        window.Celestial.display(config);
      }
    };

    if (window.Celestial) {
      checkAndInit();
    } else {
      const interval = setInterval(() => {
        if (window.Celestial) {
          clearInterval(interval);
          checkAndInit();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // Update Celestial layers & settings when poster state changes
  useEffect(() => {
    if (!window.Celestial || !initializedRef.current) return;

    let bgFill = '#0B1528';
    if (poster.theme === 'classic-white' || poster.theme === 'midnight') bgFill = '#0B1528';
    else if (poster.theme === 'obsidian') bgFill = '#0A0A0D';
    else if (poster.theme === 'emerald') bgFill = '#0D2120';
    else if (poster.theme === 'rose') bgFill = '#241016';
    else if (poster.theme === 'minimal') bgFill = '#161922';

    const updatedConfig = {
      stars: {
        show: poster.showStars,
        limit: poster.starMagnitude,
        glow: poster.starGlow,
        glowSize: poster.starGlow ? 3.2 : 0,
      },
      constellations: {
        lines: poster.showConstellationLines,
        names: poster.showConstellationNames,
      },
      mw: {
        show: poster.showMilkyWay,
      },
      lines: {
        graticule: {
          show: poster.showGraticule,
        },
      },
      background: {
        fill: bgFill,
      },
      planets: {
        show: poster.showPlanets,
      },
    };

    try {
      window.Celestial.apply(updatedConfig);
    } catch (e) {
      console.warn('Celestial apply error:', e);
    }
  }, [
    poster.showStars,
    poster.starMagnitude,
    poster.starGlow,
    poster.showConstellationLines,
    poster.showConstellationNames,
    poster.showMilkyWay,
    poster.showGraticule,
    poster.showPlanets,
    poster.theme,
  ]);

  const handleLocationChange = (lat: number, lng: number, name: string) => {
    setPoster((prev) => ({ ...prev, lat, lng, locationName: name }));
    if (window.Celestial && window.Celestial.rotate) {
      try {
        window.Celestial.rotate({ geopos: [lat, lng] });
      } catch (e) {
        console.warn('Celestial rotate error:', e);
      }
    }
  };

  const handleDateChange = (date: string, time: string) => {
    setPoster((prev) => ({ ...prev, date, time }));
    if (window.Celestial && window.Celestial.date) {
      try {
        const [y, m, d] = date.split('-').map(Number);
        const [hh, mm] = time.split(':').map(Number);
        const dt = new Date(y, m - 1, d, hh, mm || 0);
        window.Celestial.date(dt);
      } catch (e) {
        console.warn('Celestial date error:', e);
      }
    }
  };

  const handleZoomIn = () => {
    if (window.Celestial && window.Celestial.zoomBy) {
      window.Celestial.zoomBy(1.25);
    }
  };

  const handleZoomOut = () => {
    if (window.Celestial && window.Celestial.zoomBy) {
      window.Celestial.zoomBy(0.8);
    }
  };

  const handleReproject = (proj: string) => {
    setCurrentProjection(proj);
    if (window.Celestial && window.Celestial.reproject) {
      window.Celestial.reproject({ projection: proj });
    }
  };

  const handleTransform = (trans: string) => {
    if (window.Celestial && window.Celestial.reload) {
      window.Celestial.reload({ transform: trans });
    }
  };

  const handleRotate = (center: [number, number, number]) => {
    if (window.Celestial && window.Celestial.rotate) {
      window.Celestial.rotate({ center });
    }
  };

  const handleFocusConstellation = (id: string) => {
    if (id === '---') {
      if (window.Celestial && window.Celestial.rotate) {
        window.Celestial.rotate({ geopos: [poster.lat, poster.lng] });
      }
      return;
    }
    if (window.Celestial && window.Celestial.constellations) {
      const con = window.Celestial.constellations[id];
      if (con) {
        window.Celestial.rotate({ center: [con.center[0], con.center[1], 0] });
        window.Celestial.zoomBy(1.6);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#141413]">
      {/* Top Corporate Navigation */}
      <Header
        onOpenAstronomy={() => setIsAstronomyOpen(true)}
        onOpenDownload={() => setIsDownloadOpen(true)}
        isPaid={isPaid}
      />

      {/* HERO + FRONT-AND-CENTER INTERACTIVE STAR MAP STUDIO */}
      <section id="tasarla" className="pt-8 pb-16 lg:pt-10 lg:pb-20 px-4 lg:px-8">
        <div className="max-w-[1380px] mx-auto">
          {/* Editorial Hero Lead-In */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-7">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6A63] mb-2">
                <span className="text-[#9A7432] font-semibold">ESA Hipparcos Yıldız Kataloğu</span>
                <span aria-hidden="true">·</span>
                <span>300 DPI Baskı PNG + Vektörel SVG</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">48.900+ Teslim Edilen Harita</span>
              </div>
              <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-[42px] font-bold text-[#141413] tracking-tight leading-tight max-w-3xl">
                En Özel Anınızın Gökyüzünü Tasarlayın
              </h1>
            </div>

            {/* Quick Occasion Presets */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#F3EFEA] p-1.5 rounded-xl border border-[#E5E0D5]">
              {OCCASION_PRESETS.map((oc) => (
                <button
                  key={oc.label}
                  type="button"
                  onClick={() => setPoster((prev) => ({ ...prev, ...oc.preset }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap shrink-0 ${
                    poster.theme === oc.preset.theme && poster.shape === oc.preset.shape
                      ? 'bg-[#141413] text-white font-semibold shadow-sm'
                      : 'text-[#57534E] hover:text-[#141413] hover:bg-white/70'
                  }`}
                >
                  {oc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main 2-Column Live Configurator Box */}
          <div className="rounded-2xl bg-white border border-[#E5E0D5] shadow-[0_20px_50px_-20px_rgba(20,20,19,0.12)] overflow-hidden flex flex-col lg:flex-row items-stretch">
            <PosterPreview
              poster={poster}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
            />

            <EditorSidebar
              poster={poster}
              onChange={(up) => setPoster((prev) => ({ ...prev, ...up }))}
              onLocationChange={handleLocationChange}
              onDateChange={handleDateChange}
              onOpenDownload={() => setIsDownloadOpen(true)}
            />
          </div>
        </div>
      </section>

      {/* Corporate E-Commerce Sections */}
      <CorporateSections
        onApplyPreset={(preset) => setPoster((prev) => ({ ...prev, ...preset }))}
        onOpenDownload={() => setIsDownloadOpen(true)}
        onOpenAstronomy={() => setIsAstronomyOpen(true)}
      />

      {/* Paywall & Download Modal (250 TL PNG + SVG) */}
      <PaywallModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        poster={poster}
        isPaid={isPaid}
        onPaymentSuccess={() => setIsPaid(true)}
      />

      {/* Advanced Astronomy & Cartography Modal */}
      <AdvancedAstronomyModal
        isOpen={isAstronomyOpen}
        onClose={() => setIsAstronomyOpen(false)}
        onReproject={handleReproject}
        onTransform={handleTransform}
        onRotate={handleRotate}
        onFocusConstellation={handleFocusConstellation}
        currentProjection={currentProjection}
      />
    </div>
  );
}
