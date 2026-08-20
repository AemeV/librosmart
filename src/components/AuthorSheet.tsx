import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Instagram, BookOpen, Youtube, Mic, GraduationCap } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import { useAuthorSheet } from "@/context/AuthorSheetContext";
import { springSheet, tap } from "@/lib/motion-config";
import type { StringKey } from "@/i18n/strings";
import portrait from "@/assets/retrato-david.jpg";

// TODO (David): reemplazar el retrato por la foto real y ajustar las cifras de trayectoria.
const INSTAGRAM_HANDLE = "@david.viajesyciencia";
const INSTAGRAM_URL = "https://instagram.com/david.viajesyciencia";

const track: { value: string; label: StringKey; detail: StringKey; Icon: typeof BookOpen }[] = [
  { value: "2", label: "trackBooks", detail: "trackBooksDetail", Icon: BookOpen },
  { value: "40+", label: "trackVideos", detail: "trackVideosDetail", Icon: Youtube },
  { value: "30+", label: "trackTalks", detail: "trackTalksDetail", Icon: Mic },
  { value: "15+", label: "trackConferences", detail: "trackConferencesDetail", Icon: GraduationCap },
];

export function AuthorSheet() {
  const { open, closeSheet } = useAuthorSheet();
  const { t } = useLang();
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

  const goToContact = () => {
    closeSheet();
    requestAnimationFrame(() => {
      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100">
          <motion.button
            type="button"
            aria-label={t("close")}
            onClick={closeSheet}
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
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
            className="absolute inset-x-0 bottom-0 top-0 flex flex-col overflow-hidden rounded-t-[24px] border-t border-line bg-surface sm:top-8"
            initial={{ y: reduced ? 0 : "100%", opacity: reduced ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduced ? 0 : "100%", opacity: reduced ? 0 : 1 }}
            transition={springSheet}
            drag={reduced ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) closeSheet();
            }}
          >
            {/* Barrita de arrastre */}
            <div className="shrink-0 cursor-grab pt-3 active:cursor-grabbing">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-text-muted/40" />
            </div>

            <div className="absolute right-4 top-4 z-10">
              <motion.button
                type="button"
                onClick={closeSheet}
                whileTap={tap}
                aria-label={t("close")}
                className="glass flex h-11 w-11 items-center justify-center rounded-full"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-16 pt-8 sm:px-6">
              <div className="mx-auto max-w-[1100px]">
                <div className="text-center">
                  <img
                    src={portrait}
                    alt={t("authorPortraitAlt")}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="mx-auto h-40 w-40 rounded-full object-cover grayscale sm:h-56 sm:w-56"
                  />
                  <h2 className="display mt-6 text-4xl font-normal sm:text-5xl">
                    David Mauricio Guerrero Vélez
                  </h2>
                  <p className="label mt-3">{t("authorSheetRole")}</p>
                </div>

                <div className="prose-measure mt-10 space-y-5 text-left">
                  <p className="text-lg leading-relaxed">{t("authorSheetBio1")}</p>
                  <p className="text-base leading-relaxed text-text-muted">
                    {t("authorSheetBio2")}
                  </p>
                  <p className="text-base leading-relaxed text-text-muted">
                    {t("authorSheetBio3")}
                  </p>
                </div>

                <section aria-labelledby="autor-trayectoria" className="mt-14">
                  <h3 id="autor-trayectoria" className="label text-center">
                    {t("authorTrackTitle")}
                  </h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {track.map(({ value, label, detail, Icon }) => (
                      <div
                        key={label}
                        className="rounded-[14px] border border-line bg-surface-alt p-6 text-center"
                      >
                        <Icon className="mx-auto h-5 w-5 text-text-muted" aria-hidden="true" />
                        <p className="display mt-3 text-3xl">{value}</p>
                        <p className="label mt-2">{t(label)}</p>
                        <p className="mt-3 text-sm leading-relaxed text-text-muted">{t(detail)}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section aria-labelledby="autor-redes" className="mt-14 text-center">
                  <h3 id="autor-redes" className="label">
                    {t("authorSocialTitle")}
                  </h3>
                  <motion.a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={tap}
                    className="glass mt-5 inline-flex items-center gap-3 rounded-full px-5 py-3"
                  >
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                    <span className="tight text-base font-medium">{INSTAGRAM_HANDLE}</span>
                  </motion.a>
                  <p className="mt-3 text-sm text-text-muted">{t("authorSocialDetail")}</p>
                </section>

                <section
                  aria-labelledby="autor-cta"
                  className="mt-14 rounded-[18px] border border-line bg-surface-alt px-6 py-10 text-center"
                >
                  <h3 id="autor-cta" className="display text-3xl">
                    {t("authorCtaTitle")}
                  </h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-muted">
                    {t("authorCtaDetail")}
                  </p>
                  <motion.button
                    type="button"
                    onClick={goToContact}
                    whileTap={tap}
                    className="mt-6 inline-flex h-12 items-center rounded-full bg-text px-6 text-sm font-medium text-surface"
                  >
                    {t("authorCtaButton")}
                  </motion.button>
                </section>

                <p className="label mt-12 text-center sm:hidden">{t("authorSheetDrag")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
