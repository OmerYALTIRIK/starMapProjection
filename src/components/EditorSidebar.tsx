import React, { useState } from 'react';
import {
  Type,
  Palette,
  Eye,
  Frame,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Compass,
  Check,
  ChevronRight,
  Sliders,
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

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  poster,
  onChange,
  onLocationChange,
  onDateChange,
  onOpenDownload,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'design' | 'sky' | 'frame'>('text');

  const handleCitySelect = (cityName: string) => {
    const city = POPULAR_CITIES.find((c) => c.name === cityName);
    if (city) {
      onLocationChange(city.lat, city.lng, city.name);
    }
  };

  const [geoNotice, setGeoNotice] = useState<string | null>(null);

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
    <aside className="w-full lg:w-[440px] bg-[#070c22] border-t lg:border-t-0 lg:border-l border-[#19234b] flex flex-col lg:h-[780px] z-20 shrink-0">
      {/* Tab Navigation */}
      <div className="grid grid-cols-4 border-b border-[#1b2752] bg-[#05091b] p-1 gap-1">
        {[
          { id: 'text', label: 'Metinler', icon: Type },
          { id: 'design', label: 'Tasarım', icon: Palette },
          { id: 'sky', label: 'Gökyüzü', icon: Eye },
          { id: 'frame', label: 'Çerçeve', icon: Frame },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-xs font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1333]'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
        {/* TAB 1: METİNLER */}
        {activeTab === 'text' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                Poster Başlığı
              </label>
              <input
                type="text"
                value={poster.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="Örn: Seni İlk Gördüğüm Gece"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#223163] bg-[#0c1436] text-slate-100 text-sm focus:outline-none focus:border-amber-400 transition"
              />

              {/* Title Suggestions */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SUGGESTED_TITLES.slice(0, 4).map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => onChange({ title })}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0e173d] hover:bg-amber-400/20 text-slate-300 hover:text-amber-200 border border-[#213063] transition cursor-pointer"
                  >
                    + {title}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtitle / Special Note */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
                Alt Başlık / Romantik Mesaj
              </label>
              <textarea
                rows={2}
                value={poster.subtitle}
                onChange={(e) => onChange({ subtitle: e.target.value })}
                placeholder="Örn: Yıldızlar senin için parıldıyordu..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#223163] bg-[#0c1436] text-slate-100 text-sm focus:outline-none focus:border-amber-400 transition resize-none"
              />
            </div>

            {/* Date & Time */}
            <div className="p-4 rounded-xl bg-[#09102c] border border-[#1d2b59] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-sky-400" /> Tarih ve Saat
                </span>
                <button
                  type="button"
                  onClick={handleSetCurrentTime}
                  className="text-[11px] text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Clock className="w-3 h-3" /> Şimdi
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Tarih</label>
                  <input
                    type="date"
                    value={poster.date}
                    onChange={(e) => onDateChange(e.target.value, poster.time)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#223163] bg-[#0e173b] text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Saat</label>
                  <input
                    type="time"
                    value={poster.time}
                    onChange={(e) => onDateChange(poster.date, e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#223163] bg-[#0e173b] text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Location & Coordinates */}
            <div className="p-4 rounded-xl bg-[#09102c] border border-[#1d2b59] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" /> Konum ve Koordinatlar
                </span>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="text-[11px] text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Compass className="w-3 h-3" /> Konumumu Bul
                </button>
              </div>
              {geoNotice && (
                <p className="text-[11px] text-amber-300">{geoNotice}</p>
              )}

              {/* City Presets */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Hızlı Şehir Seçimi:</label>
                <select
                  value={poster.locationName}
                  onChange={(e) => handleCitySelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#223163] bg-[#0e173b] text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                >
                  {POPULAR_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Location Name */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Posterde Görünecek Konum İsmi:
                </label>
                <input
                  type="text"
                  value={poster.locationName}
                  onChange={(e) => onChange({ locationName: e.target.value })}
                  placeholder="Örn: İstanbul, Galata Kulesi"
                  className="w-full px-3 py-2 rounded-lg border border-[#223163] bg-[#0e173b] text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Lat & Lng */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Enlem (Latitude)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={poster.lat}
                    onChange={(e) =>
                      onLocationChange(parseFloat(e.target.value) || 0, poster.lng, poster.locationName)
                    }
                    className="w-full px-2 py-1.5 rounded-lg border border-[#223163] bg-[#0e173b] text-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Boylam (Longitude)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={poster.lng}
                    onChange={(e) =>
                      onLocationChange(poster.lat, parseFloat(e.target.value) || 0, poster.locationName)
                    }
                    className="w-full px-2 py-1.5 rounded-lg border border-[#223163] bg-[#0e173b] text-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Toggle coordinates on poster */}
              <label className="flex items-center gap-2 pt-1 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={poster.showCoordinatesText}
                  onChange={(e) => onChange({ showCoordinatesText: e.target.checked })}
                  className="rounded border-[#223163] text-amber-400 focus:ring-0"
                />
                <span>Koordinat metnini posterde göster</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 2: TASARIM & TEMA */}
        {activeTab === 'design' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Color Themes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2.5">
                Poster Renk Teması
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'midnight',
                    label: 'Geceyarısı Laciverti',
                    desc: 'Klasik Derin Uzay',
                    bg: 'from-[#040816] to-[#0d1b3d]',
                    border: 'border-blue-400',
                  },
                  {
                    id: 'obsidian',
                    label: 'Saf Obsidiyen Siyah',
                    desc: 'Kristal Yıldızlar',
                    bg: 'from-[#030305] to-[#121216]',
                    border: 'border-slate-400',
                  },
                  {
                    id: 'cosmic',
                    label: 'Kozmik Nebula',
                    desc: 'Mor & Zümrüt Parıltı',
                    bg: 'from-[#140b2a] to-[#25103d]',
                    border: 'border-purple-400',
                  },
                  {
                    id: 'rose',
                    label: 'Gül Kurusu & Şampanya',
                    desc: 'Romantik Sıcak Ton',
                    bg: 'from-[#1d0e1b] to-[#2e172a]',
                    border: 'border-rose-400',
                  },
                  {
                    id: 'minimal',
                    label: 'Modern Minimalist',
                    desc: 'Sade & Zarif Tasarım',
                    bg: 'from-[#080d1e] to-[#151f3d]',
                    border: 'border-amber-400',
                  },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => onChange({ theme: th.id as PosterTheme })}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer relative overflow-hidden ${
                      poster.theme === th.id
                        ? 'border-amber-400 ring-1 ring-amber-400 shadow-md shadow-amber-400/10'
                        : 'border-[#1e2a52] hover:border-slate-500'
                    }`}
                  >
                    <div
                      className={`h-7 rounded-lg bg-gradient-to-r ${th.bg} border border-white/10 mb-2 flex items-center justify-end px-2`}
                    >
                      {poster.theme === th.id && (
                        <Check className="w-4 h-4 text-amber-300 drop-shadow" />
                      )}
                    </div>
                    <div className="font-semibold text-xs text-slate-100">{th.label}</div>
                    <div className="text-[10px] text-slate-400">{th.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Poster Shape / Mask */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2.5">
                Gökyüzü Çerçeve Şekli
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'circle', label: 'Klasik Daire', desc: 'Astrolab Halka' },
                  { id: 'heart', label: 'Aşk Kalbi', desc: 'Romantik Maske' },
                  { id: 'full', label: 'Tam Sayfa', desc: 'Kenarsız Kubbe' },
                ].map((sh) => (
                  <button
                    key={sh.id}
                    type="button"
                    onClick={() => onChange({ shape: sh.id as PosterShape })}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      poster.shape === sh.id
                        ? 'bg-amber-400/15 border-amber-400 text-amber-200 font-semibold'
                        : 'bg-[#0a102c] border-[#1d2a52] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-medium text-xs mb-0.5">{sh.label}</div>
                    <div className="text-[10px] text-slate-400">{sh.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography / Fonts */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2.5">
                Başlık Tipografisi
              </label>
              <div className="space-y-2">
                {[
                  { id: 'cinzel', name: 'Cinzel', sample: 'ROMA KLASİK YILDIZ HARİTASI', cls: 'font-cinzel' },
                  { id: 'playfair', name: 'Playfair Display', sample: 'Zarif & Romantik Serif', cls: 'font-playfair' },
                  { id: 'sans', name: 'Plus Jakarta Sans', sample: 'Modern Minimalist Net Yazı', cls: 'font-sans' },
                  { id: 'script', name: 'Great Vibes', sample: 'Özel El Yazısı Kaligrafi', cls: 'font-script text-lg' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onChange({ font: f.id as PosterFont })}
                    className={`w-full p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      poster.font === f.id
                        ? 'bg-amber-400/15 border-amber-400 text-amber-200'
                        : 'bg-[#0a102c] border-[#1d2a52] text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{f.name}</div>
                      <div className={`text-sm text-slate-200 mt-0.5 ${f.cls}`}>
                        {f.sample}
                      </div>
                    </div>
                    {poster.font === f.id && <Check className="w-4 h-4 text-amber-300 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GÖKYÜZÜ KATMANLARI & PARLAKLIK */}
        {activeTab === 'sky' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Star Glow & Magnitude */}
            <div className="p-4 rounded-xl bg-[#09102c] border border-[#1d2b59] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" /> Yıldız Parlaklık & Işıltı Efekti (Glow)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Gerçekçi göksel ışıltı aurası ve kırınım parıltısı
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={poster.starGlow}
                  onChange={(e) => onChange({ starGlow: e.target.checked })}
                  className="w-5 h-5 rounded border-[#223163] text-amber-400 focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Star Magnitude limit */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Görünen Yıldız Sayısı / Kadir Sınırı:</span>
                  <span className="font-mono text-amber-300">{poster.starMagnitude} Mag</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  step="0.2"
                  value={poster.starMagnitude}
                  onChange={(e) => onChange({ starMagnitude: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>Yalnız Parlak Yıldızlar (2.0)</span>
                  <span>Tüm Gökyüzü Detayı (6.0)</span>
                </div>
              </div>
            </div>

            {/* Astronomical Layers Toggles */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
                Görünür Göksel Katmanlar:
              </label>

              {[
                {
                  key: 'showConstellationLines',
                  label: 'Takımyıldızı Çizgileri',
                  desc: '88 resmi IAU takımyıldız hattı',
                },
                {
                  key: 'showConstellationNames',
                  label: 'Takımyıldızı İsimleri',
                  desc: 'Orion, Büyük Ayı vb. etiketleri',
                },
                {
                  key: 'showMilkyWay',
                  label: 'Samanyolu Galaksisi (Milky Way)',
                  desc: 'Galaktik toz bulutu poligonları',
                },
                {
                  key: 'showPlanets',
                  label: 'Gezegenler, Güneş ve Ay',
                  desc: 'Seçili tarihteki anlık astronomik konumları',
                },
                {
                  key: 'showGraticule',
                  label: 'Koordinat & Ekvator Ağı',
                  desc: 'Gök küresi ızgara çizgileri',
                },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#0a112f] border border-[#1b264e] hover:border-[#27376e] transition cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-medium text-slate-200">{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={(poster as any)[item.key]}
                    onChange={(e) => onChange({ [item.key]: e.target.checked } as any)}
                    className="w-4 h-4 rounded border-[#223163] text-amber-400 focus:ring-0 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ÇERÇEVE & SİPARİŞ */}
        {activeTab === 'frame' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Frame Mockups */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2.5">
                Çerçeve Önizlemesi (Mockup):
              </label>
              <div className="space-y-2">
                {[
                  { id: 'none', label: 'Çerçevesiz Poster', desc: 'Saf sanatsal baskı veya dijital çıktı' },
                  { id: 'black', label: 'Modern Mat Siyah Ahşap', desc: 'Minimalist şık siyah kenarlık' },
                  { id: 'oak', label: 'Doğal Meşe Ahşap', desc: 'Sıcak İskandinav doğal ahşap dokusu' },
                  { id: 'gold', label: 'Lüks Altın Metal', desc: 'Özel hediye altın parıltılı çerçeve' },
                  { id: 'white', label: 'Beyaz Ahşap Çerçeve', desc: 'Ferah aydınlık modern çerçeve' },
                ].map((fr) => (
                  <button
                    key={fr.id}
                    type="button"
                    onClick={() => onChange({ frame: fr.id as PosterFrame })}
                    className={`w-full p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      poster.frame === fr.id
                        ? 'bg-amber-400/15 border-amber-400 text-amber-200'
                        : 'bg-[#0a102c] border-[#1d2a52] text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{fr.label}</div>
                      <div className="text-[11px] text-slate-400">{fr.desc}</div>
                    </div>
                    {poster.frame === fr.id && <Check className="w-4 h-4 text-amber-300" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Print sizes & specs */}
            <div className="p-4 rounded-xl bg-[#09102c] border border-[#1d2b59] text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-slate-100">Baskı Standartları:</div>
              <ul className="space-y-1 text-slate-400 list-disc list-inside text-[11px]">
                <li>A4 (21 x 29.7 cm), A3 (29.7 x 42 cm), 50x70 cm boyutlarına tam uyumlu</li>
                <li>300 DPI ultra keskin piksel yoğunluğu</li>
                <li>CMYK baskıya uygun kayıpsız dosya oluşturma</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA Bar */}
      <div className="p-4 bg-[#05091b] border-t border-[#19244c]">
        <button
          type="button"
          onClick={onOpenDownload}
          className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 tabular-nums"
        >
          <span>Dijital Paketi İndir –</span>
          <span className="font-black">₺250,00</span>
          <ChevronRight className="w-4 h-4" />
        </button>
        <p className="text-[11px] text-center text-slate-400 mt-2">
          Anında dijital teslimat · Vektörel SVG ve 300 DPI PNG dahil
        </p>
      </div>
    </aside>
  );
};
