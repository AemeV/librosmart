import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Instagram, Youtube, Facebook, Music2, Sun, Moon, Monitor, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useLang } from "@/context/LanguageContext";
import { useAuthorSheet } from "@/context/AuthorSheetContext";
import { useTheme } from "@/context/ThemeContext";
import { springFast, tap } from "@/lib/motion-config";
import type { StringKey } from "@/i18n/strings";
import { LogoSmart } from "./LogoSmart";

const navItems: { id: string; key: StringKey }[] = [
  { id: "libros", key: "navBooks" },
  { id: "autor", key: "navAuthor" },
  { id: "resenas", key: "navReviews" },
  { id: "proyectos", key: "navProjects" },
  { id: "contacto", key: "navContact" },
];

const socials = [
  { name: "Instagram", href: "https://instagram.com/", Icon: Instagram },
  { name: "YouTube", href: "https://youtube.com/", Icon: Youtube },
  { name: "TikTok", href: "https://tiktok.com/", Icon: Music2 },
  { name: "Facebook", href: "https://facebook.com/", Icon: Facebook },
];

function LanguageToggle() {
  const { lang, setLang, t } = useLang();
  return (
    <div
      role="group"
      aria-label={t("langLabel")}
      className="glass flex items-center rounded-full p-0.5"
    >
      {(["es", "en"] as const).map((option) => (
        <motion.button
          key={option}
          type="button"
          onClick={() => setLang(option)}
          whileTap={tap}
          aria-pressed={lang === option}
          className="relative flex h-9 min-w-11 items-center justify-center rounded-full px-3"
        >
          {lang === option && (
            <motion.span
              layoutId="lang-indicator"
              transition={springFast}
              className="absolute inset-0 rounded-full bg-text/10"
            />
          )}
          <span className={`label relative z-1 ${lang === option ? "text-text" : ""}`}>
            {option}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

function ThemeToggle() {
  const { mode, cycle } = useTheme();
  const { t } = useLang();
  const label =
    mode === "light" ? t("themeLight") : mode === "dark" ? t("themeDark") : t("themeSystem");
  const Icon = mode === "light" ? Sun : mode === "dark" ? Moon : Monitor;

  return (
    <motion.button
      type="button"
      onClick={cycle}
      whileTap={tap}
      aria-label={label}
      title={label}
      className="glass flex h-11 w-11 items-center justify-center rounded-full"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mode}
          initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
          transition={springFast}
          className="flex items-center justify-center"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

/**
 * Subheader: vive DEBAJO del hero y se pega arriba al hacer scroll.
 * Se esconde al bajar y reaparece al subir.
 */
export function Header() {
  const { t } = useLang();
  const { openSheet } = useAuthorSheet();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLanding = pathname === "/";
  /** En rutas internas los anclajes de la landing deben volver a "/". */
  const hash = (id: string) => (isLanding ? `#${id}` : `/#${id}`);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastY, setLastY] = useState(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (Math.abs(y - lastY) > 8) {
      setVisible(y < lastY || y < 120);
      setLastY(y);
    }
  });

  return (
    <div className="sticky top-0 z-50">
      <motion.div
        animate={{ y: visible ? 0 : "-105%" }}
        transition={springFast}
        className="glass border-b border-line"
      >
        <div className="mx-auto grid max-w-[1100px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <LogoSmart className="h-5 w-auto shrink-0 text-text" />
            <span className="label hidden sm:block">{t("brandTagline")}</span>
          </Link>

          <div className="flex items-center justify-end gap-2">
            <nav aria-label={t("menu")} className="hidden lg:block">
              <ul className="flex items-center gap-5">
                {navItems.map((item) =>
                  item.id === "autor" ? (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={openSheet}
                        className="label transition-colors hover:text-text"
                      >
                        {t(item.key)}
                      </button>
                    </li>
                  ) : item.id === "proyectos" ? (
                    <li key={item.id}>
                      <Link
                        to="/proyectos"
                        activeProps={{ className: "text-text" }}
                        className="label transition-colors hover:text-text"
                      >
                        {t(item.key)}
                      </Link>
                    </li>
                  ) : (
                    <li key={item.id}>
                      <a href={hash(item.id)} className="label transition-colors hover:text-text">
                        {t(item.key)}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            <nav aria-label={t("follow")} className="hidden items-center gap-0.5 md:flex">
              {socials.map(({ name, href, Icon }) => (
                <motion.a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={tap}
                  aria-label={name}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-text-muted transition-colors hover:text-text"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </motion.a>
              ))}
            </nav>

            <LanguageToggle />
            <ThemeToggle />

            <motion.button
              type="button"
              whileTap={tap}
              onClick={() => setMenuOpen(true)}
              aria-label={t("menu")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="glass fixed inset-0 z-60 flex flex-col px-6 py-5 lg:hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={springFast}
          >
            <div className="flex items-center justify-between">
              <LogoSmart className="h-5 w-auto text-text" />
              <motion.button
                type="button"
                whileTap={tap}
                onClick={() => setMenuOpen(false)}
                aria-label={t("close")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </div>

            <ul className="mt-10 flex flex-col items-center gap-2 text-center">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springFast, delay: 0.04 * index }}
                >
                  {item.id === "autor" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        openSheet();
                      }}
                      className="tight block py-3 text-3xl font-medium"
                    >
                      {t(item.key)}
                    </button>
                  ) : item.id === "proyectos" ? (
                    <Link
                      to="/proyectos"
                      onClick={() => setMenuOpen(false)}
                      className="tight block py-3 text-3xl font-medium"
                    >
                      {t(item.key)}
                    </Link>
                  ) : (
                    <a
                      href={hash(item.id)}
                      onClick={() => setMenuOpen(false)}
                      className="tight block py-3 text-3xl font-medium"
                    >
                      {t(item.key)}
                    </a>
                  )}
                </motion.li>
              ))}
            </ul>

            <div className="mt-auto flex items-center justify-center gap-2">
              {socials.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-text-muted"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
