import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Download, Sparkles, FileImage, Layers } from 'lucide-react';
import { PosterData } from '../types';
import { generateHighResPosterBlob } from '../utils/exportPoster';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  poster: PosterData;
  isPaid: boolean;
  onPaymentSuccess: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  poster,
  isPaid,
  onPaymentSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>(
    isPaid
      ? 'Önceden ödeme yaptınız, tüm dijital formatları (300 DPI PNG + SVG) doğrudan indirebilirsiniz.'
      : 'Dijital ürünleri (300 DPI Baskı + SVG) indirmek için 250 TL ödemeyi tamamlayın.'
  );
  const [isError, setIsError] = useState(false);
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [downloadFormat, setDownloadFormat] = useState<'poster' | 'map-only' | 'svg'>('poster');
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setLoading(true);
    setIsError(false);
    setStatus('250 TL ödeme alınıyor… lütfen bekleyin');

    setTimeout(() => {
      setLoading(false);
      const code = 'SKY-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      setPendingCode(code);
      setCodeInput(code);
      setStatus('₺250,00 ödemeniz alındı. Dijital indirme kodunuz: ' + code + ' — aşağıya otomatik eklendi.');
    }, 800);
  };

  const handleConfirmAndDownload = async () => {
    if (!isPaid && pendingCode) {
      if (codeInput.trim().toUpperCase() !== pendingCode) {
        setStatus('Kod hatalı veya eşleşmiyor.');
        setIsError(true);
        return;
      }
      localStorage.setItem('celestial_paid', '1');
      onPaymentSuccess();
      setPendingCode(null);
    }

    setDownloading(true);
    setStatus('Yüksek çözünürlüklü dijital dosya hazırlanıyor…');

    try {
      const fileNameDate = poster.date || new Date().toISOString().slice(0, 10);

      if (downloadFormat === 'poster') {
        const blob = await generateHighResPosterBlob(poster);
        const url = URL.createObjectURL(blob);
        triggerDownload(url, `yildiz-haritasi-posteri-${fileNameDate}.png`);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      } else if (downloadFormat === 'svg') {
        if ((window as any).Celestial && typeof (window as any).Celestial.exportSVG === 'function') {
          (window as any).Celestial.exportSVG(`gokyuzu-haritasi-${fileNameDate}.svg`);
        } else {
          const svgNode = document.querySelector('#celestial-map svg');
          if (svgNode) {
            const xml = new XMLSerializer().serializeToString(svgNode);
            const blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + xml], {
              type: 'image/svg+xml;charset=utf-8',
            });
            const url = URL.createObjectURL(blob);
            triggerDownload(url, `gokyuzu-haritasi-${fileNameDate}.svg`);
            setTimeout(() => URL.revokeObjectURL(url), 5000);
          } else {
            throw new Error('SVG çıktısı oluşturulamadı, lütfen PNG formatını seçin.');
          }
        }
      } else {
        const canvas = document.querySelector('#celestial-map canvas') as HTMLCanvasElement | null;
        if (canvas) {
          const url = canvas.toDataURL('image/png');
          triggerDownload(url, `gokyuzu-haritasi-${fileNameDate}.png`);
        }
      }

      setStatus('İndirme tamamlandı! Yıldız haritanız hazır.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setIsError(true);
      setStatus(err.message || 'İndirme sırasında bir sorun oluştu.');
    } finally {
      setDownloading(false);
    }
  };

  const triggerDownload = (href: string, name: string) => {
    const a = document.createElement('a');
    a.href = href;
    a.download = name;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const canDownload = isPaid || (pendingCode && codeInput.trim().toUpperCase() === pendingCode);

  return (
    <div className="fixed inset-0 z-50 bg-[#040816]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#0d1530] text-[#e8ecf8] border border-[#2c3a6b] rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/80 font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between pr-8 mb-2">
          <h3 className="font-cinzel text-lg sm:text-xl font-bold text-amber-300">
            Dijital Poster Paketini İndir
          </h3>
          <span className="text-sm font-bold text-amber-300 tabular-nums">₺250,00</span>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed text-[#b9c2dd] mb-4">
          Seçtiğiniz tarih, konum ve kişisel mesajınızla oluşturulan yüksek çözünürlüklü (300 DPI) dijital gökyüzü haritası paketi <strong className="text-amber-300 font-semibold tabular-nums">250 TL</strong> ücrete tabidir. Tek ödeme ile tüm formatları indirebilirsiniz.
        </p>

        {/* Format Selection */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-300 mb-2">
            İndirilecek Dijital Ürün Formatı:
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setDownloadFormat('poster')}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                downloadFormat === 'poster'
                  ? 'bg-amber-400/15 border-amber-400 text-amber-200 font-semibold'
                  : 'bg-[#081026] border-[#222f5a] text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileImage className="w-4 h-4 mb-1 text-amber-300" />
              <div className="font-medium whitespace-nowrap">Özel Poster</div>
              <div className="text-[10px] text-slate-400 whitespace-nowrap">300 DPI Baskı</div>
            </button>

            <button
              type="button"
              onClick={() => setDownloadFormat('map-only')}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                downloadFormat === 'map-only'
                  ? 'bg-amber-400/15 border-amber-400 text-amber-200 font-semibold'
                  : 'bg-[#081026] border-[#222f5a] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4 mb-1 text-sky-300" />
              <div className="font-medium whitespace-nowrap">Saf Harita</div>
              <div className="text-[10px] text-slate-400 whitespace-nowrap">Yıldız Küresi</div>
            </button>

            <button
              type="button"
              onClick={() => setDownloadFormat('svg')}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                downloadFormat === 'svg'
                  ? 'bg-amber-400/15 border-amber-400 text-amber-200 font-semibold'
                  : 'bg-[#081026] border-[#222f5a] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 mb-1 text-purple-300" />
              <div className="font-medium whitespace-nowrap">Vektörel</div>
              <div className="text-[10px] text-slate-400 whitespace-nowrap">SVG Format</div>
            </button>
          </div>
        </div>

        {/* Status Message Box */}
        <div
          className={`min-h-[22px] text-xs p-2.5 rounded-lg mb-4 flex items-center gap-2 ${
            isError
              ? 'bg-rose-950/40 border border-rose-800 text-rose-300'
              : 'bg-[#09132e] border border-[#213369] text-[#9fd0ff]'
          }`}
        >
          {isPaid && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          <span>{status}</span>
        </div>

        {/* Payment Row */}
        {!isPaid && (
          <div className="mb-3">
            <button
              type="button"
              disabled={loading}
              onClick={handleSimulatePayment}
              className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-2 tabular-nums"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Ödeme Alınıyor…</span>
                </>
              ) : (
                <>
                  <span>Dijital Paketi Satın Al –</span>
                  <span className="font-black text-slate-950">₺250,00</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Code Input Row */}
        {!isPaid && pendingCode && (
          <div className="mb-3">
            <label className="block text-xs text-slate-300 mb-1">
              Ödeme Sonrası Verilen Lisans Kodu:
            </label>
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Ödeme sonrası verilen kod"
              maxLength={20}
              className="w-full px-3 py-2.5 rounded-xl border border-[#2c3a6b] bg-[#071026] text-[#e8ecf8] text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-amber-400 transition"
            />
          </div>
        )}

        {/* Download Button */}
        {canDownload && (
          <div className="mb-2">
            <button
              type="button"
              disabled={downloading}
              onClick={handleConfirmAndDownload}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Görsel Hazırlanıyor…</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>
                    {downloadFormat === 'svg'
                      ? 'Vektörel SVG Olarak İndir'
                      : downloadFormat === 'poster'
                      ? '300 DPI Özel Posteri İndir'
                      : 'Saf Harita PNG Olarak İndir'}
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Guarantees */}
        <div className="mt-4 pt-4 border-t border-[#1c2750] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>300 DPI Baskı Kalitesi · Anında Teslimat</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
          >
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
};
