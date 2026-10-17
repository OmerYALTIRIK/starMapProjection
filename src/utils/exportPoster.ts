import { PosterData } from '../types';

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

export function formatDisplayDate(dateStr: string, timeStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-');
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const monthName = months[parseInt(m, 10) - 1] || m;
    return `${parseInt(d, 10)} ${monthName} ${y} • ${timeStr}`;
  } catch (e) {
    return `${dateStr} ${timeStr}`;
  }
}

export async function generateHighResPosterBlob(poster: PosterData): Promise<Blob> {
  const celestialCanvas = document.querySelector('#celestial-map canvas') as HTMLCanvasElement | null;
  if (!celestialCanvas) {
    throw new Error('Gökyüzü haritası bulunamadı');
  }

  // Create high-res offscreen canvas (2000 x 2800 for pristine print quality)
  const width = 2000;
  const height = 2800;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas bağlamı alınamadı');

  // 1. Draw Background
  const theme = poster.theme;
  if (theme === 'midnight') {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#040816');
    grad.addColorStop(0.5, '#070f28');
    grad.addColorStop(1, '#02050e');
    ctx.fillStyle = grad;
  } else if (theme === 'obsidian') {
    ctx.fillStyle = '#060608';
  } else if (theme === 'cosmic') {
    const grad = ctx.createRadialGradient(width / 2, height * 0.4, 100, width / 2, height * 0.4, width);
    grad.addColorStop(0, '#120d2c');
    grad.addColorStop(0.6, '#080616');
    grad.addColorStop(1, '#020108');
    ctx.fillStyle = grad;
  } else if (theme === 'rose') {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#180e18');
    grad.addColorStop(0.5, '#221122');
    grad.addColorStop(1, '#0d060e');
    ctx.fillStyle = grad;
  } else {
    // minimal
    ctx.fillStyle = '#0a0d18';
  }
  ctx.fillRect(0, 0, width, height);

  // Subtle outer poster margin border
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 60, width - 120, height - 120);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  ctx.strokeRect(76, 76, width - 152, height - 152);
  ctx.restore();

  // 2. Draw Celestial Sky (Circle, Heart, or Full)
  const centerX = width / 2;
  const centerY = height * 0.41;
  const radius = width * 0.36;

  ctx.save();
  if (poster.shape === 'circle') {
    // Outer decorative rings
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 22, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 14, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Coordinate tick marks on the ring
    for (let deg = 0; deg < 360; deg += 5) {
      const rad = (deg * Math.PI) / 180;
      const inner = deg % 30 === 0 ? radius + 4 : deg % 15 === 0 ? radius + 8 : radius + 11;
      const outer = radius + 14;
      const x1 = centerX + Math.cos(rad) * inner;
      const y1 = centerY + Math.sin(rad) * inner;
      const x2 = centerX + Math.cos(rad) * outer;
      const y2 = centerY + Math.sin(rad) * outer;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = deg % 30 === 0 ? 'rgba(212, 175, 55, 0.6)' : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = deg % 30 === 0 ? 2 : 1;
      ctx.stroke();
    }

    // Clip to circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();
  } else if (poster.shape === 'heart') {
    // Draw heart path
    ctx.beginPath();
    const d = radius * 1.05;
    ctx.moveTo(centerX, centerY + d * 0.85);
    ctx.bezierCurveTo(centerX - d * 1.2, centerY + d * 0.2, centerX - d * 1.2, centerY - d * 0.8, centerX, centerY - d * 0.4);
    ctx.bezierCurveTo(centerX + d * 1.2, centerY - d * 0.8, centerX + d * 1.2, centerY + d * 0.2, centerX, centerY + d * 0.85);
    ctx.closePath();
    ctx.clip();
  }

  // Draw star map from source canvas into clipped region
  const sourceAspect = celestialCanvas.width / celestialCanvas.height;
  const drawWidth = radius * 2.3;
  const drawHeight = drawWidth / sourceAspect;
  ctx.drawImage(
    celestialCanvas,
    0, 0, celestialCanvas.width, celestialCanvas.height,
    centerX - drawWidth / 2, centerY - drawHeight / 2, drawWidth, drawHeight
  );

  ctx.restore();

  // Subtle star rim lighting
  if (poster.shape === 'circle') {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  // 3. Draw Typography Section
  const textStartY = height * 0.77;

  // Font choices
  let fontTitle = '64px "Cinzel", Georgia, serif';
  let fontSubtitle = 'italic 34px "Playfair Display", Georgia, serif';
  let fontMeta = '26px "Plus Jakarta Sans", sans-serif';

  if (poster.font === 'playfair') {
    fontTitle = 'bold 66px "Playfair Display", Georgia, serif';
    fontSubtitle = '32px "Playfair Display", Georgia, serif';
  } else if (poster.font === 'script') {
    fontTitle = '88px "Great Vibes", cursive';
    fontSubtitle = '30px "Plus Jakarta Sans", sans-serif';
  } else if (poster.font === 'sans') {
    fontTitle = 'bold 56px "Plus Jakarta Sans", sans-serif';
    fontSubtitle = '32px "Plus Jakarta Sans", sans-serif';
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Decorative celestial separator above title
  ctx.fillStyle = '#d4af37';
  ctx.font = '22px sans-serif';
  ctx.fillText('✦   •   ✧   •   ✦', centerX, textStartY - 50);

  // Title
  ctx.fillStyle = '#f8fafc';
  ctx.font = fontTitle;
  ctx.fillText(poster.title || 'Seni İlk Gördüğüm Gece', centerX, textStartY + 15);

  // Subtitle
  if (poster.subtitle) {
    ctx.fillStyle = '#cbd5e1';
    ctx.font = fontSubtitle;
    ctx.fillText(poster.subtitle, centerX, textStartY + 80);
  }

  // Horizontal divider line
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(centerX - 180, textStartY + 130);
  ctx.lineTo(centerX + 180, textStartY + 130);
  ctx.stroke();

  // Date & Time
  const dateStr = formatDisplayDate(poster.date, poster.time);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = fontMeta;
  ctx.fillText(dateStr.toUpperCase(), centerX, textStartY + 180);

  // Location & Coordinates
  const locStr = (poster.locationName || 'İSTANBUL, TÜRKİYE').toUpperCase();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(locStr, centerX, textStartY + 225);

  if (poster.showCoordinatesText) {
    const coordsStr = formatCoordinates(poster.lat, poster.lng);
    ctx.fillStyle = 'rgba(212, 175, 55, 0.85)';
    ctx.font = '21px "Plus Jakarta Sans", monospace';
    ctx.fillText(coordsStr, centerX, textStartY + 265);
  }

  // Brand / Astrological Watermark at the very bottom
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('D3-CELESTIAL • GERÇEK ZAMANLI ASTRONOMİ & YILDIZ HARİTASI', centerX, height - 90);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Poster görseli oluşturulamadı'));
    }, 'image/png', 0.98);
  });
}
