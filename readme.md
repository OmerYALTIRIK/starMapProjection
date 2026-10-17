# 🌌 D3-Celestial | Kişiselleştirilmiş Yıldız Haritası & Poster Stüdyosu

> Özel anlarınızın gökyüzünü ölümsüzleştiren, gerçek zamanlı astronomi hesaplamalarına dayalı yüksek çözünürlüklü (300 DPI) kişiye özel yıldız haritası poster tasarım ve satış platformu.

---

## 🌟 Canlı Demo & Herkese Açık Bağlantı

Uygulamanın çalışan en güncel kurumsal mağaza ve canlı harita stüdyosu sürümünü doğrudan aşağıdaki herkese açık bağlantıdan deneyimleyebilirsiniz:

- **🌍 Herkese Açık Canlı Satış & Tasarım Stüdyosu (Cloudflare Tunnel):** [https://invisible-jones-locking-guidelines.trycloudflare.com](https://invisible-jones-locking-guidelines.trycloudflare.com)
- **🛠️ AI Studio Önizleme Ortamı (Oturum Açık Tarayıcı İçin):** [https://ais-dev-nsoo3mtakj24q7apzfu4dx-363237614021.europe-west1.run.app](https://ais-dev-nsoo3mtakj24q7apzfu4dx-363237614021.europe-west1.run.app)

---

## ✨ İlham Alınan Kurumsal E-Ticaret Platformları & Mimari

Bu proje, dünyanın önde gelen kişiselleştirilmiş yıldız posteri satış platformlarından ilham alınarak tam kapsamlı bir **Kurumsal E-Ticaret Mağazası + Canlı Harita Tasarım Stüdyosu** olarak yeniden inşa edilmiştir:
* [The Night Sky](https://www.thenightsky.com/)
* [Maps for Moments](https://mapsformoments.co.uk/)
* [Starry Maps](https://starrymaps.com/)
* [The Star Poster](https://thestarposter.com/editor#/)

---

## 🚀 Çözülen Hatalar ve Yapılan Geliştirmeler

1. **Yıldız Parlaklık & Işıltı (Glow) Efekti Düzeltildi:**
   - Orijinal kodda radial gradient oluşumunda tarayıcının `context.fillStyle`'ı dönüştürmesi sebebiyle saydamlık (alpha) hesaplaması bozuluyor ve yıldız parıltıları ya çizilmiyor ya da opak kalıyordu.
   - Tüm renk biçimlerini (`#hex`, `rgb`, `rgba`) tanıyan yeni bir renk motoru yazıldı.
   - En parlak yıldızlar için (Sirius, Vega vb.) gerçekçi 4 noktalı kırınım parıltısı (starlight diffraction spikes) ve yumuşak göksel aura eklendi.

2. **SVG İndirme Hatası Çözüldü:**
   - Orijinal kodda DOM üzerinde bulunmayan `#celestial-map svg` aranıyor ve SVG çıktısı alınamayıp her zaman PNG'ye düşüyordu. D3-Celestial vektörel SVG dışa aktarma modülü doğrudan entegre edildi.

3. **Yepyeni React + Vite + TypeScript Mimarisi:**
   - Eski statik/dinamik yapı tamamen modern, reaktif ve performanslı bir React SPA mimarisine dönüştürüldü.
   - Donma ve kasma sorunları giderildi, 60 FPS akıcı gökyüzü döndürme ve yakınlaştırma sağlandı.

4. **Yüksek Çözünürlüklü (300 DPI) Poster Kompozitörü:**
   - Yalnızca gökyüzü dairesini değil; kullanıcının yazdığı başlığı, romantik mesajı, tarihi, koordinatları ve zarif astrolab çerçevesini birleştiren 2000×2800 piksel ultra net poster baskı motoru geliştirildi.

5. **Türkçe Dijital Ürün Satış & İndirme Akışı (₺250,00):**
   - Müşterilerin dijital ürünleri (300 DPI Özel Poster PNG, Saf Gök Küresi PNG ve Vektörel SVG) indirebilmeleri için **₺250,00** fiyatlandırmalı ödeme ve lisanslama akışı tanımlandı.
   - Otomatik `SKY-XXXXXX` lisans kodu üretimi, anında kod doğrulama, `localStorage` kalıcı lisanslama ve tüm formatları tek ödemeyle indirme imkanı sunuldu.

---

## 🎨 Başlıca Özellikler

### 1. Canlı Stüdyo & Kişiselleştirme
- **Metinler:** Başlık ("Seni İlk Gördüğüm Gece", "Yıldızların Altında" vb. öneri butonları ile), Alt Başlık / Mesaj, Özel Tarih ve Saat seçici.
- **Konumlandırma:** Hızlı şehir seçimi (İstanbul, Ankara, İzmir, Paris, New York, Tokyo vb.) veya tek tıkla GPS üzerinden "Konumumu Bul".
- **Enlem & Boylam:** Gerçek coğrafi koordinatların hassas gösterimi.

### 2. Tasarım & Temalar
- **Renk Temaları:** Geceyarısı Laciverti (Midnight Blue), Saf Obsidiyen Siyah, Kozmik Nebula Moru, Gül Kurusu & Şampanya, Modern Minimalist.
- **Harita Şekli:** Klasik Astrolab Dairesi, Romantik Aşk Kalbi, Kenarsız Tam Ekran Kubbe.
- **Tipografi:** Cinzel (Roma Klasik), Playfair Display (Zarif Serif), Plus Jakarta Sans (Modern), Great Vibes (Romantik Kaligrafi).

### 3. Gökyüzü Katmanları
- 88 Resmi IAU Takımyıldızı Çizgileri ve Türkçe İsimleri.
- Samanyolu Galaksisi (Milky Way) görünürlüğü.
- Güneş, Ay ve Gezegenlerin seçili tarihteki gerçek astronomik konumları.
- Göksel Koordinat Izgarası (Graticule) ve Ekvator çizgileri.
- Ayarlanabilir Kadir / Parlaklık Sınırı (Magnitude slider).

### 4. Çerçeve Mockup Önizlemesi
- Çerçevesiz Sanat Baskısı
- Modern Mat Siyah Ahşap
- Doğal İskandinav Meşe Çerçeve
- Lüks Altın Metal Çerçeve
- Ferah Beyaz Ahşap Çerçeve

### 5. Gelişmiş Astronomi & Projeksiyon Laboratuvarı
- 10+ Kartografik Projeksiyon: Aitoff, Stereographic, Azimuthal Equal Area, Orthographic, Mercator, Mollweide, Winkel Tripel vb.
- Göksel Referans Düzlemleri: Ekvatoral, Ekliptik, Galaktik, Süpergalaktik.
- Takımyıldızına Yakınlaşma: Orion, Büyük Ayı, Kraliçe, Boğa vb.

---

## 🛠️ Kurulum & Geliştirme

Projeyi yerel makinenizde çalıştırmak için:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın (Port 3000)
npm run dev

# Üretim için derleme yapın
npm run build
```

---

## 📜 Lisans

Bu proje BSD-3-Clause ve MIT lisansları altında korunmaktadır.
Astronomik veri setleri IAU, Hipparcos ve NASA kataloglarına dayanmaktadır.
