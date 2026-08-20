import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
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

  useEffect(() => {
    if (!heroSlot || !headerSlot || reduced) {
      setGeom(null);
      return;
    }
    const measure = () => {
      const hero = heroSlot.getBoundingClientRect();
      const dock = headerSlot.getBoundingClientRect();
      if (hero.width < 1 || dock.width < 1) return;
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

  const progress = useTransform(scrollY, (s) => (geom ? clamp01(s / geom.range) : 0));
  const rawX = useTransform(scrollY, (s) =>
    geom ? lerp(geom.heroX, geom.dockX, clamp01(s / geom.range)) : 0,
  );
  const rawY = useTransform(scrollY, (s) =>
    geom ? lerp(geom.heroTopDoc - s, geom.dockY, clamp01(s / geom.range)) : 0,
  );
  const rawW = useTransform(scrollY, (s) =>
    geom ? lerp(geom.heroW, geom.dockW, clamp01(s / geom.range)) : 0,
  );

  const x = useSpring(rawX, MIGRATE_SPRING);
  const y = useSpring(rawY, MIGRATE_SPRING);
  const width = useSpring(rawW, MIGRATE_SPRING);

  // Sobre el cielo el logo es claro; en el header toma el color del tema.
  const skyOpacity = useTransform(progress, [0, 0.85], [1, 0]);
  const themeOpacity = useTransform(progress, [0.35, 1], [0, 1]);

  if (!migrating || reduced || !geom) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-55"
      style={{ x, y, width }}
    >
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <motion.div style={{ opacity: skyOpacity, color: "#f7f8fb" }}>
          <LogoSmart className="h-auto w-full" />
        </motion.div>
        <motion.div className="absolute inset-0" style={{ opacity: themeOpacity }}>
          <LogoSmart className="h-auto w-full text-text" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
