import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { RealSky } from "./RealSky";
import { LogoSmart } from "./LogoSmart";
import { useLang } from "@/context/LanguageContext";
import { springSoft } from "@/lib/motion-config";

/**
 * Hero: solo el cielo real y el logo. Ningún texto compite con ellos.
 */
export function Hero() {
  const { t } = useLang();
  const reduced = useReducedMotion();

  return (
    <section
      id="top"
      aria-label={t("brand")}
      className="sky-scope relative flex min-h-[92svh] items-center justify-center overflow-hidden"
    >
      <RealSky />

      <motion.div
        className="relative z-10 flex w-full flex-col items-center px-5"
        initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springSoft}
      >
        <LogoSmart className="w-[75vw] max-w-[900px] text-text sm:w-[48vw]" />
      </motion.div>

      <motion.a
        href="#libros"
        aria-label={t("heroScroll")}
        className="label absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {t("heroScroll")}
        <motion.span
          animate={reduced ? {} : { y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </motion.span>
      </motion.a>
    </section>
  );
}
