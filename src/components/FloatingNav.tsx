import { motion } from "motion/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, User, Star, Sparkles, Mail } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useAuthorSheet } from "@/context/AuthorSheetContext";
import { springSheet, springFast, tap } from "@/lib/motion-config";
import type { StringKey } from "@/i18n/strings";

/**
 * <FloatingNav /> — el menú de secciones vive en botones flotantes de cristal,
 * separados del header. Están presentes desde el inicio y siguen visibles
 * mientras se scrollea (posición fija, sin ocultarse).
 *
 * Versión oscura: fondo Midnight Purple translúcido con texto claro, para
 * contrastar sobre el degradado líquido del fondo.
 */

type Item = { id: string; key: StringKey; Icon: typeof BookOpen };

const items: Item[] = [
  { id: "libros", key: "navBooks", Icon: BookOpen },
  { id: "autor", key: "navAuthor", Icon: User },
  { id: "orion", key: "navOrion", Icon: Sparkles },
  { id: "contacto", key: "navContact", Icon: Mail },
];

const pill =
  "label flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-2 text-seashell/80 transition-colors hover:text-seashell sm:px-4";

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ...springSheet, delay: 0.4, staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: springFast },
};

export function FloatingNav() {
  const { t } = useLang();
  const { openSheet } = useAuthorSheet();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLanding = pathname === "/";
  const hash = (id: string) => (isLanding ? `#${id}` : `/#${id}`);

  return (
    <motion.nav
      aria-label={t("menu")}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="pointer-events-none fixed inset-x-0 z-40 flex justify-center px-3"
      style={{ top: "calc(var(--header-height) + 12px)" }}
    >
      <ul
        className="pointer-events-auto grid w-full max-w-[520px] grid-cols-4 items-center gap-1 rounded-full border border-white/10 bg-midnight/80 p-1 shadow-2xl backdrop-blur-xl"
      >
        {items.map(({ id, key, Icon }) => (
          <motion.li key={id} variants={itemVariants} className="min-w-0">
            {id === "autor" ? (
              <motion.button
                type="button"
                whileTap={tap}
                onClick={openSheet}
                className={pill}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {t(key)}
              </motion.button>
            ) : id === "orion" ? (
              <Link to="/orion" className={pill} activeProps={{ className: `${pill} text-seashell` }}>
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {t(key)}
              </Link>
            ) : (
              <a href={hash(id)} className={pill}>
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {t(key)}
              </a>
            )}
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
}
