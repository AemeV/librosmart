import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { RealSky } from "./RealSky";
import { useLang } from "@/context/LanguageContext";
import { CrossfadeText } from "./CrossfadeText";
import { easeEnter } from "@/lib/motion-config";

export function Hero() {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();

  return (
    <section
      id="top"
      className="sky-scope relative flex min-h-[92svh] items-center overflow-hidden pt-32 pb-24"
    >
      <RealSky />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-6">
        <motion.p
          className="meta"
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={easeEnter}
        >
          {t("heroKicker")}
        </motion.p>

        <motion.h1
          className="display mt-5 max-w-3xl text-[clamp(2.75rem,10vw,5.5rem)] leading-[0.98]"
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...easeEnter, delay: 0.08 }}
        >
          <CrossfadeText k={`hero-${lang}`} as="span">
            {t("heroTitle")}
          </CrossfadeText>
        </motion.h1>

        <motion.div
          className="mt-7 max-w-xl"
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...easeEnter, delay: 0.16 }}
        >
          <CrossfadeText k={`hero-sub-${lang}`} as="p" className="text-lg text-text-muted">
            {t("heroSubtitle")}
          </CrossfadeText>
        </motion.div>

        <motion.a
          href="#libros"
          className="meta mt-14 inline-flex items-center gap-2 text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...easeEnter, delay: 0.3 }}
        >
          {t("heroScroll")}
          <motion.span
            animate={reduced ? {} : { y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}
