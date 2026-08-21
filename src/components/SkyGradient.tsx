import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTheme } from "@/context/ThemeContext";

/**
 * El cielo del sitio: un degradado base que evoluciona con el scroll del
 * documento, más tres manchas de luz que derivan lentamente (CSS puro) para dar
 * la sensación de líquido. Todo por motion values — ni un re-render por frame.
 *
 * Regla de luminosidad: en oscuro ninguna parada pasa del 45% de luminosidad,
 * en claro ninguna baja del 75%. Así el texto se lee sin scrims.
 */

const STOPS = [0, 0.3, 0.65, 1];

const DARK_TOP = ["#6B4A7A", "#4E2BCC", "#2A1550", "#170838"];
const DARK_BOTTOM = ["#3B2359", "#2A1550", "#170838", "#0F032D"];
const LIGHT_TOP = ["#F3EEF9", "#E9E0F7", "#DFD4F2", "#EFEFEF"];
const LIGHT_BOTTOM = ["#E4DAF4", "#D6C8EE", "#CBBAE8", "#DCD3EC"];

const BLOBS = [
  {
    className: "liquid-a",
    style: { top: "-18%", left: "-12%", width: "78vw", height: "78vw" },
    dark: "rgba(144,91,244,0.42)",
    light: "rgba(144,91,244,0.20)",
  },
  {
    className: "liquid-b",
    style: { top: "22%", right: "-16%", width: "70vw", height: "70vw" },
    dark: "rgba(78,43,204,0.45)",
    light: "rgba(78,43,204,0.16)",
  },
  {
    className: "liquid-c",
    style: { bottom: "-20%", left: "10%", width: "86vw", height: "86vw" },
    dark: "rgba(211,190,255,0.22)",
    light: "rgba(255,255,255,0.55)",
  },
] as const;

export function SkyGradient() {
  const { resolved } = useTheme();
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();

  const progress = useTransform(scrollYProgress, (v) => (reduced ? 0.5 : v));

  const dark = resolved === "dark";
  const top = useTransform(progress, STOPS, dark ? DARK_TOP : LIGHT_TOP);
  const bottom = useTransform(progress, STOPS, dark ? DARK_BOTTOM : LIGHT_BOTTOM);
  const backgroundImage = useTransform(
    [top, bottom],
    ([a, b]: string[]) => `linear-gradient(180deg, ${a} 0%, ${b} 100%)`,
  );

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-1 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ backgroundImage }} />
      {BLOBS.map((blob) => (
        <div
          key={blob.className}
          className={`absolute rounded-full ${reduced ? "" : blob.className}`}
          style={{
            ...blob.style,
            filter: "blur(90px)",
            backgroundImage: `radial-gradient(circle at 50% 50%, ${
              dark ? blob.dark : blob.light
            } 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}
