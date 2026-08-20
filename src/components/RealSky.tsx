import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
 * ciudad seleccionada, sin importar el tema de la interfaz. Toda la
 * composición vive en el eje central: logo, chips de ciudad y panel de datos.
 */
export function RealSky({ children }: { children?: ReactNode }) {
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
            lang={lang}
            mobile={isMobile}
          />
        )}
        <SkyLayer
          key={city.id}
          city={city}
          visible
          starLimit={starLimit}
          reduced={reduced}
          lang={lang}
          mobile={isMobile}
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
              "radial-gradient(60% 45% at 50% 48%, rgba(4,6,14,0.9) 0%, rgba(4,6,14,0.55) 55%, rgba(4,6,14,0) 100%)",
              "linear-gradient(180deg, rgba(4,6,14,0.35) 0%, rgba(4,6,14,0.1) 45%, rgba(4,6,14,0.4) 100%)",
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
              className="glass pointer-events-none absolute z-20 label -translate-x-1/2 -translate-y-[150%] rounded-full px-3 py-1.5 whitespace-nowrap"
              style={{ left: hover.x, top: hover.y }}
            >
              {(planetNames[hover.id]?.[lang] ?? hover.name).toUpperCase()} ·{" "}
              {Math.round(hover.alt)}° {compass(hover.az, lang)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Composición centrada: logo, ciudades y datos, en columna sobre el eje. */}
      <div
        className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-5 pb-14"
        style={{ paddingTop: "var(--header-height)" }}
      >
        {children}

        <div className="flex flex-col items-center gap-3">
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
                className="relative flex h-9 items-center justify-center rounded-full px-3.5"
              >
                {option.id === city.id && (
                  <motion.span
                    layoutId="sky-city"
                    transition={springFast}
                    className="absolute inset-0 rounded-full bg-white/22"
                  />
                )}
                <span
                  className={`label relative z-1 ${
                    option.id === city.id ? "opacity-100" : "opacity-65"
                  }`}
                >
                  {option.name}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Panel de datos: una línea cuando cabe, dos líneas centradas en móvil. */}
          <p className="glass label flex max-w-[92vw] flex-wrap items-center justify-center gap-x-2 gap-y-0.5 rounded-full px-4 py-2 text-center">
            <span>
              {city.name} · {formatCoords(city, lang)}
            </span>
            <span className="hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <span>
              {clock ? localTime(city, clock) : "--:--"}
              {moonLabel ? ` · ${moonLabel}` : ""}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
