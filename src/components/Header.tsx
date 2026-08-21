import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Instagram, Youtube, Facebook, Music2, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useLang } from "@/context/LanguageContext";
import { useAuthorSheet } from "@/context/AuthorSheetContext";
import { useLogoMigration } from "@/context/LogoMigrationContext";

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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  /**
   * En el inicio, arriba del todo, el cristal del header se esconde: el logo
   * grande vive en el hero. Al empezar a bajar, aparece y recibe el logo.
   */
  const chromeVisible = !isLanding || scrolled;

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 12);
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
        {/* Barra superior. En el inicio, antes de scrollear, el cristal y los
            controles están escondidos; el hueco del logo sigue midiéndose para
            que el logo migrante aterrice exactamente aquí. */}
        <div className="relative">
          <motion.div
            aria-hidden="true"
            className="glass absolute inset-0 border-b border-line"
            initial={false}
            animate={{ opacity: chromeVisible ? 1 : 0 }}
            transition={springFast}
          />
          <div className="relative mx-auto flex max-w-[1100px] items-center justify-center px-5 py-3 sm:px-6">
            <motion.nav
              aria-label={t("follow")}
              initial={false}
              animate={{ opacity: chromeVisible ? 1 : 0 }}
              transition={springFast}
              style={{ pointerEvents: chromeVisible ? "auto" : "none" }}
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
            </motion.nav>

            <Link
              to="/"
              onClick={scrollTop}
              className="flex items-center justify-center"
              aria-label={t("brand")}
            >
              <span
                ref={setHeaderSlot}
                className="block h-12 shrink-0"
                style={{ width: 210 }}
                aria-hidden={migrating ? true : undefined}
              >
                <LogoSmart
                  className={`h-auto w-full transition-opacity ${
                    migrating ? "opacity-0" : "opacity-100"
                  }`}
                />
              </span>
            </Link>

            <motion.div
              initial={false}
              animate={{ opacity: chromeVisible ? 1 : 0 }}
              transition={springFast}
              style={{ pointerEvents: chromeVisible ? "auto" : "none" }}
              className="absolute right-5 hidden items-center gap-2 sm:right-6 lg:flex"
            >
              <LanguageToggle />
            </motion.div>

            <motion.button
              type="button"
              whileTap={tap}
              onClick={() => setMenuOpen(true)}
              aria-label={t("menu")}
              initial={false}
              animate={{ opacity: chromeVisible ? 1 : 0 }}
              transition={springFast}
              style={{ pointerEvents: chromeVisible ? "auto" : "none" }}
              className="absolute right-5 flex h-11 w-11 items-center justify-center rounded-full border border-line sm:right-6 lg:hidden"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          </div>
        </div>

        {/* El menú de secciones ahora vive en <FloatingNav />, en botones
            flotantes siempre visibles. */}

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

            {/* El selector de idioma vive dentro del menú en móvil. */}
            <div className="mt-10 flex items-center justify-center gap-2">
              <LanguageToggle />
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
