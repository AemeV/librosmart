import { motion } from "motion/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, User, Star, Sparkles, Mail } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useAuthorSheet } from "@/context/AuthorSheetContext";
import { spring, tap } from "@/lib/motion-config";
import type { StringKey } from "@/i18n/strings";

/**
 * <FloatingNav /> — el menú de secciones vive en botones flotantes de cristal,
 * separados del header. Están presentes desde el inicio y siguen visibles
 * mientras se scrollea (posición fija, sin ocultarse).
 */

type Item = { id: string; key: StringKey; Icon: typeof BookOpen };

const items: Item[] = [
  { id: "libros", key: "navBooks", Icon: BookOpen },
  { id: "autor", key: "navAuthor", Icon: User },
  { id: "resenas", key: "navReviews", Icon: Star },
  { id: "proyectos", key: "navProjects", Icon: Sparkles },
  { id: "contacto", key: "navContact", Icon: Mail },
];

const pill =
  "glass label flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-4 text-text-muted transition-colors hover:text-text";

export function FloatingNav() {
  const { t } = useLang();
  const { openSheet } = useAuthorSheet();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLanding = pathname === "/";
  const hash = (id: string) => (isLanding ? `#${id}` : `/#${id}`);

  return (
    <motion.nav
      aria-label={t("menu")}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.4 }}
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-3 sm:bottom-6"
    >
      <ul
        className="pointer-events-auto flex max-w-full items-center gap-2 overflow-x-auto rounded-full p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map(({ id, key, Icon }) => (
          <li key={id} className="shrink-0">
            {id === "autor" ? (
              <motion.button type="button" whileTap={tap} onClick={openSheet} className={pill}>
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {t(key)}
              </motion.button>
            ) : id === "proyectos" ? (
              <Link to="/proyectos" className={pill} activeProps={{ className: `${pill} text-text` }}>
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {t(key)}
              </Link>
            ) : (
              <a href={hash(id)} className={pill}>
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {t(key)}
              </a>
            )}
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
