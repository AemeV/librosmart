import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, BookOpen } from "lucide-react";
import { useState } from "react";
import { readerPhotos, type ReaderPhoto } from "@/data/readers";
import { useLang } from "@/context/LanguageContext";
import { SectionHeading } from "./SectionHeading";
import { childVariants, inViewProps, sectionVariants, springFast, tap } from "@/lib/motion-config";

function PhotoTile({ photo, onOpen }: { photo: ReaderPhoto; onOpen: () => void }) {
  const { tr } = useLang();
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileTap={tap}
      transition={springFast}
      className="relative w-[220px] shrink-0 overflow-hidden rounded-[14px] border border-line bg-surface-2 sm:w-[260px]"
      style={{ aspectRatio: "4 / 3" }}
    >
      {photo.src ? (
        <img
          src={photo.src}
          alt={tr(photo.caption)}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-text-muted">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
          <span className="meta px-3 text-center">{tr(photo.caption)}</span>
        </span>
      )}
    </motion.button>
  );
}

export function ReaderWall() {
  const { t, tr } = useLang();
  const reduced = useReducedMotion();
  const [active, setActive] = useState<ReaderPhoto | null>(null);
  const loop = [...readerPhotos, ...readerPhotos];

  return (
    <motion.section
      id="lectores"
      aria-labelledby="lectores-title"
      variants={sectionVariants(reduced)}
      {...inViewProps}
      className="overflow-hidden py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div id="lectores-title">
          <SectionHeading title={t("readersTitle")} subtitle={t("readersSubtitle")} />
        </div>
      </div>

      <motion.div variants={childVariants} className="marquee-pause mt-10">
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
            aria-label={tr(active.caption)}
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
            <motion.figure
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={springFast}
              className="max-w-lg overflow-hidden rounded-[20px] border border-line bg-surface"
              onClick={(event) => event.stopPropagation()}
            >
              {active.src ? (
                <img src={active.src} alt={tr(active.caption)} className="w-full" />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-surface-2">
                  <BookOpen className="h-8 w-8 text-text-muted" aria-hidden="true" />
                </div>
              )}
              <figcaption className="meta px-5 py-4">{tr(active.caption)}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
