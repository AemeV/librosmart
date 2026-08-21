import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Instagram, Youtube, Facebook, Music2, Sun, Moon, Monitor, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useLang } from "@/context/LanguageContext";
import { useAuthorSheet } from "@/context/AuthorSheetContext";
import { useLogoMigration } from "@/context/LogoMigrationContext";
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
 * Dos barras imantadas al borde superior de la ventana desde el primer frame.
 * La barra superior nunca se oculta; el subheader con el menú se esconde al
 * bajar y reaparece al subir. El hero queda por debajo: el cielo se ve a
 * través del cristal.
 */
export function Header() {
  const { t } = useLang();
  const { openSheet } = useAuthorSheet();
  const { setHeaderSlot, migrating } = useLogoMigration();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLanding = pathname === "/";
  /** En rutas internas los anclajes de la landing deben volver a "/". */
  const hash = (id: string) => (isLanding ? `#${id}` : `/#${id}`);
  const { scrollY } = useScroll();
  const [navVisible, setNavVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (Math.abs(y - lastY.current) > 8) {
      setNavVisible(y < lastY.current || y < 120);
      lastY.current = y;
    }
  });

  // --header-height: altura real de las dos barras, para el scroll-margin de las anclas.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const apply = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${Math.round(el.getBoundingClientRect().height)}px`,
      );
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** Al tocar el logo se vuelve al banner de inicio (arriba del todo). */
  const scrollTop = () => {
    setMenuOpen(false);
    if (isLanding) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div ref={wrapperRef} className="fixed inset-x-0 top-0 z-50">
        {/* Barra superior: siempre visible. El logo queda centrado con el eje del
            viewport en cualquier tamaño; los controles flotan a los costados. */}
        <div className="glass border-b border-line">
          <div className="relative mx-auto flex max-w-[1100px] items-center justify-center px-5 py-3 sm:px-6">
            <nav
              aria-label={t("follow")}
              className="absolute left-5 hidden items-center gap-0.5 sm:left-6 lg:flex"
            >
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

            <Link
              to="/"
              onClick={scrollTop}
              className="flex items-center justify-center"
              aria-label={t("brand")}
            >
              <span
                ref={setHeaderSlot}
                className="block h-9 shrink-0"
                style={{ width: 158 }}
                aria-hidden={migrating ? true : undefined}
              >
                <LogoSmart
                  className={`h-auto w-full transition-opacity ${
                    migrating ? "opacity-0" : "opacity-100"
                  }`}
                />
              </span>
            </Link>

            <div className="absolute right-5 hidden items-center gap-2 sm:right-6 lg:flex">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            <motion.button
              type="button"
              whileTap={tap}
              onClick={() => setMenuOpen(true)}
              aria-label={t("menu")}
              className="absolute right-5 flex h-11 w-11 items-center justify-center rounded-full border border-line sm:right-6 lg:hidden"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          </div>
        </div>


        {/* Subheader: el menú se oculta al bajar y vuelve al subir */}
        <motion.div
          animate={{ y: navVisible ? 0 : "-105%", opacity: navVisible ? 1 : 0 }}
          transition={springFast}
          className="glass hidden border-b border-line lg:block"
        >
          <nav
            aria-label={t("menu")}
            className="mx-auto flex max-w-[1100px] items-center justify-center px-5 py-2.5 sm:px-6"
          >
            <ul className="flex items-center gap-6">
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
        </motion.div>
      </div>

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
              <LogoSmart className="h-9 w-auto" />
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
                      className="display-m block py-3"
                    >
                      {t(item.key)}
                    </button>
                  ) : item.id === "proyectos" ? (
                    <Link
                      to="/proyectos"
                      onClick={() => setMenuOpen(false)}
                      className="display-m block py-3"
                    >
                      {t(item.key)}
                    </Link>
                  ) : (
                    <a
                      href={hash(item.id)}
                      onClick={() => setMenuOpen(false)}
                      className="display-m block py-3"
                    >
                      {t(item.key)}
                    </a>
                  )}
                </motion.li>
              ))}
            </ul>

            {/* Idioma y tema viven dentro del menú en móvil. */}
            <div className="mt-10 flex items-center justify-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>

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
    </>
  );
}
