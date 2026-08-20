/**
 * Cálculo del cielo en tiempo real. Funciones puras, todo en el cliente.
 * Usa astronomy-engine: sin red, sin API keys, funciona offline.
 */
import {
  Body,
  Equator,
  Horizon,
  Illumination,
  MoonPhase,
  Observer,
  SiderealTime,
} from "astronomy-engine";
import starCatalog from "@/data/stars.json";

export type City = {
  id: "bogota" | "madrid" | "tokyo";
  name: string;
  lat: number;
  lon: number;
  tz: string;
};

export const cities: City[] = [
  { id: "bogota", name: "Bogotá", lat: 4.711, lon: -74.0721, tz: "America/Bogota" },
  { id: "madrid", name: "Madrid", lat: 40.4168, lon: -3.7038, tz: "Europe/Madrid" },
  { id: "tokyo", name: "Tokio", lat: 35.6762, lon: 139.6503, tz: "Asia/Tokyo" },
];

export type CatalogStar = { ra: number; dec: number; mag: number; name?: string; bayer?: string };

export type SkyStar = { alt: number; az: number; mag: number; name?: string };
export type SkyPlanet = { id: string; name: string; alt: number; az: number; mag: number };
export type SkyMoon = {
  alt: number;
  az: number;
  /** Fracción iluminada 0..1 */
  fraction: number;
  /** Ángulo de fase 0..360 (0 = luna nueva, 180 = llena) */
  phaseAngle: number;
  waxing: boolean;
};

export type SkyPalette = {
  top: [number, number, number];
  mid: [number, number, number];
  bottom: [number, number, number];
  /** Opacidad global de las estrellas 0..1 */
  starOpacity: number;
  /** Brillo percibido del cielo 0..1, para calcular el scrim del texto */
  brightness: number;
};

export type SkyState = {
  date: Date;
  city: City;
  sunAlt: number;
  sunAz: number;
  moon: SkyMoon;
  planets: SkyPlanet[];
  stars: SkyStar[];
  palette: SkyPalette;
};

const DEG = Math.PI / 180;

const planetBodies: { id: string; body: Body; name: string }[] = [
  { id: "mercury", body: Body.Mercury, name: "Mercurio" },
  { id: "venus", body: Body.Venus, name: "Venus" },
  { id: "mars", body: Body.Mars, name: "Marte" },
  { id: "jupiter", body: Body.Jupiter, name: "Júpiter" },
  { id: "saturn", body: Body.Saturn, name: "Saturno" },
];

export const planetNames: Record<string, { es: string; en: string }> = {
  mercury: { es: "Mercurio", en: "Mercury" },
  venus: { es: "Venus", en: "Venus" },
  mars: { es: "Marte", en: "Mars" },
  jupiter: { es: "Júpiter", en: "Jupiter" },
  saturn: { es: "Saturno", en: "Saturn" },
  moon: { es: "Luna", en: "Moon" },
  sun: { es: "Sol", en: "Sun" },
};

function normalizeHours(hours: number) {
  return ((hours % 24) + 24) % 24;
}

function altAzOf(body: Body, date: Date, observer: Observer) {
  const eq = Equator(body, date, observer, true, true);
  const hor = Horizon(date, observer, eq.ra, eq.dec, "normal");
  return { alt: hor.altitude, az: hor.azimuth };
}

/**
 * Estrella (RA en horas, Dec en grados) a coordenadas horizontales.
 * La longitud oeste es negativa, por eso LST = GAST + lon/15.
 */
export function starToHorizontal(
  ra: number,
  dec: number,
  lst: number,
  lat: number,
): { alt: number; az: number } {
  const H = (normalizeHours(lst - ra)) * 15 * DEG;
  const decRad = dec * DEG;
  const latRad = lat * DEG;
  const sinAlt =
    Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(H);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt))) / DEG;
  const az =
    Math.atan2(
      -Math.sin(H) * Math.cos(decRad),
      Math.cos(latRad) * Math.sin(decRad) - Math.sin(latRad) * Math.cos(decRad) * Math.cos(H),
    ) / DEG;
  return { alt, az: (az + 360) % 360 };
}

type Stop = { alt: number; top: [number, number, number]; mid: [number, number, number]; bottom: [number, number, number]; starOpacity: number; brightness: number };

/** Paleta por altitud solar. De día pleno a noche cerrada. */
const stops: Stop[] = [
  // noche cerrada
  { alt: -90, top: [4, 6, 16], mid: [6, 9, 22], bottom: [10, 14, 30], starOpacity: 1, brightness: 0.03 },
  { alt: -18, top: [6, 9, 24], mid: [10, 14, 36], bottom: [16, 22, 48], starOpacity: 1, brightness: 0.06 },
  // crepúsculo astronómico
  { alt: -12, top: [10, 16, 44], mid: [16, 26, 64], bottom: [28, 40, 84], starOpacity: 0.9, brightness: 0.12 },
  // crepúsculo náutico
  { alt: -6, top: [20, 28, 74], mid: [40, 44, 104], bottom: [86, 66, 116], starOpacity: 0.55, brightness: 0.24 },
  // crepúsculo civil
  { alt: 0, top: [46, 62, 122], mid: [116, 92, 140], bottom: [222, 122, 74], starOpacity: 0.18, brightness: 0.44 },
  // hora dorada
  { alt: 6, top: [86, 140, 200], mid: [176, 190, 214], bottom: [246, 190, 120], starOpacity: 0, brightness: 0.72 },
  // día pleno
  { alt: 20, top: [58, 128, 208], mid: [126, 180, 228], bottom: [196, 220, 238], starOpacity: 0, brightness: 0.94 },
  { alt: 90, top: [46, 118, 204], mid: [116, 174, 226], bottom: [204, 226, 240], starOpacity: 0, brightness: 1 },
];

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [
    Math.round(mix(a[0], b[0], t)),
    Math.round(mix(a[1], b[1], t)),
    Math.round(mix(a[2], b[2], t)),
  ];
}

export function skyPalette(sunAlt: number): SkyPalette {
  let lower = stops[0]!;
  let upper = stops[stops.length - 1]!;
  for (let i = 0; i < stops.length - 1; i += 1) {
    if (sunAlt >= stops[i]!.alt && sunAlt <= stops[i + 1]!.alt) {
      lower = stops[i]!;
      upper = stops[i + 1]!;
      break;
    }
  }
  const span = upper.alt - lower.alt;
  const t = span === 0 ? 0 : Math.max(0, Math.min(1, (sunAlt - lower.alt) / span));
  return {
    top: mixRgb(lower.top, upper.top, t),
    mid: mixRgb(lower.mid, upper.mid, t),
    bottom: mixRgb(lower.bottom, upper.bottom, t),
    starOpacity: mix(lower.starOpacity, upper.starOpacity, t),
    brightness: mix(lower.brightness, upper.brightness, t),
  };
}

export function rgb([r, g, b]: [number, number, number], alpha = 1) {
  return alpha >= 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alpha})`;
}

/** Catálogo recortado a las N estrellas más brillantes. */
export function brightestStars(limit: number): CatalogStar[] {
  return (starCatalog as CatalogStar[]).slice(0, limit);
}

export function computeSky(city: City, date: Date, starLimit = 200): SkyState {
  const observer = new Observer(city.lat, city.lon, 0);

  const sun = altAzOf(Body.Sun, date, observer);
  const moonPos = altAzOf(Body.Moon, date, observer);
  const illum = Illumination(Body.Moon, date);
  const phaseAngle = MoonPhase(date);

  const planets: SkyPlanet[] = [];
  for (const planet of planetBodies) {
    const pos = altAzOf(planet.body, date, observer);
    if (pos.alt > 0) {
      const info = Illumination(planet.body, date);
      planets.push({ id: planet.id, name: planet.name, alt: pos.alt, az: pos.az, mag: info.mag });
    }
  }

  const lst = normalizeHours(SiderealTime(date) + city.lon / 15);
  const stars: SkyStar[] = [];
  for (const star of brightestStars(starLimit)) {
    const pos = starToHorizontal(star.ra, star.dec, lst, city.lat);
    if (pos.alt > 0) {
      stars.push({ alt: pos.alt, az: pos.az, mag: star.mag, name: star.name ?? star.bayer });
    }
  }

  return {
    date,
    city,
    sunAlt: sun.alt,
    sunAz: sun.az,
    moon: {
      alt: moonPos.alt,
      az: moonPos.az,
      fraction: illum.phase_fraction,
      phaseAngle,
      waxing: phaseAngle < 180,
    },
    planets,
    stars,
    palette: skyPalette(sun.alt),
  };
}

/** Nombre de la fase lunar a partir del ángulo de fase. */
export function moonPhaseName(phaseAngle: number): { es: string; en: string } {
  if (phaseAngle < 15 || phaseAngle >= 345) return { es: "nueva", en: "new" };
  if (phaseAngle < 75) return { es: "creciente", en: "waxing crescent" };
  if (phaseAngle < 105) return { es: "cuarto creciente", en: "first quarter" };
  if (phaseAngle < 165) return { es: "gibosa creciente", en: "waxing gibbous" };
  if (phaseAngle < 195) return { es: "llena", en: "full" };
  if (phaseAngle < 255) return { es: "gibosa menguante", en: "waning gibbous" };
  if (phaseAngle < 285) return { es: "cuarto menguante", en: "last quarter" };
  return { es: "menguante", en: "waning crescent" };
}

const compassEs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
const compassEn = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

export function compass(az: number, lang: "es" | "en") {
  const index = Math.round((((az % 360) + 360) % 360) / 45) % 8;
  return (lang === "es" ? compassEs : compassEn)[index]!;
}

export function formatCoords(city: City, lang: "es" | "en") {
  const ns = city.lat >= 0 ? "N" : "S";
  const ew = city.lon >= 0 ? (lang === "es" ? "E" : "E") : lang === "es" ? "O" : "W";
  return `${Math.abs(city.lat).toFixed(2)}°${ns} ${Math.abs(city.lon).toFixed(2)}°${ew}`;
}

export function localTime(city: City, date: Date, withSeconds = false) {
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: city.tz,
    hour: "2-digit",
    minute: "2-digit",
    ...(withSeconds ? { second: "2-digit" as const } : {}),
    hour12: false,
  }).format(date);
}
