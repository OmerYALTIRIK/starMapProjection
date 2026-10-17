import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Download, Sparkles, FileImage, Layers } from 'lucide-react';
import { PosterData } from '../types';
import { generateHighResPosterBlob, generateHighResPosterSVG } from '../utils/exportPoster';

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
      ? 'Önceden ödeme yaptınız. Tüm dijital formatları (300 DPI PNG + Vektörel SVG) doğrudan indirebilirsiniz.'
      : 'Dijital ürünleri (300 DPI Baskı PNG + Vektörel SVG) indirmek için 250 TL ödemeyi tamamlayın.'
  );
  const [isError, setIsError] = useState(false);
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [downloadFormat, setDownloadFormat] = useState<'both' | 'poster' | 'svg' | 'map-only'>('both');
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
      setStatus('₺250,00 ödemeniz alındı. Dijital indirme kodunuz: ' + code + ' — aşağıdan PNG ve SVG olarak indirebilirsiniz.');
    }, 650);
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

  const executeDownload = async (targetFormat: 'both' | 'poster' | 'svg' | 'map-only') => {
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
    setIsError(false);
    setStatus('Yüksek çözünürlüklü dijital dosyalarınız hazırlanıyor…');

    try {
      const fileNameDate = poster.date || new Date().toISOString().slice(0, 10);

      if (targetFormat === 'both') {
        const pngBlob = await generateHighResPosterBlob(poster);
        const pngUrl = URL.createObjectURL(pngBlob);
        triggerDownload(pngUrl, `yildiz-haritasi-posteri-${fileNameDate}.png`);
        setTimeout(() => URL.revokeObjectURL(pngUrl), 8000);

        await new Promise((r) => setTimeout(r, 350));
        const svgBlob = await generateHighResPosterSVG(poster);
        const svgUrl = URL.createObjectURL(svgBlob);
        triggerDownload(svgUrl, `yildiz-haritasi-posteri-${fileNameDate}.svg`);
        setTimeout(() => URL.revokeObjectURL(svgUrl), 8000);

        setStatus('Hem 300 DPI PNG hem de Vektörel SVG başarıyla indirildi!');
      } else if (targetFormat === 'poster') {
        const pngBlob = await generateHighResPosterBlob(poster);
        const pngUrl = URL.createObjectURL(pngBlob);
        triggerDownload(pngUrl, `yildiz-haritasi-posteri-${fileNameDate}.png`);
        setTimeout(() => URL.revokeObjectURL(pngUrl), 8000);
        setStatus('300 DPI PNG posteriniz başarıyla indirildi!');
      } else if (targetFormat === 'svg') {
        const svgBlob = await generateHighResPosterSVG(poster);
        const svgUrl = URL.createObjectURL(svgBlob);
        triggerDownload(svgUrl, `yildiz-haritasi-posteri-${fileNameDate}.svg`);
        setTimeout(() => URL.revokeObjectURL(svgUrl), 8000);
        setStatus('Vektörel SVG posteriniz başarıyla indirildi!');
      } else {
        const canvas = document.querySelector('#celestial-map canvas') as HTMLCanvasElement | null;
        if (canvas) {
          const url = canvas.toDataURL('image/png');
          triggerDownload(url, `gokyuzu-haritasi-${fileNameDate}.png`);
          setStatus('Saf yıldız küresi PNG olarak indirildi!');
        }
      }
    } catch (err: any) {
      setIsError(true);
      setStatus(err.message || 'İndirme sırasında bir sorun oluştu.');
    } finally {
      setDownloading(false);
    }
  };

  const canDownload = isPaid || (pendingCode && codeInput.trim().toUpperCase() === pendingCode);

  return (
    <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white text-[#141413] border border-[#E5E0D5] rounded-2xl p-6 sm:p-7 shadow-2xl font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#6E6A63] hover:text-[#141413] hover:bg-[#F3EFEA] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between pr-8 mb-2">
          <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#141413]">
            Dijital Yıldız Haritası Paketi
          </h3>
          <span className="text-base font-bold text-[#9A7432] tabular-nums">₺250,00</span>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed text-[#57534E] mb-4">
          Seçtiğiniz tarih, konum ve kişisel mesajınızla hazırlanan yüksek çözünürlüklü dijital paket <strong className="text-[#141413] font-semibold tabular-nums">250 TL</strong> ücrete tabidir. Tek ödemeyle hem <strong>300 DPI PNG</strong> hem de <strong>Vektörel SVG</strong> formatlarını indirebilirsiniz.
        </p>

        {/* Format Selection */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#141413] mb-2">
            Tercih Edilen İndirme Seçeneği:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setDownloadFormat('both')}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                downloadFormat === 'both'
                  ? 'bg-[#FAF8F5] border-[#141413] ring-1 ring-[#141413] text-[#141413] font-semibold'
                  : 'bg-white border-[#E5E0D5] text-[#6E6A63] hover:text-[#141413]'
              }`}
            >
              <Download className="w-4 h-4 mb-1 text-[#9A7432]" />
              <div className="font-medium whitespace-nowrap">PNG + SVG</div>
              <div className="text-[10px] text-[#6E6A63] whitespace-nowrap">Tam Paket</div>
            </button>

            <button
              type="button"
              onClick={() => setDownloadFormat('svg')}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                downloadFormat === 'svg'
                  ? 'bg-[#FAF8F5] border-[#141413] ring-1 ring-[#141413] text-[#141413] font-semibold'
                  : 'bg-white border-[#E5E0D5] text-[#6E6A63] hover:text-[#141413]'
              }`}
            >
              <Sparkles className="w-4 h-4 mb-1 text-[#9A7432]" />
              <div className="font-medium whitespace-nowrap">Vektörel SVG</div>
              <div className="text-[10px] text-[#6E6A63] whitespace-nowrap">Kayıpsız Vektör</div>
            </button>

            <button
              type="button"
              onClick={() => setDownloadFormat('poster')}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                downloadFormat === 'poster'
                  ? 'bg-[#FAF8F5] border-[#141413] ring-1 ring-[#141413] text-[#141413] font-semibold'
                  : 'bg-white border-[#E5E0D5] text-[#6E6A63] hover:text-[#141413]'
              }`}
            >
              <FileImage className="w-4 h-4 mb-1 text-[#9A7432]" />
              <div className="font-medium whitespace-nowrap">Özel Poster</div>
              <div className="text-[10px] text-[#6E6A63] whitespace-nowrap">300 DPI PNG</div>
            </button>

            <button
              type="button"
              onClick={() => setDownloadFormat('map-only')}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                downloadFormat === 'map-only'
                  ? 'bg-[#FAF8F5] border-[#141413] ring-1 ring-[#141413] text-[#141413] font-semibold'
                  : 'bg-white border-[#E5E0D5] text-[#6E6A63] hover:text-[#141413]'
              }`}
            >
              <Layers className="w-4 h-4 mb-1 text-[#9A7432]" />
              <div className="font-medium whitespace-nowrap">Saf Harita</div>
              <div className="text-[10px] text-[#6E6A63] whitespace-nowrap">Sadece Küre</div>
            </button>
          </div>
        </div>

        {/* Status Message Box */}
        <div
          className={`min-h-[22px] text-xs p-3 rounded-xl mb-4 flex items-center gap-2 ${
            isError
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-[#FAF8F5] border border-[#E5E0D5] text-[#3F3C38]'
          }`}
        >
          {isPaid && <CheckCircle2 className="w-4 h-4 text-[#9A7432] shrink-0" />}
          <span>{status}</span>
        </div>

        {/* Payment Row */}
        {!isPaid && !pendingCode && (
          <div className="mb-3">
            <button
              type="button"
              disabled={loading}
              onClick={handleSimulatePayment}
              className="w-full py-3.5 px-4 rounded-xl bg-[#141413] hover:bg-[#292826] text-white font-semibold text-sm disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-2 tabular-nums"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Ödeme Alınıyor…</span>
                </>
              ) : (
                <>
                  <span>Dijital Paketi Satın Al –</span>
                  <span className="font-bold text-[#D4AF37]">₺250,00</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Code Input Row */}
        {!isPaid && pendingCode && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-[#57534E] mb-1">
              Ödeme Sonrası Verilen Lisans Kodu:
            </label>
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Ödeme sonrası verilen kod"
              maxLength={20}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D6D1C7] bg-[#FAF8F5] text-[#141413] text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-[#141413] transition"
            />
          </div>
        )}

        {/* Download Buttons (Once Paid / Unlocked) */}
        {canDownload && (
          <div className="space-y-2.5 mb-2">
            <button
              type="button"
              disabled={downloading}
              onClick={() => executeDownload(downloadFormat)}
              className="w-full py-3.5 px-4 rounded-xl bg-[#141413] hover:bg-[#292826] text-white font-semibold text-sm transition cursor-pointer flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Dosyalar Hazırlanıyor…</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    {downloadFormat === 'both'
                      ? 'PNG + Vektörel SVG İkisini Birden İndir'
                      : downloadFormat === 'svg'
                      ? 'Vektörel SVG Olarak İndir (.svg)'
                      : downloadFormat === 'poster'
                      ? '300 DPI Özel Posteri İndir (.png)'
                      : 'Saf Harita PNG Olarak İndir (.png)'}
                  </span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={downloading}
                onClick={() => executeDownload('svg')}
                className="py-2.5 px-3 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#D6D1C7] text-[#141413] text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9A7432]" />
                <span>Sadece SVG İndir</span>
              </button>
              <button
                type="button"
                disabled={downloading}
                onClick={() => executeDownload('poster')}
                className="py-2.5 px-3 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#D6D1C7] text-[#141413] text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FileImage className="w-3.5 h-3.5 text-[#9A7432]" />
                <span>Sadece PNG İndir</span>
              </button>
            </div>
          </div>
        )}

        {/* Guarantees */}
        <div className="mt-4 pt-4 border-t border-[#F0ECE3] flex items-center justify-between text-[11px] text-[#6E6A63]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#9A7432]" />
            <span>300 DPI PNG + Vektörel SVG · Sınırsız İndirme</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#57534E] hover:text-[#141413] underline cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
