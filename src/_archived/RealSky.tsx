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
import { SkyBodyCard } from "./SkyBodyCard";

/** Media circular de azimuts: el punto del horizonte donde hay más planetas. */
function circularMean(degrees: number[]) {
  if (degrees.length === 0) return 180;
  let x = 0;
  let y = 0;
  for (const d of degrees) {
    x += Math.cos((d * Math.PI) / 180);
    y += Math.sin((d * Math.PI) / 180);
  }
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/**
 * Cielo astronómico real del hero, en proyección panorámica y navegable:
 * se arrastra horizontalmente para girar el horizonte, con inercia y
 * desplazamiento envolvente. Los planetas son focalizables y abren su ficha.
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
  const [selected, setSelected] = useState<PlanetHit | null>(null);
  const [heading, setHeading] = useState(180);
  const [clock, setClock] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const viewAzRef = useRef(180);
  const centeredForCity = useRef<string | null>(null);
  const drag = useRef({ active: false, axis: "" as "" | "x" | "y", x: 0, y: 0, vx: 0, last: 0 });
  const inertia = useRef(0);

  useEffect(() => {
    setClock(new Date());
    const id = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // La brújula necesita re-render, pero el canvas no: se refresca a 8fps.
  useEffect(() => {
    const id = window.setInterval(() => setHeading(viewAzRef.current), 125);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => () => cancelAnimationFrame(inertia.current), []);

  const receiveState = (next: SkyState) => {
    setState(next);
    // Al cargar cada ciudad, centrar donde haya más planetas visibles.
    if (centeredForCity.current !== next.city.id) {
      centeredForCity.current = next.city.id;
      const interesting = next.planets.map((p) => p.az);
      if (next.moon.alt > 0) interesting.push(next.moon.az);
      viewAzRef.current = circularMean(interesting.length > 0 ? interesting : [next.sunAz]);
      setHeading(viewAzRef.current);
    }
  };

  const selectCity = (next: City) => {
    if (next.id === city.id) return;
    setPrevious(city);
    setCity(next);
    setState(null);
    setSelected(null);
    window.setTimeout(() => setPrevious(null), 850);
  };

  const spin = (deltaPx: number) => {
    const width = containerRef.current?.clientWidth ?? 1200;
    const hfov = isMobile ? 150 : 210;
    viewAzRef.current = (((viewAzRef.current - (deltaPx / width) * hfov) % 360) + 360) % 360;
  };

  const onPointerDown = (event: React.PointerEvent) => {
    cancelAnimationFrame(inertia.current);
    drag.current = {
      active: true,
      axis: "",
      x: event.clientX,
      y: event.clientY,
      vx: 0,
      last: performance.now(),
    };
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = event.clientX - d.x;
    const dy = event.clientY - d.y;
    if (d.axis === "") {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      // Si el gesto es más vertical que horizontal, el scroll de la página pasa.
      d.axis = Math.abs(dy) > Math.abs(dx) ? "y" : "x";
      if (d.axis === "y") {
        d.active = false;
        return;
      }
      containerRef.current?.setPointerCapture?.(event.pointerId);
    }
    if (d.axis !== "x") return;
    const now = performance.now();
    const dt = Math.max(8, now - d.last);
    d.vx = dx / dt;
    d.last = now;
    d.x = event.clientX;
    d.y = event.clientY;
    spin(dx);
  };

  const onPointerUp = () => {
    const d = drag.current;
    const wasDragging = d.active && d.axis === "x";
    d.active = false;
    if (!wasDragging || reduced) return;
    let v = d.vx * 16; // px por frame
    const step = () => {
      v *= 0.94;
      spin(v);
      if (Math.abs(v) > 0.08) inertia.current = requestAnimationFrame(step);
    };
    if (Math.abs(v) > 0.5) inertia.current = requestAnimationFrame(step);
  };

  const brightness = state?.palette.brightness ?? 0.5;
  const scrimOpacity = 0.16 + brightness * 0.42;

  const moonLabel = state
    ? `${planetNames["moon"]![lang].toUpperCase()} ${Math.round(
        state.moon.fraction * 100,
      )}% ${moonPhaseName(state.moon.phaseAngle)[lang].toUpperCase()}`
    : null;

  return (
    <>
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="absolute inset-0 overflow-hidden"
        style={{ touchAction: "pan-y", cursor: "grab" }}
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
            viewAzRef={viewAzRef}
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
          viewAzRef={viewAzRef}
          onState={receiveState}
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

        {/* Cuerpos interactivos: botones reales sobre el canvas, focalizables. */}
        {hits.map((hit) => (
          <button
            key={hit.id}
            type="button"
            onClick={() => setSelected(hit)}
            aria-label={`${t("skyOpenBody")} ${planetNames[hit.id]?.[lang] ?? hit.name}`}
            className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
            style={{
              left: hit.x,
              top: hit.y,
              width: Math.max(44, hit.r * 2.4),
              height: Math.max(44, hit.r * 2.4),
            }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-[18%] rounded-full border border-white/0 transition-colors group-hover:border-white/60 group-focus-visible:border-white/70"
            />
          </button>
        ))}

        <AnimatePresence>
          {selected && <SkyBodyCard hit={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>
      </div>

      {/* Composición centrada: logo, ciudades, datos y brújula, sobre el eje. */}
      <div
        className="pointer-events-none relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-5 pb-14"
        style={{ paddingTop: "var(--header-height)" }}
      >
        {children}

        <div className="pointer-events-auto flex flex-col items-center gap-3">
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

      {/* Brújula: dirección actual de la vista, en el eje central. */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
        <p className="glass label flex items-center gap-2 rounded-full px-3.5 py-1.5">
          <span className="opacity-60">{t("skyCompass")}</span>
          <span>{compass(heading, lang)}</span>
          <span className="opacity-60">{Math.round(heading)}°</span>
          <span className="hidden opacity-45 sm:inline">· {t("skyDragHint")}</span>
        </p>
      </div>
    </>
  );
}
