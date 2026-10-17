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
  const isLight = theme === 'classic-white';

  if (theme === 'classic-white') {
    ctx.fillStyle = '#FAF8F5';
  } else if (theme === 'midnight') {
    ctx.fillStyle = '#0B1528';
  } else if (theme === 'obsidian') {
    ctx.fillStyle = '#0A0A0D';
  } else if (theme === 'emerald') {
    ctx.fillStyle = '#0D2120';
  } else if (theme === 'rose') {
    ctx.fillStyle = '#241016';
  } else {
    ctx.fillStyle = '#161922';
  }
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.strokeStyle = isLight ? 'rgba(20, 20, 19, 0.16)' : 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 3;
  ctx.strokeRect(64, 64, width - 128, height - 128);
  ctx.strokeStyle = isLight ? 'rgba(20, 20, 19, 0.06)' : 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  ctx.strokeRect(80, 80, width - 160, height - 160);
  ctx.restore();

  const centerX = width / 2;
  const centerY = height * 0.41;
  const radius = width * 0.36;

  ctx.save();
  if (poster.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 24, 0, Math.PI * 2);
    ctx.strokeStyle = isLight ? 'rgba(20, 20, 19, 0.28)' : 'rgba(212, 175, 55, 0.38)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 15, 0, Math.PI * 2);
    ctx.strokeStyle = isLight ? 'rgba(20, 20, 19, 0.16)' : 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1;
    ctx.stroke();

    for (let deg = 0; deg < 360; deg += 5) {
      const rad = (deg * Math.PI) / 180;
      const inner = deg % 30 === 0 ? radius + 4 : deg % 15 === 0 ? radius + 8 : radius + 11;
      const outer = radius + 15;
      const x1 = centerX + Math.cos(rad) * inner;
      const y1 = centerY + Math.sin(rad) * inner;
      const x2 = centerX + Math.cos(rad) * outer;
      const y2 = centerY + Math.sin(rad) * outer;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = isLight
        ? deg % 30 === 0
          ? 'rgba(20, 20, 19, 0.55)'
          : 'rgba(20, 20, 19, 0.22)'
        : deg % 30 === 0
        ? 'rgba(212, 175, 55, 0.65)'
        : 'rgba(255, 255, 255, 0.22)';
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
    ctx.strokeStyle = isLight ? 'rgba(20, 20, 19, 0.35)' : 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  const textStartY = height * 0.77;

  let fontTitle = '64px "Cinzel", Georgia, serif';
  let fontSubtitle = 'italic 34px "Playfair Display", Georgia, serif';
  const fontMeta = '600 26px "Plus Jakarta Sans", sans-serif';

  if (poster.font === 'playfair') {
    fontTitle = 'bold 66px "Playfair Display", Georgia, serif';
    fontSubtitle = '32px "Playfair Display", Georgia, serif';
  } else if (poster.font === 'script') {
    fontTitle = '88px "Great Vibes", cursive';
    fontSubtitle = '30px "Plus Jakarta Sans", sans-serif';
  } else if (poster.font === 'sans') {
    fontTitle = 'bold 54px "Plus Jakarta Sans", sans-serif';
    fontSubtitle = '32px "Plus Jakarta Sans", sans-serif';
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = isLight ? '#9A7432' : '#D4AF37';
  ctx.font = '22px Georgia, serif';
  ctx.fillText('✦   ·   ✧   ·   ✦', centerX, textStartY - 50);

  ctx.fillStyle = isLight ? '#141413' : '#FAF8F5';
  ctx.font = fontTitle;
  ctx.fillText(poster.title || 'Seni İlk Gördüğüm Gece', centerX, textStartY + 15);

  if (poster.subtitle) {
    ctx.fillStyle = isLight ? '#57534E' : '#CBD5E1';
    ctx.font = fontSubtitle;
    ctx.fillText(poster.subtitle, centerX, textStartY + 80);
  }

  ctx.strokeStyle = isLight ? 'rgba(20, 20, 19, 0.2)' : 'rgba(212, 175, 55, 0.38)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(centerX - 160, textStartY + 130);
  ctx.lineTo(centerX + 160, textStartY + 130);
  ctx.stroke();

  const dateStr = formatDisplayDate(poster.date, poster.time);
  ctx.fillStyle = isLight ? '#292524' : '#E2E8F0';
  ctx.font = fontMeta;
  ctx.fillText(dateStr.toUpperCase(), centerX, textStartY + 180);

  const locStr = (poster.locationName || 'İSTANBUL, TÜRKİYE').toUpperCase();
  ctx.fillStyle = isLight ? '#57534E' : '#94A3B8';
  ctx.font = '24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(locStr, centerX, textStartY + 225);

  if (poster.showCoordinatesText) {
    const coordsStr = formatCoordinates(poster.lat, poster.lng);
    ctx.fillStyle = isLight ? '#9A7432' : 'rgba(212, 175, 55, 0.85)';
    ctx.font = '21px "Plus Jakarta Sans", monospace';
    ctx.fillText(coordsStr, centerX, textStartY + 265);
  }

  ctx.fillStyle = isLight ? 'rgba(20, 20, 19, 0.22)' : 'rgba(255, 255, 255, 0.2)';
  ctx.font = '15px "Plus Jakarta Sans", sans-serif';
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

  const isLight = poster.theme === 'classic-white';

  let paperFill = '#0B1528';
  if (poster.theme === 'classic-white') paperFill = '#FAF8F5';
  else if (poster.theme === 'obsidian') paperFill = '#0A0A0D';
  else if (poster.theme === 'emerald') paperFill = '#0D2120';
  else if (poster.theme === 'rose') paperFill = '#241016';
  else if (poster.theme === 'minimal') paperFill = '#161922';

  const ticksSvg: string[] = [];
  if (poster.shape === 'circle') {
    for (let deg = 0; deg < 360; deg += 5) {
      const rad = (deg * Math.PI) / 180;
      const inner = deg % 30 === 0 ? radius + 4 : deg % 15 === 0 ? radius + 8 : radius + 11;
      const outer = radius + 15;
      const x1 = (centerX + Math.cos(rad) * inner).toFixed(2);
      const y1 = (centerY + Math.sin(rad) * inner).toFixed(2);
      const x2 = (centerX + Math.cos(rad) * outer).toFixed(2);
      const y2 = (centerY + Math.sin(rad) * outer).toFixed(2);
      const stroke = isLight
        ? deg % 30 === 0
          ? 'rgba(20,20,19,0.55)'
          : 'rgba(20,20,19,0.22)'
        : deg % 30 === 0
        ? 'rgba(212, 175, 55, 0.65)'
        : 'rgba(255, 255, 255, 0.22)';
      const strokeW = deg % 30 === 0 ? '2' : '1';
      ticksSvg.push(
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeW}" />`
      );
    }
  }

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

  let embeddedVectorLayers = '';
  if (rawCelestialSvgMarkup) {
    const viewBoxMatch = rawCelestialSvgMarkup.match(/viewBox="\s*0\s+0\s+(\d+)\s+(\d+)"/);
    const vbW = viewBoxMatch ? parseFloat(viewBoxMatch[1]) : celestialCanvas.width;
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
    fontSizeTitle = '54';
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
      : `<rect x="140" y="140" width="${width - 280}" height="${height * 0.58}" rx="8" />`;

  const svgDocument = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <clipPath id="skyMask">
      ${clipContent}
    </clipPath>
  </defs>

  <!-- Poster Paper Background -->
  <rect width="${width}" height="${height}" fill="${paperFill}" />

  <!-- Outer Double Borders -->
  <rect x="64" y="64" width="${width - 128}" height="${height - 128}" fill="none" stroke="${
    isLight ? 'rgba(20,20,19,0.16)' : 'rgba(255,255,255,0.12)'
  }" stroke-width="3" />
  <rect x="80" y="80" width="${width - 160}" height="${height - 160}" fill="none" stroke="${
    isLight ? 'rgba(20,20,19,0.06)' : 'rgba(255,255,255,0.04)'
  }" stroke-width="1" />

  <!-- Astrolabe Outer Rings & Degree Ticks -->
  ${
    poster.shape === 'circle'
      ? `
  <circle cx="${centerX}" cy="${centerY}" r="${radius + 24}" fill="none" stroke="${
        isLight ? 'rgba(20,20,19,0.28)' : 'rgba(212,175,55,0.38)'
      }" stroke-width="2" />
  <circle cx="${centerX}" cy="${centerY}" r="${radius + 15}" fill="none" stroke="${
        isLight ? 'rgba(20,20,19,0.16)' : 'rgba(255,255,255,0.16)'
      }" stroke-width="1" />
  <g id="astrolabe-ticks">
    ${ticksSvg.join('\n    ')}
  </g>`
      : ''
  }

  <!-- Celestial Sky Field -->
  <g clip-path="url(#skyMask)">
    <image x="${imgX}" y="${imgY}" width="${drawWidth.toFixed(2)}" height="${drawHeight.toFixed(2)}" xlink:href="${canvasDataUrl}" href="${canvasDataUrl}" preserveAspectRatio="xMidYMid slice" />
    ${embeddedVectorLayers}
  </g>

  ${
    poster.shape === 'circle'
      ? `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="${
          isLight ? 'rgba(20,20,19,0.35)' : 'rgba(255,255,255,0.35)'
        }" stroke-width="2" />`
      : poster.shape === 'heart'
      ? `<path d="${heartPath}" fill="none" stroke="${
          isLight ? 'rgba(20,20,19,0.3)' : 'rgba(212,175,55,0.4)'
        }" stroke-width="2.5" />`
      : ''
  }

  <!-- Personalization Typography Layer -->
  <g text-anchor="middle">
    <text x="${centerX}" y="${textStartY - 50}" fill="${
    isLight ? '#9A7432' : '#D4AF37'
  }" font-size="22" font-family="Georgia, serif" letter-spacing="8">✦ · ✧ · ✦</text>
    <text x="${centerX}" y="${textStartY + 15}" fill="${
    isLight ? '#141413' : '#FAF8F5'
  }" font-size="${fontSizeTitle}" font-weight="${fontWeightTitle}" font-family="${fontFamilyTitle}">${titleText}</text>
    ${
      subtitleText
        ? `<text x="${centerX}" y="${textStartY + 80}" fill="${
            isLight ? '#57534E' : '#CBD5E1'
          }" font-size="33" font-style="italic" font-family="'Playfair Display', Georgia, serif">${subtitleText}</text>`
        : ''
    }
    <line x1="${centerX - 160}" y1="${textStartY + 130}" x2="${centerX + 160}" y2="${textStartY + 130}" stroke="${
    isLight ? 'rgba(20,20,19,0.2)' : 'rgba(212,175,55,0.38)'
  }" stroke-width="1.5" />
    <text x="${centerX}" y="${textStartY + 180}" fill="${
    isLight ? '#292524' : '#E2E8F0'
  }" font-size="26" font-weight="600" font-family="'Plus Jakarta Sans', sans-serif" letter-spacing="4">${dateText}</text>
    <text x="${centerX}" y="${textStartY + 225}" fill="${
    isLight ? '#57534E' : '#94A3B8'
  }" font-size="24" font-family="'Plus Jakarta Sans', sans-serif" letter-spacing="3">${locText}</text>
    ${
      poster.showCoordinatesText
        ? `<text x="${centerX}" y="${textStartY + 265}" fill="${
            isLight ? '#9A7432' : 'rgba(212,175,55,0.85)'
          }" font-size="21" font-family="monospace" letter-spacing="2">${coordsText}</text>`
        : ''
    }
    <text x="${centerX}" y="${height - 90}" fill="${
    isLight ? 'rgba(20,20,19,0.22)' : 'rgba(255,255,255,0.2)'
  }" font-size="15" font-family="'Plus Jakarta Sans', sans-serif" letter-spacing="3">CELESTIAL · GERÇEK ZAMANLI ASTRONOMİ &amp; YILDIZ HARİTASI</text>
  </g>
</svg>`;

  return new Blob([svgDocument], { type: 'image/svg+xml;charset=utf-8' });
}
