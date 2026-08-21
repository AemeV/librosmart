import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTheme } from "@/context/ThemeContext";

/**
 * Planeta con luz de borde detrás del logo del hero. CSS puro: cuerpo que asoma
 * desde abajo, arco especular fino en el limbo y halo morado difuso que se
 * expande hacia arriba. El cuerpo se desvanece hacia abajo con una máscara, así
 * que el degradado del sitio continúa sin corte.
 *
 * En oscuro el planeta es casi negro (como los referentes); en claro es lila
 * suave para no romper la regla de luminosidad del tema claro.
 */

const BODY = {
  dark: "radial-gradient(circle at 50% 0%, rgba(70,38,126,0.92) 0%, rgba(20,7,48,0.98) 26%, #0b0220 58%)",
  light:
    "radial-gradient(circle at 50% 0%, rgba(196,176,240,0.95) 0%, rgba(170,148,226,0.9) 26%, rgba(150,128,212,0.85) 58%)",
};

const HALO = {
  dark: "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(178,140,255,0.55) 0%, rgba(120,72,220,0.28) 40%, transparent 75%)",
  light:
    "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(255,255,255,0.95) 0%, rgba(200,178,255,0.5) 40%, transparent 75%)",
};

const LIMB = {
  dark: "0 -1px 0 0.5px rgba(255,255,255,0.95), 0 -2px 18px rgba(200,170,255,0.75), 0 -6px 60px rgba(144,91,244,0.5)",
  light:
    "0 -1px 0 0.5px rgba(255,255,255,0.98), 0 -2px 16px rgba(255,255,255,0.9), 0 -6px 54px rgba(178,140,255,0.55)",
};

const FADE = "linear-gradient(180deg, #000 0%, #000 28%, rgba(0,0,0,0) 96%)";

export function PlanetGlow() {
  const reduced = useReducedMotion() ?? false;
  const { resolved } = useTheme();
  const dark = resolved === "dark";
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.25], reduced ? [0, 0] : [0, 90]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-1 overflow-hidden"
      style={{
        height: "62%",
        y,
        maskImage: FADE,
        WebkitMaskImage: FADE,
      }}
    >
      {/* Halo difuso que sube desde el limbo */}
      <div
        className={`absolute left-1/2 h-[70%] w-[160%] -translate-x-1/2 ${
          reduced ? "" : "halo-breath"
        }`}
        style={{
          bottom: "34%",
          filter: "blur(60px)",
          backgroundImage: dark ? HALO.dark : HALO.light,
        }}
      />

      {/* Planetas menores orbitando por detrás */}
      {MOONS.map((moon) => (
        <div
          key={moon.className}
          className={`absolute rounded-full ${reduced ? "" : moon.className}`}
          style={{
            left: moon.left,
            top: moon.top,
            width: moon.size,
            height: moon.size,
            backgroundImage: dark ? MOON_BODY.dark : MOON_BODY.light,
            boxShadow: dark ? MOON_RIM.dark : MOON_RIM.light,
            opacity: moon.opacity,
          }}
        />
      ))}


      {/* Cuerpo del planeta */}
      <div
        className="absolute left-1/2 aspect-square w-[190%] -translate-x-1/2 rounded-full"
        style={{ top: "52%", backgroundImage: dark ? BODY.dark : BODY.light }}
      />

      {/* Arco especular del limbo */}
      <div
        className="absolute left-1/2 aspect-square w-[190%] -translate-x-1/2 rounded-full"
        style={{ top: "52%", boxShadow: dark ? LIMB.dark : LIMB.light }}
      />
    </motion.div>
  );
}
