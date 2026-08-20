import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTheme } from "@/context/ThemeContext";

/**
 * El cielo del sitio: un único degradado fijo que evoluciona con el scroll del
 * documento completo. Todo va por motion values puros — ni un solo re-render de
 * React por frame. Con prefers-reduced-motion se congela en el progreso 0.5.
 *
 * Regla de luminosidad: en oscuro ninguna parada pasa del 45% de luminosidad,
 * en claro ninguna baja del 75%. Así el texto se lee sin scrims.
 */

const STOPS = [0, 0.3, 0.65, 1];

const DARK_TOP = ["#6B4A7A", "#4E2BCC", "#2A1550", "#170838"];
const DARK_BOTTOM = ["#3B2359", "#2A1550", "#170838", "#0F032D"];
const LIGHT_TOP = ["#F3EEF9", "#E9E0F7", "#DFD4F2", "#EFEFEF"];
const LIGHT_BOTTOM = ["#E4DAF4", "#D6C8EE", "#CBBAE8", "#DCD3EC"];

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
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-1"
      style={{ backgroundImage }}
    />
  );
}
