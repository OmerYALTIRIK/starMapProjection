import React, { useState } from 'react';
import { ChevronDown, ArrowUpRight, Check, Download } from 'lucide-react';
import { PosterData } from '../types';

interface CorporateSectionsProps {
  onApplyPreset: (preset: Partial<PosterData>) => void;
  onOpenDownload: () => void;
  onOpenAstronomy: () => void;
}

const COLLECTION_SHOWCASES = [
  {
    id: 'gallery-white-oak',
    category: 'İskandinav Galeri Serisi · En Çok Satan',
    title: 'Galeri Beyazı & Doğal Meşe Çerçeve',
    description:
      'Sıcak müze pamuk kağıdı üzerinde derin gece mavisi gökyüzü küresi, zarif astrolab derece halkası ve doğal İskandinav meşe çerçeve uyumu.',
    price: '₺250,00',
    preset: {
      theme: 'classic-white' as const,
      shape: 'circle' as const,
      frame: 'oak' as const,
      font: 'cinzel' as const,
      title: 'Seni İlk Gördüğüm Gece',
      subtitle: 'Yıldızlar o gece bizim için hizalandı',
    },
    wallGradient: 'from-[#EDE8DF] via-[#E5DFD4] to-[#DCD4C6]',
    paperClass: 'bg-[#FAF8F5] text-[#141413]',
    skyFill: '#0B1528',
    frameBorder: 'border-[#9C7A54]',
    isLightPaper: true,
  },
  {
    id: 'midnight-black',
    category: 'Klasik Koleksiyon · The Night Sky Ekolü',
    title: 'Klasik Gece Mavisi & Mat Siyah',
    description:
      'Kraliyet gece laciverti zemin üzerinde 360° altın astrolab kadranı, 88 IAU takımyıldızı hatları ve modern mat siyah çerçeve kontrastı.',
    price: '₺250,00',
    preset: {
      theme: 'midnight' as const,
      shape: 'circle' as const,
      frame: 'black' as const,
      font: 'playfair' as const,
      title: 'Yıldızların Altında',
      subtitle: 'Sonsuz evrende bizim hikayemiz başladı',
    },
    wallGradient: 'from-[#E8E4DC] via-[#DFDAD0] to-[#D4CEC2]',
    paperClass: 'bg-[#0B1528] text-[#FAF8F5]',
    skyFill: '#070E1C',
    frameBorder: 'border-[#18181B]',
    isLightPaper: false,
  },
  {
    id: 'rose-heart-gold',
    category: 'Yıldönümü & Sevgililer · Özel Seri',
    title: 'Vintage Bordo & Kalp Kesim Harita',
    description:
      'Özel kalp kesim gökyüzü penceresi, el yazısı kaligrafi başlık ve şampanya altın pirinç çerçeve ile unutulmaz yıldönümü hatırası.',
    price: '₺250,00',
    preset: {
      theme: 'rose' as const,
      shape: 'heart' as const,
      frame: 'gold' as const,
      font: 'script' as const,
      title: 'Evet Dediğim An',
      subtitle: 'Kalplerimizin ve yıldızların buluştuğu gece',
    },
    wallGradient: 'from-[#EFEAE2] via-[#E6E0D6] to-[#DDD5C7]',
    paperClass: 'bg-[#241016] text-[#FAF8F5]',
    skyFill: '#18090E',
    frameBorder: 'border-[#B69146]',
    isLightPaper: false,
  },
];

const TESTIMONIALS = [
  {
    quote:
      'Evlilik yıldönümümüz için eşimle ilk tanıştığımız 14 Eylül 2019 Moda sahilinin gökyüzünü Galeri Beyazı temasıyla hazırladım. 250 TL ödedikten hemen sonra hem 300 DPI PNG hem de SVG dosyasını indirdim; 50×70 cm meşe çerçevede salonumuzun en güzel köşesi oldu.',
    author: 'Zeynep & Mert Kaya',
    role: 'Evlilik Yıldönümü Hediyesi',
    location: 'Kadıköy, İstanbul',
    metric: '50×70 cm Galeri Baskı',
  },
  {
    quote:
      'Kızımızın doğduğu gece ve saat için İzmir koordinatlarıyla oluşturduk. Yabancı sitelerde Euro bazında çok yüksek fiyatlar ve kargo bekleme süresi varken burada Türkçe arayüzle saniyeler içinde tasarlayıp hem vektörel SVG hem PNG olarak anında teslim aldık.',
    author: 'Elif & Caner Demir',
    role: 'Bebek Doğum Hatırası',
    location: 'Karşıyaka, İzmir',
    metric: '300 DPI PNG + Vektörel SVG',
  },
  {
    quote:
      'Amatör astronomiyle ilgilendiğim için yıldız konumlarını Stellarium ile karşılaştırdım; Orion ve Büyük Ayı takımyıldızlarının seçtiğim saatteki zenit açısı ve Ay evresi birebir doğru. Hem bilimsel olarak gerçek hem de çok zarif bir tasarım.',
    author: 'Burak Aydın',
    role: 'Mimar & Amatör Astronom',
    location: 'Çankaya, Ankara',
    metric: '%100 Hipparcos Doğruluğu',
  },
];

const FAQS = [
  {
    q: 'Yıldız haritası gerçekten seçtiğim tarih ve konumdaki gökyüzünü mü gösteriyor?',
    a: 'Evet. Sistemimiz Avrupa Uzay Ajansı (ESA) Hipparcos yıldız kataloğunu, Uluslararası Astronomi Birliği (IAU) 88 resmi takımyıldızı verisini ve Kepler gezegen yörünge denklemlerini kullanır. Girdiğiniz enlem, boylam, tarih ve saate göre o anda başınızın üzerindeki gerçek gökyüzünü milimetrik olarak hesaplar.',
  },
  {
    q: '250 TL ödemeyle hangi dosyaları indiriyorum? SVG ve PNG farkı nedir?',
    a: 'Tek bir 250 TL ödemeyle hem 300 DPI çözünürlüklü (2000×2800 piksel) baskıya hazır PNG posterinizi hem de sınırsız büyütülebilir Vektörel SVG dosyanızı aynı anda indirebilirsiniz. PNG dosyasını doğrudan fotoğrafçıda veya online baskı merkezlerinde bastırabilir, SVG dosyasını ise kalite kaybı olmadan dev boyutlarda (70×100 cm ve üzeri) kullanabilirsiniz.',
  },
  {
    q: 'Ödeme yaptıktan sonra teslimat ne kadar sürer ve tekrar indirebilir miyim?',
    a: 'Teslimat tamamen anlıktır. Ödeme onaylandığı saniye indirme butonlarınız aktif olur ve tarayıcı lisansınız kaydedilir. Hatta başlığı, çerçeveyi veya poster rengini değiştirip tekrar ücret ödemeden yeni PNG ve SVG çıktıları alabilirsiniz.',
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
    <div className="bg-[#FAF8F5] text-[#141413]">
      {/* SECTION 1: CURATED GALLERY COLLECTIONS */}
      <section id="koleksiyonlar" className="py-20 lg:py-24 border-t border-[#E5E0D5]">
        <div className="max-w-[1380px] mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="text-xs font-semibold text-[#9A7432] mb-2">
                Küratörlü Tasarım Koleksiyonları · 2026 Galeri Serisi
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-[#141413] max-w-2xl">
                İç Mekanlarınız İçin Zamansız Gökyüzü Eserleri
              </h2>
            </div>
            <p className="text-sm text-[#57534E] max-w-md leading-relaxed">
              Beğendiğiniz koleksiyon kartına tıklayarak renk paletini, harita kesimini ve tipografiyi tek tıkla yukarıdaki canlı tasarım stüdyosuna uygulayabilirsiniz.
            </p>
          </div>

          {/* 3-Column Collection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {COLLECTION_SHOWCASES.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl bg-white border border-[#E5E0D5] hover:border-[#B8AFA0] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Sunlit Interior Wall & Framed Poster Mockup */}
                <div
                  className={`aspect-[4/3] w-full bg-gradient-to-br ${item.wallGradient} p-6 flex items-center justify-center relative overflow-hidden`}
                >
                  {/* Subtle window light beam */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(125deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%, rgba(0,0,0,0.05) 100%)',
                    }}
                  />

                  {/* Framed Poster on Wall */}
                  <div
                    className={`w-44 h-60 ${item.paperClass} border-[7px] ${item.frameBorder} shadow-[0_20px_40px_-10px_rgba(20,20,19,0.35)] p-3.5 flex flex-col items-center justify-between relative group-hover:-translate-y-1 transition-transform duration-200`}
                  >
                    <div
                      className={`inset-1.5 border absolute pointer-events-none ${
                        item.isLightPaper ? 'border-[#141413]/15' : 'border-white/15'
                      }`}
                    />
                    {/* Mini Celestial Sphere SVG */}
                    <div className="w-28 h-28 mt-1.5 flex items-center justify-center relative">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {item.preset.shape === 'heart' ? (
                          <path
                            d="M50 84 C18 56, 10 28, 31 17 C42 12, 50 21, 50 26 C50 21, 58 12, 69 17 C90 28, 82 56, 50 84 Z"
                            fill={item.skyFill}
                            stroke="#D4AF37"
                            strokeWidth="1.2"
                          />
                        ) : (
                          <>
                            <circle
                              cx="50"
                              cy="50"
                              r="46"
                              fill="none"
                              stroke={item.isLightPaper ? 'rgba(20,20,19,0.28)' : 'rgba(212,175,55,0.4)'}
                              strokeWidth="0.6"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="43"
                              fill={item.skyFill}
                              stroke={item.isLightPaper ? 'rgba(20,20,19,0.4)' : 'rgba(212,175,55,0.5)'}
                              strokeWidth="0.9"
                            />
                          </>
                        )}
                        {/* Constellation lines & glowing stars */}
                        <polyline
                          points="28,36 42,30 55,42 68,32 74,48"
                          fill="none"
                          stroke="rgba(255,255,255,0.55)"
                          strokeWidth="0.7"
                        />
                        <polyline
                          points="34,62 48,54 62,64"
                          fill="none"
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth="0.6"
                        />
                        <circle cx="28" cy="36" r="1.5" fill="#fff" />
                        <circle cx="42" cy="30" r="2.2" fill="#FDE68A" />
                        <circle cx="55" cy="42" r="1.4" fill="#fff" />
                        <circle cx="68" cy="32" r="2.0" fill="#BAE6FD" />
                        <circle cx="74" cy="48" r="1.3" fill="#fff" />
                        <circle cx="34" cy="62" r="1.3" fill="#fff" />
                        <circle cx="48" cy="54" r="1.9" fill="#FDE68A" />
                        <circle cx="62" cy="64" r="1.4" fill="#fff" />
                      </svg>
                    </div>

                    {/* Mini Typography */}
                    <div className="text-center pb-0.5">
                      <div className="text-[5px] text-[#9A7432] tracking-widest mb-0.5">✦ · ✧ · ✦</div>
                      <div
                        className={`text-[7.5px] font-cinzel font-bold tracking-wider truncate max-w-[130px] ${
                          item.isLightPaper ? 'text-[#141413]' : 'text-white'
                        }`}
                      >
                        {item.preset.title}
                      </div>
                      <div
                        className={`text-[5px] mt-0.5 font-mono ${
                          item.isLightPaper ? 'text-[#57534E]' : 'text-slate-300'
                        }`}
                      >
                        41.0082° N, 28.9784° E
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-[#6E6A63] mb-1.5">{item.category}</div>
                    <h3 className="text-lg font-semibold text-[#141413] mb-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mb-5">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F0ECE3]">
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="text-xs text-[#6E6A63]">300 DPI PNG + Vektörel SVG</span>
                      <span className="text-base font-bold text-[#141413] tabular-nums">
                        {item.price}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectShowcase(item.preset)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#141413] text-[#141413] hover:text-white border border-[#D6D1C7] hover:border-[#141413] font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
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

      {/* SECTION 2: ASYMMETRIC BENTO-GRID — ASTRONOMİK DOĞRULUK & BASKI KALİTESİ */}
      <section id="kalite" className="py-20 lg:py-24 bg-[#F3EFEA] border-t border-[#E5E0D5]">
        <div className="max-w-[1380px] mx-auto px-4 lg:px-8">
          <div className="mb-12">
            <div className="text-xs font-semibold text-[#9A7432] mb-2">
              Bilimsel Hassasiyet · Müzeler Standartında Tasarım
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-[#141413] max-w-2xl">
              Neden Celestial Yıldız Haritası Tercih Edilir?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Span 2 Marquee Card */}
            <div className="lg:col-span-2 p-7 sm:p-9 rounded-2xl bg-white border border-[#E5E0D5] flex flex-col justify-between shadow-sm">
              <div>
                <div className="text-xs font-semibold text-[#9A7432] mb-2">
                  01. Gerçek ESA Hipparcos & NASA Yıldız Kataloğu
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#141413] mb-3">
                  Seçtiğiniz Tarih ve Koordinattaki Gerçek Gökyüzü İzdüşümü
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed max-w-2xl mb-6">
                  Rastgele çizilmiş dekoratif görsellerin aksine, Celestial motoru girdiğiniz enlem-boylam koordinatlarını ve dakikasına kadar yerel zamanı kullanarak 88 IAU takımyıldızını, Samanyolu galaktik düzlemini, Ay evresini ve gezegen konumlarını gerçek astronomik algoritmalarla hesaplar.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#F0ECE3] text-xs">
                <div>
                  <div className="text-xl font-bold text-[#141413] tabular-nums">88</div>
                  <div className="text-[#6E6A63] mt-0.5">Resmi Takımyıldızı</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#141413] tabular-nums">9.000+</div>
                  <div className="text-[#6E6A63] mt-0.5">Katalog Yıldızı</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#141413] tabular-nums">10+</div>
                  <div className="text-[#6E6A63] mt-0.5">Harita Projeksiyonu</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#9A7432] tabular-nums">300 DPI</div>
                  <div className="text-[#6E6A63] mt-0.5">PNG + Vektörel SVG</div>
                </div>
              </div>
            </div>

            {/* Span 1 Card */}
            <div className="p-7 sm:p-9 rounded-2xl bg-[#141413] text-[#FAF8F5] flex flex-col justify-between shadow-sm">
              <div>
                <div className="text-xs font-semibold text-[#D4AF37] mb-2">
                  02. Çift Format Teslimat
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Hem 300 DPI PNG Hem Vektörel SVG Aynı Pakette
                </h3>
                <p className="text-sm text-[#D6D1C7] leading-relaxed mb-6">
                  250 TL tutarındaki tek ödemenizle hem 2000×2800 piksel ultra net PNG posterinizi hem de sınırsız büyütülebilir vektörel SVG dosyanızı saniyeler içinde indirirsiniz.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenDownload}
                className="w-full py-3 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#E5E0D5] text-[#141413] font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 tabular-nums"
              >
                <Download className="w-4 h-4 text-[#9A7432]" />
                <span>Paketi İncele · ₺250,00</span>
              </button>
            </div>

            {/* Span 1 Card */}
            <div className="p-7 sm:p-9 rounded-2xl bg-white border border-[#E5E0D5] flex flex-col justify-between shadow-sm">
              <div>
                <div className="text-xs font-semibold text-[#9A7432] mb-2">
                  03. Çoklu Kartografik Projeksiyon
                </div>
                <h3 className="text-xl font-bold text-[#141413] mb-3">
                  10 Farklı Astronomik Harita İzdüşümü
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed mb-6">
                  Stereografik kubbe görünümünden Aitoff elipsine, 3B Ortografik küreden Mollweide atlasına kadar tüm bilimsel projeksiyonları canlı olarak deneyimleyin.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenAstronomy}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#141413] border border-[#D6D1C7] hover:border-[#141413] text-[#141413] hover:text-white font-semibold text-xs transition cursor-pointer"
              >
                Astronomi Laboratuvarını Aç
              </button>
            </div>

            {/* Span 2 Card */}
            <div className="lg:col-span-2 p-7 sm:p-9 rounded-2xl bg-white border border-[#E5E0D5] flex flex-col justify-between shadow-sm">
              <div>
                <div className="text-xs font-semibold text-[#9A7432] mb-2">
                  04. Fine-Art Galeri Standartları
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#141413] mb-3">
                  Her Çerçeve Boyutuna ve İç Mekana Kusursuz Uyum
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed max-w-2xl mb-6">
                  İster klasik İskandinav tarzı Galeri Beyazı kağıt üzerine lacivert küre, ister tam sayfa Geceyarısı Laciverti veya Saf Mermer Siyah seçin; posteriniz tüm standart çerçeve ebatlarıyla (30×40 cm, 50×70 cm, A4, A3) milimetrik uyum sağlar.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-xs text-[#3F3C38] font-medium pt-4 border-t border-[#F0ECE3]">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#9A7432]" /> Anında Dijital Teslimat
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#9A7432]" /> Filigransız Tam Çözünürlük
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#9A7432]" /> Standart A4 / A3 / 50×70 Çerçeve Uyumu
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ATTRIBUTABLE CUSTOMER TESTIMONIALS */}
      <section id="yorumlar" className="py-20 lg:py-24 bg-[#FAF8F5] border-t border-[#E5E0D5]">
        <div className="max-w-[1380px] mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="text-xs font-semibold text-[#9A7432] mb-2">
                Doğrulanmış Müşteri Deneyimleri · 48.900+ Teslim Edilen Harita
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-[#141413]">
                En Özel Anlarını Gökyüzüne Taşıyanlar
              </h2>
            </div>
            <div className="text-sm text-[#57534E] tabular-nums">
              Ortalama Müşteri Memnuniyeti:{' '}
              <strong className="text-[#141413]">4.94 / 5.00</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-white border border-[#E5E0D5] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-[#9A7432] mb-3">{t.metric}</div>
                  <p className="text-sm text-[#292524] leading-relaxed mb-6">“{t.quote}”</p>
                </div>
                <div className="pt-4 border-t border-[#F0ECE3] text-xs">
                  <div className="font-semibold text-[#141413]">{t.author}</div>
                  <div className="text-[#6E6A63] mt-0.5">
                    {t.role} · {t.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FREQUENTLY ASKED QUESTIONS */}
      <section id="sss" className="py-20 lg:py-24 bg-[#F3EFEA] border-t border-[#E5E0D5]">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-[#9A7432] mb-2">
              Merak Edilenler · Dijital Teslimat & Baskı Rehberi
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#141413]">
              Sıkça Sorulan Sorular
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-white border border-[#E5E0D5] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-[#141413] hover:text-[#9A7432] transition cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#9A7432] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-[#57534E] leading-relaxed border-t border-[#F0ECE3] pt-3">
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
      <footer className="py-12 bg-[#141413] text-xs text-[#A8A29E]">
        <div className="max-w-[1380px] mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-cinzel text-base font-bold text-[#FAF8F5] tracking-[0.2em] mb-1">
              CELESTIAL
            </div>
            <p className="text-[#78716C]">
              Gerçek Zamanlı Gökyüzü Projeksiyonu ve Kişiye Özel Yıldız Haritası Stüdyosu
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#tasarla" className="hover:text-white transition-colors">
              Harita Stüdyosu
            </a>
            <a href="#koleksiyonlar" className="hover:text-white transition-colors">
              Koleksiyonlar
            </a>
            <a href="#kalite" className="hover:text-white transition-colors">
              Tasarım & Kalite
            </a>
            <a href="#yorumlar" className="hover:text-white transition-colors">
              Müşteri Yorumları
            </a>
            <a href="#sss" className="hover:text-white transition-colors">
              SSS
            </a>
          </div>

          <div className="text-[#78716C] tabular-nums">
            © 2026 Celestial Türkiye · Tüm Hakları Saklıdır
          </div>
        </div>
      </footer>
    </div>
  );
};
