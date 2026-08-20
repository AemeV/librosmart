import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { springFast, tap } from "@/lib/motion-config";
import {
  cities,
  compass,
  formatCoords,
  localTime,
  moonPhaseName,
  planetNames,
  type City,
  type SkyState,
} from "@/lib/sky";
import { SkyLayer, type PlanetHit } from "./SkyLayer";

/**
 * Cielo astronómico real del hero: refleja siempre las condiciones de la
 * ciudad seleccionada, sin importar el tema de la interfaz.
 */
export function RealSky() {
  const { lang, t } = useLang();
  const reducedRaw = useReducedMotion();
  const reduced = Boolean(reducedRaw);
  const isMobile = useIsMobile();
  const starLimit = isMobile ? 80 : 200;

  const [city, setCity] = useState<City>(cities[0]!);
  const [previous, setPrevious] = useState<City | null>(null);
  const [state, setState] = useState<SkyState | null>(null);
  const [hits, setHits] = useState<PlanetHit[]>([]);
  const [hover, setHover] = useState<PlanetHit | null>(null);
  const [clock, setClock] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setClock(new Date());
    const id = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const selectCity = (next: City) => {
    if (next.id === city.id) return;
    setPrevious(city);
    setCity(next);
    setState(null);
    setHover(null);
    window.setTimeout(() => setPrevious(null), 850);
  };

  const brightness = state?.palette.brightness ?? 0.5;
  const scrimOpacity = 0.16 + brightness * 0.42;

  const onPointerMove = (event: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let found: PlanetHit | null = null;
    for (const hit of hits) {
      if (Math.hypot(hit.x - x, hit.y - y) < 22) {
        found = hit;
        break;
      }
    }
    setHover(found);
  };

  const moonLabel = state
    ? `${planetNames['moon']![lang].toUpperCase()} ${Math.round(state.moon.fraction * 100)}% ${moonPhaseName(
        state.moon.phaseAngle,
      )[lang].toUpperCase()}`
    : null;

  const brightestPlanet = state?.planets.slice().sort((a, b) => a.mag - b.mag)[0];
  const planetLabel = brightestPlanet
    ? `${planetNames[brightestPlanet.id]![lang].toUpperCase()} ${t("skyVisible").toUpperCase()} ${Math.round(
        brightestPlanet.alt,
      )}° ${compass(brightestPlanet.az, lang)}`
    : null;

  return (
    <>
      <div
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHover(null)}
        className="absolute inset-0 overflow-hidden"
      >
        {previous && (
          <SkyLayer
            key={previous.id}
            city={previous}
            visible={false}
            starLimit={starLimit}
            reduced={reduced}
          />
        )}
        <SkyLayer
          key={city.id}
          city={city}
          visible
          starLimit={starLimit}
          reduced={reduced}
          onState={setState}
          onHits={setHits}
        />

        {/* Scrim: garantiza contraste del texto sobre cualquier estado del cielo. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: scrimOpacity,
            backgroundImage: [
              "linear-gradient(100deg, rgba(4,6,14,0.96) 0%, rgba(4,6,14,0.72) 38%, rgba(4,6,14,0.12) 70%, rgba(4,6,14,0) 100%)",
              "linear-gradient(180deg, rgba(4,6,14,0.5) 0%, rgba(4,6,14,0.12) 55%, rgba(4,6,14,0.35) 100%)",
            ].join(", "),
          }}
        />

        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={springFast}
              className="glass pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[150%] rounded-full px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] whitespace-nowrap"
              style={{ left: hover.x, top: hover.y }}
            >
              {(planetNames[hover.id]?.[lang] ?? hover.name).toUpperCase()} ·{" "}
              {Math.round(hover.alt)}° {compass(hover.az, lang)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selector de ciudades */}
      <div className="pointer-events-auto absolute top-28 right-4 z-20 sm:right-6 sm:top-32">
        <div
          role="group"
          aria-label={t("skyCityLabel")}
          className="glass flex items-center gap-1 rounded-full p-1"
        >
          {cities.map((option) => (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => selectCity(option)}
              whileTap={tap}
              aria-pressed={option.id === city.id}
              className="relative flex h-9 items-center justify-center rounded-full px-3"
            >
              {option.id === city.id && (
                <motion.span
                  layoutId="sky-city"
                  transition={springFast}
                  className="absolute inset-0 rounded-full bg-white/22"
                />
              )}
              <span
                className={`relative z-1 font-mono text-[11px] tracking-[0.08em] uppercase ${
                  option.id === city.id ? "opacity-100" : "opacity-65"
                }`}
              >
                {option.name}
              </span>
            </motion.button>
          ))}
        </div>
        <p className="mt-2 text-right font-mono text-[11px] tracking-[0.08em] opacity-70">
          {clock ? localTime(city, clock, true) : "--:--:--"}
        </p>
      </div>

      {/* Capa informativa */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-20 max-w-[calc(100%-2rem)] sm:bottom-6 sm:left-6">
        <p className="glass rounded-full px-4 py-2 font-mono text-[10px] leading-relaxed tracking-[0.08em] uppercase sm:text-[11px]">
          {city.name} · {formatCoords(city, lang)}{clock ? ` · ${localTime(city, clock)}` : ""}
          {moonLabel ? ` · ${moonLabel}` : ""}
          {planetLabel ? ` · ${planetLabel}` : ""}
        </p>
      </div>
    </>
  );
}
