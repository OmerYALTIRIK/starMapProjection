export type PosterTheme = 'midnight' | 'obsidian' | 'cosmic' | 'rose' | 'minimal';

export type PosterShape = 'circle' | 'heart' | 'full';

export type PosterFrame = 'none' | 'black' | 'oak' | 'white' | 'gold';

export type PosterFont = 'cinzel' | 'playfair' | 'sans' | 'script';

export interface PosterData {
  title: string;
  subtitle: string;
  date: string;
  time: string;
  locationName: string;
  lat: number;
  lng: number;
  theme: PosterTheme;
  shape: PosterShape;
  frame: PosterFrame;
  font: PosterFont;
  showConstellationLines: boolean;
  showConstellationNames: boolean;
  showMilkyWay: boolean;
  showPlanets: boolean;
  showGraticule: boolean;
  showStars: boolean;
  starMagnitude: number;
  starGlow: boolean;
  glowIntensity: number;
  showCoordinatesText: boolean;
}

export interface CityPreset {
  name: string;
  lat: number;
  lng: number;
}

export const POPULAR_CITIES: CityPreset[] = [
  { name: 'İstanbul, Türkiye', lat: 41.0082, lng: 28.9784 },
  { name: 'Ankara, Türkiye', lat: 39.9334, lng: 32.8597 },
  { name: 'İzmir, Türkiye', lat: 38.4237, lng: 27.1428 },
  { name: 'Antalya, Türkiye', lat: 36.8969, lng: 30.7133 },
  { name: 'Bursa, Türkiye', lat: 40.1885, lng: 29.0610 },
  { name: 'Kapadokya / Nevşehir', lat: 38.6431, lng: 34.8289 },
  { name: 'Bodrum, Muğla', lat: 37.0344, lng: 27.4305 },
  { name: 'Trabzon, Türkiye', lat: 41.0027, lng: 39.7168 },
  { name: 'Paris, Fransa', lat: 48.8566, lng: 2.3522 },
  { name: 'Londra, İngiltere', lat: 51.5074, lng: -0.1278 },
  { name: 'Roma, İtalya', lat: 41.9028, lng: 12.4964 },
  { name: 'New York, ABD', lat: 40.7128, lng: -74.0060 },
  { name: 'Tokyo, Japonya', lat: 35.6762, lng: 139.6503 },
];

export const SUGGESTED_TITLES = [
  'Seni İlk Gördüğüm Gece',
  'Yıldızların Altında',
  'İlk Öpücüğümüz',
  'Bizim Hikayemiz Başladı',
  'Doğduğun Gün Gökyüzü',
  'Evet Dediğim An',
  'Kalbimin Sahibi',
  'En Güzel Hatıramız',
  'Gözlerini Açtığın Gece',
  'Aşkımızın Yıldız Haritası',
];
