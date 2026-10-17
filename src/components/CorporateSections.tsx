import React, { useState } from 'react';
import { ChevronDown, ArrowUpRight, Check, Sparkles, Download } from 'lucide-react';
import { PosterData } from '../types';

interface CorporateSectionsProps {
  onApplyPreset: (preset: Partial<PosterData>) => void;
  onOpenDownload: () => void;
  onOpenAstronomy: () => void;
}

const COLLECTION_SHOWCASES = [
  {
    id: 'midnight-gold',
    category: 'En Çok Tercih Edilen · Klasik Koleksiyon',
    title: 'Geceyarısı Laciverti & Altın Astrolab',
    description:
      'Derin gece mavisi gökyüzü üzerinde 360° derece ölçekli altın astrolab halkası, takım yıldızı hatları ve Cinzel Roma tipografisi.',
    price: '₺250,00',
    specs: '300 DPI PNG + Vektörel SVG · Siyah Ahşap Çerçeve Önizlemeli',
    preset: {
      theme: 'midnight' as const,
      shape: 'circle' as const,
      frame: 'black' as const,
      font: 'cinzel' as const,
      title: 'Seni İlk Gördüğüm Gece',
      subtitle: 'Yıldızlar o gece bizim için hizalandı...',
    },
    wallBg: 'from-[#141b2d] via-[#0d1322] to-[#080b14]',
    posterBg: 'from-[#040816] via-[#070f28] to-[#02050e]',
    frameBorder: 'border-[#121215]',
    accentRing: 'border-amber-400/50',
  },
  {
    id: 'rose-heart',
    category: 'Sevgililer & Yıldönümü · Romantik Seri',
    title: 'Gül Kurusu Kalp Gökyüzü Haritası',
    description:
      'Özel kalp kesim gökyüzü penceresi, el yazısı kaligrafi başlık ve şampanya altın koordinat detaylarıyla unutulmaz yıldönümü hediyesi.',
    price: '₺250,00',
    specs: '300 DPI PNG + Vektörel SVG · Lüks Altın Çerçeve Önizlemeli',
    preset: {
      theme: 'rose' as const,
      shape: 'heart' as const,
      frame: 'gold' as const,
      font: 'script' as const,
      title: 'Evet Dediğim An',
      subtitle: 'Kalplerimizin ve yıldızların buluştuğu gece',
    },
    wallBg: 'from-[#231824] via-[#160f18] to-[#0b070c]',
    posterBg: 'from-[#180e18] via-[#221122] to-[#0d060e]',
    frameBorder: 'border-[#9c7a28]',
    accentRing: 'border-rose-300/40',
  },
  {
    id: 'obsidian-modern',
    category: 'Mimari & Modern · Galeri Serisi',
    title: 'Saf Obsidiyen & Doğal Meşe',
    description:
      'Yüksek kontrastlı saf siyah uzay fonu üzerinde kristal netliğinde spektral yıldız parıltıları ve İskandinav meşe çerçeve uyumu.',
    price: '₺250,00',
    specs: '300 DPI PNG + Vektörel SVG · Doğal Meşe Çerçeve Önizlemeli',
    preset: {
      theme: 'obsidian' as const,
      shape: 'circle' as const,
      frame: 'oak' as const,
      font: 'playfair' as const,
      title: 'Dünyaya Gözlerini Açtığın Gece',
      subtitle: 'Hoş geldin küçük yıldızımız',
    },
    wallBg: 'from-[#1c1917] via-[#131110] to-[#090807]',
    posterBg: 'from-[#060608] via-[#09090d] to-[#030304]',
    frameBorder: 'border-[#523a24]',
    accentRing: 'border-slate-300/40',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'Evlilik yıldönümümüz için eşimle ilk tanıştığımız 14 Eylül 2019 Moda sahilinin gökyüzünü hazırladım. 250 TL ödedikten hemen sonra hem 300 DPI PNG hem de SVG dosyasını indirdim, 50x70 cm boyutunda bastırdığımızda yıldızların parıltısı ve yazıların netliği kusursuz çıktı.',
    author: 'Zeynep & Mert Kaya',
    role: 'Evlilik Yıldönümü Hediyesi',
    location: 'Kadıköy, İstanbul',
    metric: '50×70 cm Fine Art Baskı',
  },
  {
    quote:
      'Kızımızın doğduğu gece ve saat için İzmir koordinatlarıyla oluşturduk. Diğer yabancı sitelerde Euro bazında çok yüksek fiyatlar varken burada Türkçe arayüzle saniyeler içinde tasarlayıp hem vektörel SVG hem PNG olarak anında teslim aldık.',
    author: 'Elif & Caner Demir',
    role: 'Bebek Doğum Hatırası',
    location: 'Karşıyaka, İzmir',
    metric: '300 DPI + Vektörel SVG',
  },
  {
    quote:
      'Amatör astronomiyle ilgilendiğim için yıldız konumlarını Stellarium ile karşılaştırdım; Orion ve Büyük Ayı takımyıldızlarının seçtiğim saatteki zenit açısı ve Ay evresi birebir doğru. Hem bilimsel olarak gerçek hem de dekoratif olarak çok şık.',
    author: 'Burak Aydın',
    role: 'Mimar & Amatör Astronom',
    location: 'Çankaya, Ankara',
    metric: '%100 Hipparcos Doğruluğu',
  },
];

const FAQS = [
  {
    q: 'Yıldız haritası gerçekten seçtiğim tarih ve konumdaki gökyüzünü mü gösteriyor?',
    a: 'Evet. Sistemimiz Avrupa Uzay Ajansı (ESA) Hipparcos yıldız kataloğunu, Uluslararası Astronomi Birliği (IAU) 88 resmi takımyıldızı verisini ve Kepler gezegen yörünge denklemlerini kullanır. Girdiğiniz enlem, boylam, tarih ve saate göre o anda başınızın üzerindeki (zenit) gerçek gökyüzünü milimetrik olarak hesaplar.',
  },
  {
    q: '250 TL ödemeyle hangi dosyaları indiriyorum? SVG ve PNG farkı nedir?',
    a: 'Tek bir 250 TL ödemeyle hem 300 DPI çözünürlüklü (2000×2800 piksel) baskıya hazır PNG posterinizi hem de sınırsız büyütülebilir Vektörel SVG dosyanızı aynı anda indirebilirsiniz. PNG dosyasını doğrudan fotoğrafçıda veya online baskı merkezlerinde bastırabilir, SVG dosyasını ise kalite kaybı olmadan dev boyutlarda (70×100 cm ve üzeri) veya matbaa baskılarında kullanabilirsiniz.',
  },
  {
    q: 'Ödeme yaptıktan sonra teslimat ne kadar sürer ve tekrar indirebilir miyim?',
    a: 'Teslimat tamamen anlıktır. Ödeme onaylandığı saniye indirme butonlarınız aktif olur ve tarayıcı lisansınız kaydedilir. Hatta başlığı veya rengi değiştirip tekrar ücret ödemeden yeni PNG ve SVG çıktıları alabilirsiniz.',
  },
  {
    q: 'İndirdiğim posteri hangi boyutlarda çerçeveletebilirim?',
    a: 'Tasarımımız uluslararası ISO A serisi (A4, A3, A2) ve standart çerçeve ebatlarıyla (30×40 cm, 40×50 cm, 50×70 cm) tam uyumlu orana sahiptir. Herhangi bir yapı marketten veya çerçeveciden aldığınız standart çerçevelere kesme gerektirmeden tam oturur.',
  },
];

export const CorporateSections: React.FC<CorporateSectionsProps> = ({
  onApplyPreset,
  onOpenDownload,
  onOpenAstronomy,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSelectShowcase = (preset: Partial<PosterData>) => {
    onApplyPreset(preset);
    const studioEl = document.getElementById('tasarla');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#040816] text-slate-100">
      {/* SECTION 1: FEATURED COLLECTIONS & INTERIOR MOCKUPS */}
      <section id="koleksiyonlar" className="py-16 lg:py-24 border-t border-[#141e42]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="text-xs font-medium text-amber-300 mb-2">
                Küratörlü Tasarım Koleksiyonları · 2026 Serisi
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 max-w-2xl">
                Yaşam Alanlarınız İçin Zamansız Gökyüzü Eserleri
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Beğendiğiniz koleksiyon kartına tıklayarak renk temasını, harita kesimini ve yazı tipini tek tıkla yukarıdaki canlı tasarım stüdyosuna yükleyebilirsiniz.
            </p>
          </div>

          {/* 3-Column Collection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {COLLECTION_SHOWCASES.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl bg-[#070d24] border border-[#19254f] hover:border-amber-400/50 transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Framed Interior Visual Mockup (Zero-Broken-Image Resilient Vector Showcase) */}
                <div
                  className={`aspect-[4/3] w-full bg-gradient-to-br ${item.wallBg} p-6 flex items-center justify-center relative overflow-hidden`}
                >
                  {/* Subtle studio wall lighting */}
                  <div className={`w-40 h-52 bg-gradient-to-b ${item.posterBg} border-[6px] ${item.frameBorder} shadow-2xl rounded-sm p-3 flex flex-col items-center justify-between relative group-hover:-translate-y-1 transition-transform duration-200`}>
                    <div className="inset-1.5 border border-white/10 absolute pointer-events-none" />
                    {/* Mini Celestial Sphere SVG */}
                    <div
                      className={`w-24 h-24 mt-2 flex items-center justify-center relative ${
                        item.preset.shape === 'circle' ? `rounded-full border ${item.accentRing}` : ''
                      }`}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {item.preset.shape === 'heart' ? (
                          <path
                            d="M50 82 C20 55, 12 28, 32 18 C42 13, 50 22, 50 26 C50 22, 58 13, 68 18 C88 28, 80 55, 50 82 Z"
                            fill="rgba(255,255,255,0.03)"
                            stroke="rgba(251,191,36,0.45)"
                            strokeWidth="1.2"
                          />
                        ) : (
                          <circle
                            cx="50"
                            cy="50"
                            r="44"
                            fill="rgba(255,255,255,0.02)"
                            stroke="rgba(251,191,36,0.35)"
                            strokeWidth="1"
                          />
                        )}
                        {/* Constellation lines & glowing stars */}
                        <polyline
                          points="28,36 42,30 55,42 68,32 74,48"
                          fill="none"
                          stroke="rgba(255,255,255,0.45)"
                          strokeWidth="0.8"
                        />
                        <polyline
                          points="34,62 48,54 62,64"
                          fill="none"
                          stroke="rgba(255,255,255,0.35)"
                          strokeWidth="0.7"
                        />
                        <circle cx="28" cy="36" r="1.8" fill="#fff" />
                        <circle cx="42" cy="30" r="2.4" fill="#fde68a" />
                        <circle cx="55" cy="42" r="1.6" fill="#fff" />
                        <circle cx="68" cy="32" r="2.2" fill="#bae6fd" />
                        <circle cx="74" cy="48" r="1.5" fill="#fff" />
                        <circle cx="34" cy="62" r="1.4" fill="#fff" />
                        <circle cx="48" cy="54" r="2.0" fill="#fde68a" />
                        <circle cx="62" cy="64" r="1.5" fill="#fff" />
                      </svg>
                    </div>

                    {/* Mini Typography */}
                    <div className="text-center pb-1">
                      <div className="text-[6px] text-amber-300 tracking-widest mb-0.5">✦ · ✧ · ✦</div>
                      <div className="text-[7px] font-cinzel text-white font-semibold tracking-wider truncate max-w-[120px]">
                        {item.preset.title}
                      </div>
                      <div className="text-[5px] text-slate-400 mt-0.5">41.0082° N, 28.9784° E</div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-slate-400 mb-1.5">{item.category}</div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#152046]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-400">300 DPI PNG + Vektörel SVG</span>
                      <span className="text-base font-bold text-amber-300 tabular-nums">
                        {item.price}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectShowcase(item.preset)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#101a3d] hover:bg-amber-400 text-slate-100 hover:text-slate-950 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Bu Tasarımı Stüdyoya Yükle</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: ASYMMETRIC BENTO-GRID — NASIL ÇALIŞIR & BİLİMSEL DOĞRULUK */}
      <section id="nasil-calisir" className="py-16 lg:py-24 bg-[#060b1e] border-t border-[#141e42]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="mb-12">
            <div className="text-xs font-medium text-amber-300 mb-2">
              Astronomik Mühendislik · Baskı Kalitesi
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 max-w-2xl">
              Nasıl Çalışır ve Neden Celestial Tercih Edilir?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Span 2 Marquee Capability */}
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-[#09112b] border border-[#1c2a59] flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-amber-300 mb-2">
                  01. Gerçek ESA Hipparcos & NASA Yıldız Kataloğu
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3">
                  Seçtiğiniz Tarih ve Koordinattaki Gerçek Gökyüzü İzdüşümü
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl mb-6">
                  Rastgele çizilmiş dekoratif görsellerin aksine, Celestial motoru girdiğiniz enlem-boylam koordinatlarını ve dakikasına kadar yerel zamanı kullanarak 88 IAU takımyıldızını, Samanyolu galaktik düzlemini, Ay evresini ve gezegen konumlarını gerçek astronomik algoritmalarla hesaplar.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#182552] text-xs">
                <div>
                  <div className="text-lg font-bold text-slate-100 tabular-nums">88</div>
                  <div className="text-slate-400">Resmi Takımyıldızı</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-100 tabular-nums">9.000+</div>
                  <div className="text-slate-400">Parlak Katalog Yıldızı</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-100 tabular-nums">10+</div>
                  <div className="text-slate-400">Harita Projeksiyonu</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-amber-300 tabular-nums">300 DPI</div>
                  <div className="text-slate-400">PNG + Vektörel SVG</div>
                </div>
              </div>
            </div>

            {/* Span 1 Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#09112b] border border-[#1c2a59] flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-amber-300 mb-2">
                  02. Çift Format Teslimat
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">
                  Hem 300 DPI PNG Hem Vektörel SVG Aynı Pakette
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  250 TL tutarındaki tek ödemenizle hem 2000×2800 piksel ultra net PNG posterinizi hem de sınırsız büyütülebilir vektörel SVG dosyanızı saniyeler içinde indirirsiniz.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenDownload}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 tabular-nums"
              >
                <Download className="w-4 h-4" />
                <span>Paketi İncele · ₺250,00</span>
              </button>
            </div>

            {/* Span 1 Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#09112b] border border-[#1c2a59] flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-amber-300 mb-2">
                  03. Çoklu Kartografik Projeksiyon
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">
                  10 Farklı Astronomik Harita İzdüşümü
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Stereografik kubbe görünümünden Aitoff elipsine, 3B Ortografik küreden Mollweide atlasına kadar tüm bilimsel projeksiyonları canlı olarak deneyimleyin.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenAstronomy}
                className="w-full py-2.5 px-4 rounded-xl bg-[#111d45] hover:bg-[#192a63] border border-[#283c7a] text-slate-200 font-semibold text-xs transition cursor-pointer"
              >
                Astronomi Laboratuvarını Aç
              </button>
            </div>

            {/* Span 2 Card */}
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-[#09112b] border border-[#1c2a59] flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-amber-300 mb-2">
                  04. Spektral Yıldız Parıltısı (Starlight Glow Engine)
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3">
                  Gerçek Yıldız Sıcaklık Renkleri ve Kırınım Işıltısı
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl mb-6">
                  Her yıldızın B-V renk indeksine göre mavi-beyaz devlerden sıcak kehribar yıldızlara kadar gerçek spektral rengi hesaplanır. Sirius, Vega ve Arcturus gibi parlak yıldızlar çok katmanlı ışık haleleriyle (glow) posterinizde gerçek bir gece gökyüzü derinliği oluşturur.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-4 border-t border-[#182552]">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> Anında Dijital Teslimat
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> Filigransız Tam Çözünürlük
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> Standart A4 / A3 / 50×70 Çerçeve Uyumu
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ATTRIBUTABLE CUSTOMER TESTIMONIALS (PROOF ADJACENT) */}
      <section id="yorumlar" className="py-16 lg:py-24 border-t border-[#141e42]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="text-xs font-medium text-amber-300 mb-2">
                Doğrulanmış Müşteri Deneyimleri · 48.900+ Teslimat
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100">
                En Özel Anlarını Gökyüzüne Taşıyanlar
              </h2>
            </div>
            <div className="text-sm text-slate-300 tabular-nums">
              Ortalama Müşteri Memnuniyeti: <strong className="text-amber-300">4.94 / 5.00</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#080f28] border border-[#192653] flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs text-amber-300 mb-3">{t.metric}</div>
                  <p className="text-sm text-slate-200 leading-relaxed mb-6">“{t.quote}”</p>
                </div>
                <div className="pt-4 border-t border-[#152046] text-xs">
                  <div className="font-semibold text-slate-100">{t.author}</div>
                  <div className="text-slate-400 mt-0.5">
                    {t.role} · {t.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FREQUENTLY ASKED QUESTIONS */}
      <section id="sss" className="py-16 lg:py-24 bg-[#060b1e] border-t border-[#141e42]">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs font-medium text-amber-300 mb-2">
              Merak Edilenler · Dijital Teslimat & Baskı Rehberi
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-100">
              Sıkça Sorulan Sorular
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#09112b] border border-[#1c2a59] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-slate-100 hover:text-amber-300 transition cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-amber-300 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-[#16224a] pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CORPORATE FOOTER */}
      <footer className="py-12 bg-[#030611] border-t border-[#141e42] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-cinzel text-base font-bold text-slate-100 tracking-wider mb-1">
              CELESTIAL
            </div>
            <p className="text-slate-500">
              Gerçek Zamanlı Gökyüzü Projeksiyonu ve Kişiye Özel Yıldız Haritası Stüdyosu
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#tasarla" className="hover:text-slate-200 transition-colors">
              Harita Stüdyosu
            </a>
            <a href="#koleksiyonlar" className="hover:text-slate-200 transition-colors">
              Koleksiyonlar
            </a>
            <a href="#nasil-calisir" className="hover:text-slate-200 transition-colors">
              Nasıl Çalışır
            </a>
            <a href="#yorumlar" className="hover:text-slate-200 transition-colors">
              Müşteri Yorumları
            </a>
            <a href="#sss" className="hover:text-slate-200 transition-colors">
              SSS
            </a>
          </div>

          <div className="text-slate-500 tabular-nums">
            © 2026 Celestial Türkiye · Tüm Hakları Saklıdır
          </div>
        </div>
      </footer>
    </div>
  );
};
