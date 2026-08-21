import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Instagram, Music2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import { useAuthorSheet } from "@/context/AuthorSheetContext";
import { springSheet, tap } from "@/lib/motion-config";
import { useSiteContent } from "@/context/SiteContentContext";
import { INSTAGRAM_URL, TIKTOK_URL } from "@/lib/social";

/** Tarjeta emergente del autor: horizontal en desktop, vertical en móvil. */
export function AuthorSheet() {
  const { open, closeSheet } = useAuthorSheet();
  const { t } = useLang();
  const { images } = useSiteContent();
  const portrait = images["author_portrait"] ?? "";
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("button, a, [tabindex]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSheet();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [open, closeSheet]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-5 py-10">
          <motion.button
            type="button"
            aria-label={t("close")}
            onClick={closeSheet}
            className="absolute inset-0 bg-midnight/60 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("authorTitle")}
            className="relative flex max-h-[88vh] w-full max-w-[900px] flex-col overflow-y-auto rounded-[28px] bg-midnight text-seashell shadow-[0_30px_80px_-20px_rgba(5,1,16,0.7)] md:flex-row md:overflow-hidden"
            initial={{ opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.98 }}
            transition={springSheet}
          >
            <motion.button
              type="button"
              onClick={closeSheet}
              whileTap={tap}
              aria-label={t("close")}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-seashell/25 bg-seashell/10 text-seashell"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </motion.button>

            <div className="relative shrink-0 md:w-[42%]">
              <img
                src={portrait}
                alt={t("authorPortraitAlt")}
                width={1024}
                height={1024}
                loading="lazy"
                className="h-64 w-full object-cover object-center md:h-full"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight via-midnight/25 to-transparent md:bg-gradient-to-r md:from-transparent md:via-midnight/10 md:to-midnight"
              />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-8 text-center sm:px-10 sm:py-12">
              <div>
                <h2 className="display-m">David Mauricio Guerrero Vélez</h2>
                <p className="label mt-3 text-seashell/70">{t("authorSheetRole")}</p>
              </div>

              <p className="body-s text-center text-seashell/85">{t("authorBio1")}</p>
              <p className="body-s text-center text-seashell/85">{t("authorBio2")}</p>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <motion.a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={tap}
                  className="body-s inline-flex min-h-11 items-center gap-2 rounded-full border border-seashell/30 bg-seashell/10 px-5 text-seashell transition-colors hover:bg-seashell hover:text-midnight"
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />
                  Instagram
                </motion.a>
                <motion.a
                  href={TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={tap}
                  className="body-s inline-flex min-h-11 items-center gap-2 rounded-full border border-seashell/30 bg-seashell/10 px-5 text-seashell transition-colors hover:bg-seashell hover:text-midnight"
                >
                  <Music2 className="h-4 w-4" aria-hidden="true" />
                  TikTok
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
