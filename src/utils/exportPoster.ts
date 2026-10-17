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
    return `${parseInt(d, 10)} ${monthName} ${y} · ${timeStr}`;
  } catch {
    return `${dateStr} ${timeStr}`;
  }
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function generateHighResPosterBlob(poster: PosterData): Promise<Blob> {
  const celestialCanvas = document.querySelector('#celestial-map canvas') as HTMLCanvasElement | null;
  if (!celestialCanvas) {
    throw new Error('Gökyüzü haritası bulunamadı');
  }

  const width = 2000;
  const height = 2800;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas bağlamı alınamadı');

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
    ctx.fillStyle = '#0a0d18';
  }
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 60, width - 120, height - 120);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  ctx.strokeRect(76, 76, width - 152, height - 152);
  ctx.restore();

  const centerX = width / 2;
  const centerY = height * 0.41;
  const radius = width * 0.36;

  ctx.save();
  if (poster.shape === 'circle') {
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

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();
  } else if (poster.shape === 'heart') {
    ctx.beginPath();
    const d = radius * 1.05;
    ctx.moveTo(centerX, centerY + d * 0.85);
    ctx.bezierCurveTo(centerX - d * 1.2, centerY + d * 0.2, centerX - d * 1.2, centerY - d * 0.8, centerX, centerY - d * 0.4);
    ctx.bezierCurveTo(centerX + d * 1.2, centerY - d * 0.8, centerX + d * 1.2, centerY + d * 0.2, centerX, centerY + d * 0.85);
    ctx.closePath();
    ctx.clip();
  }

  const sourceAspect = celestialCanvas.width / celestialCanvas.height;
  const drawWidth = radius * 2.3;
  const drawHeight = drawWidth / sourceAspect;
  ctx.drawImage(
    celestialCanvas,
    0, 0, celestialCanvas.width, celestialCanvas.height,
    centerX - drawWidth / 2, centerY - drawHeight / 2, drawWidth, drawHeight
  );

  ctx.restore();

  if (poster.shape === 'circle') {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  const textStartY = height * 0.77;

  let fontTitle = '64px "Cinzel", Georgia, serif';
  let fontSubtitle = 'italic 34px "Playfair Display", Georgia, serif';
  const fontMeta = '26px "Plus Jakarta Sans", sans-serif';

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

  ctx.fillStyle = '#d4af37';
  ctx.font = '22px sans-serif';
  ctx.fillText('✦   ·   ✧   ·   ✦', centerX, textStartY - 50);

  ctx.fillStyle = '#f8fafc';
  ctx.font = fontTitle;
  ctx.fillText(poster.title || 'Seni İlk Gördüğüm Gece', centerX, textStartY + 15);

  if (poster.subtitle) {
    ctx.fillStyle = '#cbd5e1';
    ctx.font = fontSubtitle;
    ctx.fillText(poster.subtitle, centerX, textStartY + 80);
  }

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(centerX - 180, textStartY + 130);
  ctx.lineTo(centerX + 180, textStartY + 130);
  ctx.stroke();

  const dateStr = formatDisplayDate(poster.date, poster.time);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = fontMeta;
  ctx.fillText(dateStr.toUpperCase(), centerX, textStartY + 180);

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

  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CELESTIAL · GERÇEK ZAMANLI ASTRONOMİ & YILDIZ HARİTASI', centerX, height - 90);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Poster görseli oluşturulamadı'));
    }, 'image/png', 0.98);
  });
}

/**
 * Generates a complete, scalable Vector SVG Poster file (.svg)
 * embedding both the vector astrolabe rings, degree ticks, typography,
 * and the D3-Celestial vector sky layers + high-res star field.
 */
export async function generateHighResPosterSVG(poster: PosterData): Promise<Blob> {
  const celestialCanvas = document.querySelector('#celestial-map canvas') as HTMLCanvasElement | null;
  if (!celestialCanvas) {
    throw new Error('Gökyüzü haritası bulunamadı');
  }

  const width = 2000;
  const height = 2800;
  const centerX = width / 2;
  const centerY = height * 0.41;
  const radius = width * 0.36;
  const textStartY = height * 0.77;

  // Theme colors
  let bgStop1 = '#040816';
  let bgStop2 = '#070f28';
  let bgStop3 = '#02050e';
  if (poster.theme === 'obsidian') {
    bgStop1 = '#060608';
    bgStop2 = '#08080c';
    bgStop3 = '#040406';
  } else if (poster.theme === 'cosmic') {
    bgStop1 = '#120d2c';
    bgStop2 = '#080616';
    bgStop3 = '#020108';
  } else if (poster.theme === 'rose') {
    bgStop1 = '#180e18';
    bgStop2 = '#221122';
    bgStop3 = '#0d060e';
  } else if (poster.theme === 'minimal') {
    bgStop1 = '#0a0d18';
    bgStop2 = '#0e1324';
    bgStop3 = '#070912';
  }

  // Generate 360-degree vector astrolabe tick lines
  const ticksSvg: string[] = [];
  if (poster.shape === 'circle') {
    for (let deg = 0; deg < 360; deg += 5) {
      const rad = (deg * Math.PI) / 180;
      const inner = deg % 30 === 0 ? radius + 4 : deg % 15 === 0 ? radius + 8 : radius + 11;
      const outer = radius + 14;
      const x1 = (centerX + Math.cos(rad) * inner).toFixed(2);
      const y1 = (centerY + Math.sin(rad) * inner).toFixed(2);
      const x2 = (centerX + Math.cos(rad) * outer).toFixed(2);
      const y2 = (centerY + Math.sin(rad) * outer).toFixed(2);
      const stroke = deg % 30 === 0 ? 'rgba(212, 175, 55, 0.65)' : 'rgba(255, 255, 255, 0.22)';
      const strokeW = deg % 30 === 0 ? '2' : '1';
      ticksSvg.push(
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeW}" />`
      );
    }
  }

  // Also try extracting raw D3 vector paths if Celestial.exportSVG callback resolves within 800ms
  const rawCelestialSvgMarkup = await new Promise<string | null>((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(null);
      }
    }, 900);

    try {
      if ((window as any).Celestial && typeof (window as any).Celestial.exportSVG === 'function') {
        (window as any).Celestial.exportSVG((svgStr: string) => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve(svgStr || null);
          }
        });
      } else {
        clearTimeout(timer);
        resolve(null);
      }
    } catch {
      clearTimeout(timer);
      resolve(null);
    }
  });

  const canvasDataUrl = celestialCanvas.toDataURL('image/png');
  const sourceAspect = celestialCanvas.width / celestialCanvas.height;
  const drawWidth = radius * 2.3;
  const drawHeight = drawWidth / sourceAspect;
  const imgX = (centerX - drawWidth / 2).toFixed(2);
  const imgY = (centerY - drawHeight / 2).toFixed(2);

  // Extract inner <g> vector layers from D3-Celestial SVG if available
  let embeddedVectorLayers = '';
  if (rawCelestialSvgMarkup) {
    const viewBoxMatch = rawCelestialSvgMarkup.match(/viewBox="\s*0\s+0\s+(\d+)\s+(\d+)"/);
    const vbW = viewBoxMatch ? parseFloat(viewBoxMatch[1]) : celestialCanvas.width;
    const vbH = viewBoxMatch ? parseFloat(viewBoxMatch[2]) : celestialCanvas.height;
    const scaleFactor = (drawWidth / vbW).toFixed(4);
    const innerMatch = rawCelestialSvgMarkup.replace(/^[\s\S]*?<svg[^>]*>/i, '').replace(/<\/svg>\s*$/i, '');
    embeddedVectorLayers = `<g transform="translate(${imgX}, ${imgY}) scale(${scaleFactor})" opacity="0.45">${innerMatch}</g>`;
  }

  let fontFamilyTitle = "'Cinzel', Georgia, serif";
  let fontSizeTitle = '64';
  let fontWeightTitle = '700';
  if (poster.font === 'playfair') {
    fontFamilyTitle = "'Playfair Display', Georgia, serif";
    fontSizeTitle = '66';
  } else if (poster.font === 'script') {
    fontFamilyTitle = "'Great Vibes', cursive";
    fontSizeTitle = '86';
    fontWeightTitle = '400';
  } else if (poster.font === 'sans') {
    fontFamilyTitle = "'Plus Jakarta Sans', sans-serif";
    fontSizeTitle = '56';
  }

  const titleText = escapeXml(poster.title || 'Seni İlk Gördüğüm Gece');
  const subtitleText = escapeXml(poster.subtitle || '');
  const dateText = escapeXml(formatDisplayDate(poster.date, poster.time).toUpperCase());
  const locText = escapeXml((poster.locationName || 'İSTANBUL, TÜRKİYE').toUpperCase());
  const coordsText = escapeXml(formatCoordinates(poster.lat, poster.lng));

  const d = radius * 1.05;
  const heartPath = `M ${centerX} ${centerY + d * 0.85} C ${centerX - d * 1.2} ${centerY + d * 0.2}, ${centerX - d * 1.2} ${centerY - d * 0.8}, ${centerX} ${centerY - d * 0.4} C ${centerX + d * 1.2} ${centerY - d * 0.8}, ${centerX + d * 1.2} ${centerY + d * 0.2}, ${centerX} ${centerY + d * 0.85} Z`;

  const clipContent =
    poster.shape === 'circle'
      ? `<circle cx="${centerX}" cy="${centerY}" r="${radius}" />`
      : poster.shape === 'heart'
      ? `<path d="${heartPath}" />`
      : `<rect x="140" y="140" width="${width - 280}" height="${height * 0.58}" rx="16" />`;

  const svgDocument = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="posterBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgStop1}" />
      <stop offset="50%" stop-color="${bgStop2}" />
      <stop offset="100%" stop-color="${bgStop3}" />
    </linearGradient>
    <clipPath id="skyMask">
      ${clipContent}
    </clipPath>
  </defs>

  <!-- Poster Background -->
  <rect width="${width}" height="${height}" fill="url(#posterBg)" />

  <!-- Outer Double Borders -->
  <rect x="60" y="60" width="${width - 120}" height="${height - 120}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3" />
  <rect x="76" y="76" width="${width - 152}" height="${height - 152}" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />

  <!-- Astrolabe Outer Rings & Degree Ticks -->
  ${
    poster.shape === 'circle'
      ? `
  <circle cx="${centerX}" cy="${centerY}" r="${radius + 22}" fill="none" stroke="rgba(212,175,55,0.32)" stroke-width="2" />
  <circle cx="${centerX}" cy="${centerY}" r="${radius + 14}" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="1" />
  <g id="astrolabe-ticks">
    ${ticksSvg.join('\n    ')}
  </g>`
      : ''
  }

  <!-- Celestial Sky Field (High-Res Luminous Star Map + Vector Paths) -->
  <g clip-path="url(#skyMask)">
    <image x="${imgX}" y="${imgY}" width="${drawWidth.toFixed(2)}" height="${drawHeight.toFixed(2)}" xlink:href="${canvasDataUrl}" href="${canvasDataUrl}" preserveAspectRatio="xMidYMid slice" />
    ${embeddedVectorLayers}
  </g>

  ${
    poster.shape === 'circle'
      ? `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2" />`
      : poster.shape === 'heart'
      ? `<path d="${heartPath}" fill="none" stroke="rgba(212,175,55,0.4)" stroke-width="2.5" />`
      : ''
  }

  <!-- Personalization Typography Layer -->
  <g text-anchor="middle">
    <text x="${centerX}" y="${textStartY - 50}" fill="#d4af37" font-size="22" font-family="Georgia, serif" letter-spacing="8">✦ · ✧ · ✦</text>
    <text x="${centerX}" y="${textStartY + 15}" fill="#f8fafc" font-size="${fontSizeTitle}" font-weight="${fontWeightTitle}" font-family="${fontFamilyTitle}">${titleText}</text>
    ${
      subtitleText
        ? `<text x="${centerX}" y="${textStartY + 80}" fill="#cbd5e1" font-size="33" font-style="italic" font-family="'Playfair Display', Georgia, serif">${subtitleText}</text>`
        : ''
    }
    <line x1="${centerX - 180}" y1="${textStartY + 130}" x2="${centerX + 180}" y2="${textStartY + 130}" stroke="rgba(212,175,55,0.35)" stroke-width="1.5" />
    <text x="${centerX}" y="${textStartY + 180}" fill="#e2e8f0" font-size="26" font-weight="600" font-family="'Plus Jakarta Sans', sans-serif" letter-spacing="4">${dateText}</text>
    <text x="${centerX}" y="${textStartY + 225}" fill="#94a3b8" font-size="24" font-family="'Plus Jakarta Sans', sans-serif" letter-spacing="3">${locText}</text>
    ${
      poster.showCoordinatesText
        ? `<text x="${centerX}" y="${textStartY + 265}" fill="rgba(212,175,55,0.85)" font-size="21" font-family="monospace" letter-spacing="2">${coordsText}</text>`
        : ''
    }
    <text x="${centerX}" y="${height - 90}" fill="rgba(255,255,255,0.22)" font-size="16" font-family="'Plus Jakarta Sans', sans-serif" letter-spacing="3">CELESTIAL · GERÇEK ZAMANLI ASTRONOMİ &amp; YILDIZ HARİTASI</text>
  </g>
</svg>`;

  return new Blob([svgDocument], { type: 'image/svg+xml;charset=utf-8' });
}
