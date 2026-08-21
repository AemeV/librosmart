import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, BookOpen } from "lucide-react";
import { useState } from "react";
import type { ReaderPhoto } from "@/data/readers";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLang } from "@/context/LanguageContext";
import { SectionHeading } from "./SectionHeading";
import { childVariants, inViewProps, sectionVariants, springFast, tap } from "@/lib/motion-config";

/**
 * Muro de lectores: sólo imágenes, en formato cuadrado. Sin pies de foto.
 */
function PhotoTile({ photo, onOpen }: { photo: ReaderPhoto; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileTap={tap}
      transition={springFast}
      aria-label="Foto de lector"
      className="relative aspect-square w-[200px] shrink-0 overflow-hidden rounded-[16px] border border-line bg-surface-2 sm:w-[240px]"
    >
      {photo.src ? (
        <img src={photo.src} alt="" loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-text-muted">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
    </motion.button>
  );
}

export function ReaderWall() {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const [active, setActive] = useState<ReaderPhoto | null>(null);
  const { readers } = useSiteContent();
  const loop = [...readers, ...readers];

  return (
    <motion.section
      id="lectores"
      aria-labelledby="lectores-title"
      variants={sectionVariants(reduced)}
      {...inViewProps}
      className="overflow-hidden py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6">
        <div id="lectores-title">
          <SectionHeading title={t("readersTitle")} subtitle={t("readersSubtitle")} />
        </div>
      </div>

      <motion.div variants={childVariants} className="mt-10">
        <div className="marquee-track flex w-max gap-3">
          {loop.map((photo, index) => (
            <PhotoTile
              key={`${photo.id}-${index}`}
              photo={photo}
              onOpen={() => setActive(photo)}
            />
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={t("readersTitle")}
          >
            <motion.button
              type="button"
              onClick={() => setActive(null)}
              aria-label={t("close")}
              whileTap={tap}
              className="glass absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </motion.button>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={springFast}
              className="aspect-square w-full max-w-lg overflow-hidden rounded-[20px] border border-line bg-surface"
              onClick={(event) => event.stopPropagation()}
            >
              {active.src ? (
                <img src={active.src} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-2">
                  <BookOpen className="h-8 w-8 text-text-muted" aria-hidden="true" />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
