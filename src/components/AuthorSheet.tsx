import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import { useAuthorSheet } from "@/context/AuthorSheetContext";
import { springSheet, tap } from "@/lib/motion-config";
import { AuthorCard } from "./AuthorCard";

/** Tarjeta emergente del autor: reutiliza <AuthorCard /> dentro de un sheet. */
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
            className="relative w-full max-w-[900px]"
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
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-seashell/25 bg-seashell/10 text-seashell"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </motion.button>

            <AuthorCard className="max-h-[88vh] overflow-y-auto md:overflow-hidden" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
