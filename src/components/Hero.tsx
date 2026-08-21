import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { BorderBeam } from "border-beam";
import { LogoSmart } from "./LogoSmart";
import { PlanetGlow } from "./PlanetGlow";

import { useLang } from "@/context/LanguageContext";
import { useLogoMigration } from "@/context/LogoMigrationContext";
import { useTheme } from "@/context/ThemeContext";
import { useSiteContent } from "@/context/SiteContentContext";
import { tap } from "@/lib/motion-config";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Hero: casi vacío a propósito. Logo grande, pastilla de anuncio y un solo
 * botón. El fondo lo pone <SkyGradient />, no este componente.
 */
export function Hero() {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const { resolved } = useTheme();
  const { setHeroSlot, migrating } = useLogoMigration();
  const { books } = useSiteContent();
  const visible = books.filter((book) => book.published !== false);
  const featured = visible.find((book) => book.featured) ?? visible[0] ?? books[0]!;

  const rise = (index: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: index * 0.12, ease: EASE },
  });

  const goToFeaturedBook = () => {
    const target = document.getElementById(`book-${featured.slug}`);
    if (!target) return;
    const offset = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--header-height") || "104",
      10,
    );
    const y = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section
      id="top"
      aria-label={t("brand")}
      className="relative flex flex-col items-center overflow-hidden px-5"
      style={{ minHeight: "88svh", paddingTop: "var(--header-height)" }}
    >
      <PlanetGlow />

      <motion.div
        {...rise(0)}
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-5"
        style={{ paddingTop: "var(--header-height)" }}
      >
        <div
          ref={setHeroSlot}
          className="w-[82vw] max-w-[1200px] sm:w-[62vw]"
          style={{ aspectRatio: "237.23 / 54.31" }}
        >
          <LogoSmart className={`h-full w-full ${migrating ? "opacity-0" : "opacity-100"}`} />
        </div>
      </motion.div>

      <div className="z-1 mt-auto flex w-full flex-col items-center pb-24 sm:pb-28">
        <motion.div {...rise(1)}>
          <BorderBeam
            size="pulse-inner"
            colorVariant="mono"
            theme={resolved}
            strength={1}
            className="inline-flex"
          >
            <motion.button
              type="button"
              onClick={goToFeaturedBook}
              whileTap={tap}
              whileHover={reduced ? {} : { y: -2 }}
              className="glass group flex flex-col items-center gap-0.5 rounded-full px-7 py-3 text-center"
            >
              <span className="label">{t("heroNew")}</span>
              <span className="pill-title">{featured.title}</span>
            </motion.button>
          </BorderBeam>
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="mt-3 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <span className="label">{t("heroScroll")}</span>
          <motion.span
            animate={reduced ? {} : { y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
