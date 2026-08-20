import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
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
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!heroSlot || !headerSlot || reduced) {
      setGeom(null);
      return;
    }
    const measure = () => {
      const hero = heroSlot.getBoundingClientRect();
      const dock = headerSlot.getBoundingClientRect();
      setGeom({
        heroX: hero.left,
        heroTopDoc: hero.top + window.scrollY,
        heroW: hero.width,
        dockX: dock.left,
        dockY: dock.top,
        dockW: dock.width,
        range: Math.max(240, window.innerHeight * 0.55),
      });
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
  }, [heroSlot, headerSlot, reduced]);

  const rawX = useTransform(scrollY, (s) => {
    if (!geom) return 0;
    return lerp(geom.heroX, geom.dockX, clamp01(s / geom.range));
  });
  const rawY = useTransform(scrollY, (s) => {
    if (!geom) return 0;
    const p = clamp01(s / geom.range);
    return lerp(geom.heroTopDoc - s, geom.dockY, p);
  });
  const rawW = useTransform(scrollY, (s) => {
    if (!geom) return 0;
    return lerp(geom.heroW, geom.dockW, clamp01(s / geom.range));
  });

  const x = useSpring(rawX, MIGRATE_SPRING);
  const y = useSpring(rawY, MIGRATE_SPRING);
  const width = useSpring(rawW, MIGRATE_SPRING);

  // Cuando el menú móvil a pantalla completa se abre, el logo fijo se aparta.
  useEffect(() => {
    const onOverlay = (event: Event) => setHidden((event as CustomEvent<boolean>).detail === true);
    window.addEventListener("logo-overlay", onOverlay as EventListener);
    return () => window.removeEventListener("logo-overlay", onOverlay as EventListener);
  }, []);

  const [ready, setReady] = useState(false);
  useMotionValueEvent(width, "change", (v) => {
    if (v > 0 && !ready) setReady(true);
  });
  useEffect(() => {
    if (geom) setReady(true);
  }, [geom]);

  if (!migrating || reduced || !geom) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-55"
      style={{ x, y, width, opacity: hidden ? 0 : ready ? 1 : 0 }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: hidden ? 0 : 1, scale: 1 }}
      transition={{ type: "spring", ...MIGRATE_SPRING }}
    >
      <LogoSmart className="h-auto w-full text-text" />
    </motion.div>
  );
}
