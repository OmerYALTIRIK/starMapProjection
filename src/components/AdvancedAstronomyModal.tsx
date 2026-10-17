import React, { useState } from 'react';
import { X, Compass, Globe, Sparkles, RotateCcw } from 'lucide-react';

interface AdvancedAstronomyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReproject: (proj: string) => void;
  onTransform: (trans: string) => void;
  onRotate: (center: [number, number, number]) => void;
  onFocusConstellation: (id: string) => void;
  currentProjection: string;
}

const PROJECTIONS = [
  { id: 'aitoff', name: 'Aitoff (Geniş Açılı Elips)' },
  { id: 'stereographic', name: 'Stereographic (Yarımküre Kubbe)' },
  { id: 'azimuthalEqualArea', name: 'Azimuthal Equal Area (Eşit Alanlı)' },
  { id: 'azimuthalEquidistant', name: 'Azimuthal Equidistant (Eşit Mesafeli)' },
  { id: 'orthographic', name: 'Orthographic (3D Küre Görünümü)' },
  { id: 'mercator', name: 'Mercator (Silindirik)' },
  { id: 'mollweide', name: 'Mollweide (Oval Gök Atlası)' },
  { id: 'winkel3', name: 'Winkel Tripel (Dengeli Projeksiyon)' },
  { id: 'hammer', name: 'Hammer (Eşit Alanlı)' },
  { id: 'equirectangular', name: 'Equirectangular (Düz Dikdörtgen)' },
];

const CONSTELLATIONS_LIST = [
  { id: '---', name: 'Tüm Gökyüzü (Sıfırla)' },
  { id: 'Ori', name: 'Orion (Avcı)' },
  { id: 'UMa', name: 'Ursa Major (Büyük Ayı)' },
  { id: 'UMi', name: 'Ursa Minor (Küçük Ayı - Kutup Yıldızı)' },
  { id: 'Cas', name: 'Cassiopeia (Kraliçe)' },
  { id: 'Cyg', name: 'Cygnus (Kuğu)' },
  { id: 'Tau', name: 'Taurus (Boğa & Ülker/Pleiades)' },
  { id: 'Gem', name: 'Gemini (İkizler)' },
  { id: 'Leo', name: 'Leo (Aslan)' },
  { id: 'Sco', name: 'Scorpius (Akrep)' },
  { id: 'Sgr', name: 'Sagittarius (Yay)' },
  { id: 'And', name: 'Andromeda (Zincirli Prenses)' },
  { id: 'Peg', name: 'Pegasus (Kanatlı At)' },
  { id: 'Aql', name: 'Aquila (Kartal)' },
  { id: 'Lyr', name: 'Lyra (Çalgı & Vega Yıldızı)' },
  { id: 'CMa', name: 'Canis Major (Büyük Köpek & Sirius)' },
];

export const AdvancedAstronomyModal: React.FC<AdvancedAstronomyModalProps> = ({
  isOpen,
  onClose,
  onReproject,
  onTransform,
  onRotate,
  onFocusConstellation,
  currentProjection,
}) => {
  const [selectedProj, setSelectedProj] = useState(currentProjection || 'stereographic');
  const [coordSystem, setCoordSystem] = useState('equatorial');
  const [ra, setRa] = useState(0);
  const [dec, setDec] = useState(0);
  const [orient, setOrient] = useState(0);

  if (!isOpen) return null;

  const handleApplyProjection = (proj: string) => {
    setSelectedProj(proj);
    onReproject(proj);
  };

  const handleApplyCoords = (sys: string) => {
    setCoordSystem(sys);
    onTransform(sys);
  };

  const handleApplyRotation = () => {
    onRotate([ra, dec, orient]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#040816]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#0d1633] border border-[#2b3b72] rounded-2xl p-6 sm:p-7 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#1f2b54]">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center">
            <Compass className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h2 className="font-cinzel text-lg sm:text-xl font-bold text-slate-100">
              Astronomi & Projeksiyon Laboratuvarı
            </h2>
            <p className="text-xs text-slate-400">
              D3-Celestial kartografik izdüşüm ve göksel koordinat hesaplayıcı
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm">
          {/* Projections */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
              Harita Projeksiyonu (Kartografi):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PROJECTIONS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyProjection(p.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                    selectedProj === p.id
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-semibold'
                      : 'bg-[#080e22] border-[#1d2952] text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Constellation Focus */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
              Takımyıldızına Odaklan & Yakınlaş:
            </label>
            <select
              onChange={(e) => onFocusConstellation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#233363] bg-[#080e22] text-slate-200 text-xs focus:outline-none focus:border-amber-400"
            >
              {CONSTELLATIONS_LIST.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Coordinate Systems */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
              Göksel Referans Düzlemi:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'equatorial', label: 'Ekvatoral' },
                { id: 'ecliptic', label: 'Ekliptik (Güneş Düzlemi)' },
                { id: 'galactic', label: 'Galaktik (Samanyolu)' },
                { id: 'supergalactic', label: 'Süpergalaktik' },
              ].map((sys) => (
                <button
                  key={sys.id}
                  type="button"
                  onClick={() => handleApplyCoords(sys.id)}
                  className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer text-center ${
                    coordSystem === sys.id
                      ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                      : 'bg-[#080e22] border-[#1d2952] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sys.label}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Center Turning */}
          <div className="p-4 rounded-xl bg-[#080e22] border border-[#1f2c57]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300">
                Merkez Açılarını Elle Ayarla:
              </span>
              <button
                type="button"
                onClick={() => {
                  setRa(0);
                  setDec(0);
                  setOrient(0);
                  onRotate([0, 0, 0]);
                }}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Sıfırla
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Sağ Açıklık (RA, h):</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={ra}
                  onChange={(e) => setRa(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#233363] bg-[#0e1736] text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Dik Açıklık (Dec, °):</label>
                <input
                  type="number"
                  step="1"
                  min="-90"
                  max="90"
                  value={dec}
                  onChange={(e) => setDec(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#233363] bg-[#0e1736] text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Yönelme (°):</label>
                <input
                  type="number"
                  step="5"
                  min="-180"
                  max="180"
                  value={orient}
                  onChange={(e) => setOrient(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#233363] bg-[#0e1736] text-slate-200"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleApplyRotation}
              className="mt-3 w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition cursor-pointer"
            >
              Açıları Uygula ve Döndür
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#1f2b54] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            Kapat ve Haritaya Dön
          </button>
        </div>
      </div>
    </div>
  );
};
