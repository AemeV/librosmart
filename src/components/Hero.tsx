import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { BorderBeam } from "border-beam";
import { LogoSmart } from "./LogoSmart";
import { useLang } from "@/context/LanguageContext";
import { useLogoMigration } from "@/context/LogoMigrationContext";
import { useTheme } from "@/context/ThemeContext";
import { books } from "@/data/books";
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
  const featured = books.find((book) => book.featured) ?? books[0]!;

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
      className="relative flex flex-col items-center justify-center gap-10 px-5"
      style={{ minHeight: "88svh", paddingTop: "var(--header-height)" }}
    >
      <motion.div {...rise(0)} className="flex w-full justify-center">
        <div
          ref={setHeroSlot}
          className="w-[82vw] max-w-[1200px] sm:w-[62vw]"
          style={{ aspectRatio: "237.23 / 54.31" }}
        >
          <LogoSmart className={`h-full w-full ${migrating ? "opacity-0" : "opacity-100"}`} />
        </div>
      </motion.div>

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
            <span className="flex items-center gap-2">
              <span className="pill-title">{featured.title}</span>
              <motion.span
                aria-hidden="true"
                className="flex items-center"
                variants={{ rest: { y: 0 }, hover: { y: 2 } }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </span>
          </motion.button>
        </BorderBeam>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute bottom-6 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <span className="label">{t("heroScroll")}</span>
        <motion.span
          animate={reduced ? {} : { y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </motion.div>
    </section>
  );
}
