import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLogoMigration } from "@/context/LogoMigrationContext";
import { LogoSmart } from "./LogoSmart";

/**
 * El logo único del sitio. Vive fijo en la ventana y viaja del centro del hero
 * (55vw desktop / 80vw mobile, definido por el hueco del hero) a su posición en
 * el header, ligado al progreso de scroll — no a un umbral binario.
 */
const MIGRATE_SPRING = { stiffness: 200, damping: 28 };

type Geometry = {
  heroX: number;
  heroTopDoc: number;
  heroW: number;
  dockX: number;
  dockY: number;
  dockW: number;
  range: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function MigratingLogo() {
  const { heroSlot, headerSlot, migrating } = useLogoMigration();
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const [geom, setGeom] = useState<Geometry | null>(null);
  const geomRef = useRef<Geometry | null>(null);
  const settled = useRef(false);

  // Springs imperativos: se actualizan al hacer scroll y al medir la geometría.
  const x = useSpring(0, MIGRATE_SPRING);
  const y = useSpring(0, MIGRATE_SPRING);
  const width = useSpring(0, MIGRATE_SPRING);
  const progress = useMotionValue(0);

  const apply = useCallback(
    (s: number, jump = false) => {
      const g = geomRef.current;
      if (!g) return;
      const p = clamp01(s / g.range);
      const nx = lerp(g.heroX, g.dockX, p);
      const ny = lerp(g.heroTopDoc - s, g.dockY, p);
      const nw = lerp(g.heroW, g.dockW, p);
      progress.set(p);
      if (jump) {
        x.jump(nx);
        y.jump(ny);
        width.jump(nw);
        return;
      }
      x.set(nx);
      y.set(ny);
      width.set(nw);
    },
    [progress, width, x, y],
  );

  useEffect(() => {
    if (!heroSlot || !headerSlot || reduced) {
      geomRef.current = null;
      settled.current = false;
      setGeom(null);
      return;
    }
    const measure = () => {
      const hero = heroSlot.getBoundingClientRect();
      const dock = headerSlot.getBoundingClientRect();
      if (hero.width < 1 || dock.width < 1) return;
      const next: Geometry = {
        heroX: hero.left,
        heroTopDoc: hero.top + window.scrollY,
        heroW: hero.width,
        dockX: dock.left,
        dockY: dock.top,
        dockW: dock.width,
        range: Math.max(240, window.innerHeight * 0.55),
      };
      geomRef.current = next;
      setGeom(next);
      // La primera medición coloca el logo sin animación de entrada.
      apply(window.scrollY, !settled.current);
      settled.current = true;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(heroSlot);
    ro.observe(headerSlot);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [heroSlot, headerSlot, reduced, apply]);

  useMotionValueEvent(scrollY, "change", (s) => apply(s));

  if (!migrating || reduced || !geom) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-55"
      style={{ x, y, width }}
    >
      <LogoSmart className="h-auto w-full" />
    </motion.div>
  );
}
