import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Compass,
  Check,
  ArrowRight,
  Sliders,
  Type,
  Palette,
  Frame,
} from 'lucide-react';
import {
  PosterData,
  PosterTheme,
  PosterShape,
  PosterFrame,
  PosterFont,
  POPULAR_CITIES,
  SUGGESTED_TITLES,
} from '../types';

interface EditorSidebarProps {
  poster: PosterData;
  onChange: (updated: Partial<PosterData>) => void;
  onLocationChange: (lat: number, lng: number, name: string) => void;
  onDateChange: (date: string, time: string) => void;
  onOpenDownload: () => void;
}

const POSTER_THEMES: {
  id: PosterTheme;
  label: string;
  desc: string;
  outerRing: string;
  innerCircle: string;
}[] = [
  {
    id: 'classic-white',
    label: 'Galeri Beyazı & Lacivert',
    desc: 'Krem kağıt, gece mavisi küre',
    outerRing: 'bg-[#FAF8F5] border-[#D5CFC4]',
    innerCircle: 'bg-[#0B1528]',
  },
  {
    id: 'midnight',
    label: 'Klasik Gece Mavisi',
    desc: 'Derin kraliyet laciverti',
    outerRing: 'bg-[#0B1528] border-[#1E2F52]',
    innerCircle: 'bg-[#D4AF37]',
  },
  {
    id: 'obsidian',
    label: 'Saf Mermer Siyah',
    desc: 'Mat galeri siyahı & beyaz',
    outerRing: 'bg-[#0A0A0D] border-[#27272A]',
    innerCircle: 'bg-[#FAF8F5]',
  },
  {
    id: 'emerald',
    label: 'Kuzey Zümrüt Yeşili',
    desc: 'Botanik koyu zümrüt & altın',
    outerRing: 'bg-[#0D2120] border-[#1F4240]',
    innerCircle: 'bg-[#D4AF37]',
  },
  {
    id: 'rose',
    label: 'Vintage Bordo & Altın',
    desc: 'Romantik şarap & şampanya',
    outerRing: 'bg-[#241016] border-[#4A222E]',
    innerCircle: 'bg-[#E5C158]',
  },
  {
    id: 'minimal',
    label: 'İskandinav Antrasit',
    desc: 'Modern koyu arduvaz gri',
    outerRing: 'bg-[#161922] border-[#2E3446]',
    innerCircle: 'bg-[#E2E8F0]',
  },
];

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  poster,
  onChange,
  onLocationChange,
  onDateChange,
  onOpenDownload,
}) => {
  const [activeTab, setActiveTab] = useState<'design' | 'moment' | 'text' | 'sky'>('design');
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  const handleCitySelect = (cityName: string) => {
    const city = POPULAR_CITIES.find((c) => c.name === cityName);
    if (city) {
      onLocationChange(city.lat, city.lng, city.name);
    }
  };

  const handleUseCurrentLocation = () => {
    setGeoNotice(null);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onLocationChange(pos.coords.latitude, pos.coords.longitude, 'Mevcut Konumum');
        },
        () => {
          setGeoNotice('Konum izni alınamadı, lütfen şehir listesinden seçim yapın.');
        }
      );
    } else {
      setGeoNotice('Tarayıcınız konum özelliğini desteklemiyor.');
    }
  };

  const handleSetCurrentTime = () => {
    const now = new Date();
    const d = now.toISOString().slice(0, 10);
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    onDateChange(d, `${h}:${m}`);
  };

  return (
    <aside className="w-full lg:w-[460px] bg-white border-t lg:border-t-0 lg:border-l border-[#E5E0D5] flex flex-col lg:h-[800px] z-20 shrink-0">
      {/* Step Navigation Tabs */}
      <div className="grid grid-cols-4 border-b border-[#E5E0D5] bg-[#FAF8F5] p-1.5 gap-1">
        {[
          { id: 'design', step: '01', label: 'Stil & Renk', icon: Palette },
          { id: 'moment', step: '02', label: 'Konum & An', icon: MapPin },
          { id: 'text', step: '03', label: 'Başlık & Yazı', icon: Type },
          { id: 'sky', step: '04', label: 'Gökyüzü', icon: Sliders },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-[#141413] font-semibold shadow-sm border border-[#E5E0D5]'
                  : 'text-[#6E6A63] hover:text-[#141413] hover:bg-white/60'
              }`}
            >
              <span className="text-[10px] font-mono text-[#9A7432] mb-0.5 tabular-nums">
                {tab.step}
              </span>
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content Area */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
        {/* STEP 01: STİL, RENK & ÇERÇEVE (Like The Night Sky & Maps For Moments) */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            {/* Color Swatches */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-[#141413]">
                  01. Poster Renk Paleti
                </label>
                <span className="text-xs text-[#6E6A63]">
                  {POSTER_THEMES.find((t) => t.id === poster.theme)?.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {POSTER_THEMES.map((th) => {
                  const selected = poster.theme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => onChange({ theme: th.id })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                        selected
                          ? 'border-[#141413] bg-[#FAF8F5] ring-1 ring-[#141413]'
                          : 'border-[#E5E0D5] bg-white hover:border-[#B8AFA0]'
                      }`}
                    >
                      {/* Dual-tone circular swatch */}
                      <span
                        className={`w-8 h-8 rounded-full border ${th.outerRing} flex items-center justify-center shrink-0 shadow-inner`}
                      >
                        <span className={`w-4 h-4 rounded-full ${th.innerCircle}`} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs text-[#141413] truncate">
                          {th.label}
                        </div>
                        <div className="text-[11px] text-[#6E6A63] truncate">{th.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Map Cutout Shape */}
            <div>
              <label className="block text-xs font-semibold text-[#141413] mb-2.5">
                02. Harita Kesim Biçimi
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'circle', label: 'Astrolab Daire', desc: '360° Derece Halkalı' },
                  { id: 'heart', label: 'Romantik Kalp', desc: 'Özel Kalp Kesim' },
                  { id: 'full', label: 'Tam Kubbe', desc: 'Geniş Gökyüzü' },
                ].map((sh) => (
                  <button
                    key={sh.id}
                    type="button"
                    onClick={() => onChange({ shape: sh.id as PosterShape })}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      poster.shape === sh.id
                        ? 'border-[#141413] bg-[#141413] text-white font-semibold'
                        : 'border-[#E5E0D5] bg-white text-[#3F3C38] hover:border-[#B8AFA0]'
                    }`}
                  >
                    <div className="text-xs whitespace-nowrap">{sh.label}</div>
                    <div
                      className={`text-[10px] mt-0.5 whitespace-nowrap ${
                        poster.shape === sh.id ? 'text-[#D6D1C7]' : 'text-[#78716C]'
                      }`}
                    >
                      {sh.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#141413] mb-2.5">
                03. Galeri Çerçeve Önizlemesi
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'black', label: 'Mat Siyah', swatch: 'bg-[#18181B] border-[#18181B]' },
                  { id: 'oak', label: 'Doğal Meşe', swatch: 'bg-[#A47E53] border-[#84623C]' },
                  { id: 'gold', label: 'Altın Pirinç', swatch: 'bg-[#C29B48] border-[#9A7432]' },
                  { id: 'white', label: 'Beyaz Ahşap', swatch: 'bg-[#F8F6F0] border-[#D0C9BC]' },
                  { id: 'none', label: 'Çerçevesiz', swatch: 'bg-white border-dashed border-[#A8A29E]' },
                ].map((fr) => (
                  <button
                    key={fr.id}
                    type="button"
                    onClick={() => onChange({ frame: fr.id as PosterFrame })}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center ${
                      poster.frame === fr.id
                        ? 'border-[#141413] bg-[#FAF8F5] ring-1 ring-[#141413] font-semibold'
                        : 'border-[#E5E0D5] bg-white hover:border-[#B8AFA0]'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full border mb-1.5 ${fr.swatch}`} />
                    <span className="text-[11px] text-[#141413] whitespace-nowrap">{fr.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 02: KONUM & AN (Location, Date & Time) */}
        {activeTab === 'moment' && (
          <div className="space-y-5">
            {/* Location Card */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#141413] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#9A7432]" /> Özel Anın gerçekleştiği Konum
                </span>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="text-xs font-medium text-[#9A7432] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" /> GPS Konumumu Bul
                </button>
              </div>

              {geoNotice && <p className="text-xs text-[#9A7432]">{geoNotice}</p>}

              <div>
                <label className="block text-xs text-[#57534E] mb-1">Hızlı Şehir Seçimi</label>
                <select
                  value={poster.locationName}
                  onChange={(e) => handleCitySelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6D1C7] bg-white text-[#141413] text-xs font-medium focus:outline-none focus:border-[#141413]"
                >
                  {POPULAR_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#57534E] mb-1">
                  Posterde Yazacak Konum Adı
                </label>
                <input
                  type="text"
                  value={poster.locationName}
                  onChange={(e) => onChange({ locationName: e.target.value })}
                  placeholder="Örn: Moda Sahili, İstanbul"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6D1C7] bg-white text-[#141413] text-xs focus:outline-none focus:border-[#141413]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="block text-[11px] text-[#6E6A63] mb-1">Enlem (Kuzey/Güney)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={poster.lat}
                    onChange={(e) =>
                      onLocationChange(
                        parseFloat(e.target.value) || 0,
                        poster.lng,
                        poster.locationName
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#D6D1C7] bg-white text-[#141413] text-xs font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6E6A63] mb-1">Boylam (Doğu/Batı)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={poster.lng}
                    onChange={(e) =>
                      onLocationChange(
                        poster.lat,
                        parseFloat(e.target.value) || 0,
                        poster.locationName
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#D6D1C7] bg-white text-[#141413] text-xs font-mono tabular-nums"
                  />
                </div>
              </div>
            </div>

            {/* Date & Time Card */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#141413] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#9A7432]" /> Gökyüzü Tarihi ve Saati
                </span>
                <button
                  type="button"
                  onClick={handleSetCurrentTime}
                  className="text-xs font-medium text-[#9A7432] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" /> Şu Anı Seç
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#57534E] mb-1">Tarih</label>
                  <input
                    type="date"
                    value={poster.date}
                    onChange={(e) => onDateChange(e.target.value, poster.time)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D6D1C7] bg-white text-[#141413] text-xs font-medium focus:outline-none focus:border-[#141413]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#57534E] mb-1">Saat</label>
                  <input
                    type="time"
                    value={poster.time}
                    onChange={(e) => onDateChange(poster.date, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D6D1C7] bg-white text-[#141413] text-xs font-medium focus:outline-none focus:border-[#141413]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 03: BAŞLIK & KİŞİSEL MESAJ */}
        {activeTab === 'text' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                Poster Ana Başlığı
              </label>
              <input
                type="text"
                value={poster.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="Örn: Seni İlk Gördüğüm Gece"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6D1C7] bg-white text-[#141413] text-sm focus:outline-none focus:border-[#141413] transition"
              />

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {SUGGESTED_TITLES.map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => onChange({ title })}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-[#FAF8F5] hover:bg-[#141413] text-[#3F3C38] hover:text-white border border-[#E5E0D5] transition cursor-pointer"
                  >
                    + {title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                Alt Başlık / Özel İthaf Mesajı
              </label>
              <textarea
                rows={2}
                value={poster.subtitle}
                onChange={(e) => onChange({ subtitle: e.target.value })}
                placeholder="Örn: Yıldızlar senin için parıldıyordu..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D6D1C7] bg-white text-[#141413] text-sm focus:outline-none focus:border-[#141413] transition resize-none"
              />
            </div>

            {/* Font Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#141413] mb-2">
                Tipografi Stili
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'cinzel',
                    name: 'Cinzel Roman',
                    sample: 'KLASİK GALERİ SERİF',
                    cls: 'font-cinzel',
                  },
                  {
                    id: 'playfair',
                    name: 'Playfair Editorial',
                    sample: 'Zarif Editoryal Başlık',
                    cls: 'font-playfair',
                  },
                  {
                    id: 'sans',
                    name: 'Plus Jakarta Modern',
                    sample: 'MİMARİ MİNİMALİST',
                    cls: 'font-sans tracking-widest uppercase text-xs',
                  },
                  {
                    id: 'script',
                    name: 'Great Vibes Kaligrafi',
                    sample: 'El Yazısı Romantik İthaf',
                    cls: 'font-script text-lg',
                  },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onChange({ font: f.id as PosterFont })}
                    className={`w-full p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      poster.font === f.id
                        ? 'border-[#141413] bg-[#FAF8F5] ring-1 ring-[#141413]'
                        : 'border-[#E5E0D5] bg-white hover:border-[#B8AFA0]'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-medium text-[#6E6A63]">{f.name}</div>
                      <div className={`text-sm text-[#141413] mt-0.5 ${f.cls}`}>{f.sample}</div>
                    </div>
                    {poster.font === f.id && <Check className="w-4 h-4 text-[#141413] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2.5 pt-1 text-xs text-[#3F3C38] cursor-pointer">
              <input
                type="checkbox"
                checked={poster.showCoordinatesText}
                onChange={(e) => onChange({ showCoordinatesText: e.target.checked })}
                className="w-4 h-4 rounded border-[#D6D1C7] accent-[#141413]"
              />
              <span>Enlem ve boylam koordinatlarını posterin altında göster</span>
            </label>
          </div>
        )}

        {/* STEP 04: GÖKYÜZÜ KATMANLARI & PARLAKLIK */}
        {activeTab === 'sky' && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#141413]">
                    Spektral Yıldız Işıltısı (Starlight Glow)
                  </div>
                  <div className="text-[11px] text-[#6E6A63]">
                    Parlak yıldızların etrafında gerçekçi ışık halesi
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={poster.starGlow}
                  onChange={(e) => onChange({ starGlow: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#141413] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#3F3C38] mb-1.5">
                  <span>Yıldız Yoğunluğu (Kadir Sınırı)</span>
                  <span className="font-mono font-semibold text-[#9A7432] tabular-nums">
                    {poster.starMagnitude} Mag
                  </span>
                </div>
                <input
                  type="range"
                  min="2.5"
                  max="6.0"
                  step="0.1"
                  value={poster.starMagnitude}
                  onChange={(e) => onChange({ starMagnitude: parseFloat(e.target.value) })}
                  className="w-full accent-[#141413] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#6E6A63] mt-1">
                  <span>Sade Gökyüzü (2.5)</span>
                  <span>Tüm Katalog (6.0)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#141413] mb-2">
                Astronomik Katmanlar
              </label>

              {[
                {
                  key: 'showConstellationLines',
                  label: 'Takımyıldızı Çizgileri',
                  desc: '88 resmi IAU takımyıldızı bağlantısı',
                },
                {
                  key: 'showConstellationNames',
                  label: 'Takımyıldızı İsimleri',
                  desc: 'Türkçe astronomik takımyıldız etiketleri',
                },
                {
                  key: 'showMilkyWay',
                  label: 'Samanyolu Galaksisi (Milky Way)',
                  desc: 'Galaktik toz bulutu kuşağı',
                },
                {
                  key: 'showPlanets',
                  label: 'Gezegenler, Güneş ve Ay',
                  desc: 'Seçilen tarihteki gerçek yörünge konumları',
                },
                {
                  key: 'showGraticule',
                  label: 'Göksel Koordinat Ağı (Graticule)',
                  desc: 'Sağ açıklık ve dik açıklık meridyenleri',
                },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E5E0D5] hover:border-[#B8AFA0] transition cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#141413]">{item.label}</div>
                    <div className="text-[11px] text-[#6E6A63]">{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={(poster as any)[item.key]}
                    onChange={(e) => onChange({ [item.key]: e.target.checked } as any)}
                    className="w-4 h-4 rounded accent-[#141413] cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contiguous Purchase Module Footer */}
      <div className="p-5 bg-[#FAF8F5] border-t border-[#E5E0D5]">
        <div className="flex items-center justify-between text-xs mb-3">
          <div>
            <span className="font-semibold text-[#141413]">Dijital Sanat Paketi</span>
            <span className="text-[#6E6A63] ml-1.5">· 300 DPI PNG + Vektörel SVG</span>
          </div>
          <span className="text-base font-bold text-[#141413] tabular-nums">₺250,00</span>
        </div>
        <button
          type="button"
          onClick={onOpenDownload}
          className="w-full py-3.5 px-5 rounded-xl bg-[#141413] hover:bg-[#292826] text-white font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Tasarımı Tamamla & İndir</span>
          <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
        </button>
        <div className="text-[11px] text-center text-[#6E6A63] mt-2">
          Anında teslimat · Tüm çerçeve boyutlarıyla (A4, A3, 50×70 cm) tam uyumlu
        </div>
      </div>
    </aside>
  );
};
