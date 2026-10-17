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
    label: 'İlk Tanışma & Aşk',
    preset: {
      title: 'Seni İlk Gördüğüm Gece',
      subtitle: 'Yıldızlar senin için parıldıyordu...',
      theme: 'midnight' as const,
      shape: 'circle' as const,
      font: 'cinzel' as const,
    },
  },
  {
    label: 'Evlilik Teklifi & Yıldönümü',
    preset: {
      title: 'Evet Dediğim An',
      subtitle: 'Kalplerimizin ve yıldızların buluştuğu gece',
      theme: 'rose' as const,
      shape: 'heart' as const,
      font: 'script' as const,
    },
  },
  {
    label: 'Doğum Günü & Bebek',
    preset: {
      title: 'Dünyaya Gözlerini Açtığın Gece',
      subtitle: 'Hoş geldin küçük yıldızımız',
      theme: 'obsidian' as const,
      shape: 'circle' as const,
      font: 'playfair' as const,
    },
  },
  {
    label: 'Kozmik Galeri',
    preset: {
      title: 'Yıldızların Altında',
      subtitle: 'Sonsuz evrende bizim hikayemiz',
      theme: 'cosmic' as const,
      shape: 'full' as const,
      font: 'sans' as const,
    },
  },
];

export default function App() {
  const [poster, setPoster] = useState<PosterData>({
    title: 'Seni İlk Gördüğüm Gece',
    subtitle: 'Yıldızlar senin için parıldıyordu...',
    date: new Date().toISOString().slice(0, 10),
    time: '22:30',
    locationName: 'İstanbul, Türkiye',
    lat: 41.0082,
    lng: 28.9784,
    theme: 'midnight',
    shape: 'circle',
    frame: 'black',
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
            style: { fill: '#ffffff', opacity: 0.16 },
          },
          lines: {
            graticule: {
              show: poster.showGraticule,
              stroke: '#ffffff',
              width: 0.6,
              opacity: 0.35,
            },
            equatorial: { show: false },
            ecliptic: { show: false },
            galactic: { show: false },
            supergalactic: { show: false },
          },
          background: {
            fill: '#040816',
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

    let bgFill = '#040816';
    if (poster.theme === 'obsidian') bgFill = '#060608';
    else if (poster.theme === 'cosmic') bgFill = '#0a061c';
    else if (poster.theme === 'rose') bgFill = '#150a16';
    else if (poster.theme === 'minimal') bgFill = '#080d1e';

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
    <div className="min-h-screen flex flex-col bg-[#040816] text-[#e8ecf8]">
      {/* Top Corporate Navigation */}
      <Header
        onOpenAstronomy={() => setIsAstronomyOpen(true)}
        onOpenDownload={() => setIsDownloadOpen(true)}
        isPaid={isPaid}
      />

      {/* HERO + FRONT-AND-CENTER INTERACTIVE STAR MAP STUDIO */}
      <section id="tasarla" className="pt-8 pb-14 lg:pt-12 lg:pb-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Editorial Hero Lead-In */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2.5">
                <span className="text-amber-300 font-medium">ESA Hipparcos Yıldız Kataloğu</span>
                <span aria-hidden="true">·</span>
                <span>300 DPI Baskı PNG + Vektörel SVG</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">48.900+ Teslim Edilen Harita</span>
              </div>
              <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-100 tracking-tight max-w-3xl">
                En Özel Anınızın Gökyüzünü Tasarlayın
              </h1>
            </div>

            {/* Quick Occasion Presets */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#080f28] p-1.5 rounded-xl border border-[#192653]">
              {OCCASION_PRESETS.map((oc) => (
                <button
                  key={oc.label}
                  type="button"
                  onClick={() => setPoster((prev) => ({ ...prev, ...oc.preset }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap shrink-0 ${
                    poster.title === oc.preset.title
                      ? 'bg-amber-400 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-[#101c42]'
                  }`}
                >
                  {oc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main 2-Column Live Configurator Box */}
          <div className="rounded-2xl bg-[#060b1d] border border-[#1a2754] shadow-2xl overflow-hidden flex flex-col lg:flex-row items-stretch">
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

      {/* Corporate E-Commerce Sections (Collections, Bento Capabilities, Testimonials, FAQ, Footer) */}
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
