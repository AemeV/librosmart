import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import type { Book, Edition } from "@/data/books";
import { useLang } from "@/context/LanguageContext";
import { BookObject } from "./BookObject";
import { RetailerButton } from "./RetailerButton";
import { CrossfadeText } from "./CrossfadeText";
import { childVariants, inViewProps, sectionVariants, springFast, tap } from "@/lib/motion-config";

/**
 * Acordeón de índice para móvil: el libro ya no se abre, así que los capítulos
 * y la contratapa viven en un desplegable simple debajo del objeto.
 */
function ContentsAccordion({ book, edition }: { book: Book; edition: Edition }) {
  const { t, tr } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="label mx-auto flex min-h-11 items-center gap-2"
      >
        {open ? t("hideContents") : t("viewContents")}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="contents"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32 }}
            className="overflow-hidden"
          >
            <div className="mx-auto mt-4 max-w-[52ch] rounded-[14px] border border-line bg-surface-alt p-6 text-left">
              <p className="label">{t("indexTitle")}</p>
              <ol className="mt-4 space-y-4">
                {book.chapters.map((chapter) => (
                  <li key={chapter.number} className="flex gap-3">
                    <span className="label pt-0.5">
                      {String(chapter.number).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="body">{tr(chapter.title)}</span>
                      {chapter.summary ? (
                        <span className="body-s block">{tr(chapter.summary)}</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="label mt-8">{t("backCoverTitle")}</p>
              <p className="body-s mt-2">{tr(edition.backCover)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Cada libro es una unidad centrada. El destacado recibe más aire y portada mayor. */
export function BookEntry({ book }: { book: Book }) {
  const { t, tr, lang } = useLang();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [editionLang, setEditionLang] = useState<"es" | "en">(book.editions[0]!.language);

  const edition = book.editions.find((e) => e.language === editionLang) ?? book.editions[0]!;
  const hasEnglish = book.editions.some((e) => e.language === "en");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallax = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [20, -20]);

  const languages = book.editions
    .map((e) => (e.language === "es" ? t("editionEs") : t("editionEn")))
    .join(" · ");
  const formats = [
    edition.physical.length > 0 ? t("physical") : null,
    edition.digital.length > 0 ? t("digital") : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <motion.article
      ref={ref}
      variants={sectionVariants(reduced)}
      {...inViewProps}
      aria-labelledby={`book-${book.slug}`}
      className={`flex flex-col items-center border-t border-line text-center first:border-t-0 ${
        book.featured ? "pt-16 pb-24 sm:pt-24 sm:pb-32" : "py-16 sm:py-24"
      }`}
    >
      <motion.div variants={childVariants} style={{ y: parallax }}>
        <BookObject book={book} edition={edition} featured={book.featured} />
      </motion.div>

      <motion.div variants={childVariants} className="mt-8 w-full">
        <ContentsAccordion book={book} edition={edition} />
      </motion.div>

      <motion.div
        variants={childVariants}
        className={`flex flex-col items-center gap-2 ${book.featured ? "mt-8" : "mt-8"}`}
      >
        {book.featured && (
          <span className="label rounded-full bg-text px-4 py-2 text-bg">{t("newBook")}</span>
        )}
        <span className="label">
          {book.year} · {languages}
          {formats ? ` · ${formats}` : ""}
        </span>
      </motion.div>

      <motion.h3 id={`book-${book.slug}`} variants={childVariants} className="display-m mt-4">
        {book.title}
      </motion.h3>

      <motion.div variants={childVariants} className="mx-auto max-w-[52ch]">
        <CrossfadeText k={`sub-${book.slug}-${lang}`} as="p" className="body-s mt-4">
          {tr(book.subtitle)}
        </CrossfadeText>
      </motion.div>

      {/* Texto corrido: izquierda, 60ch, bloque centrado. */}
      <motion.div variants={childVariants} className="prose-measure mt-8">
        <CrossfadeText k={`desc-${book.slug}-${lang}`} as="p" className="body">
          {tr(book.description)}
        </CrossfadeText>
      </motion.div>

      <motion.div variants={childVariants} className="mt-10 w-full">
        <h4 className="label">{t("keyPoints")}</h4>
        <ul className="mx-auto mt-4 max-w-[52ch] space-y-4 text-left">
          {book.keyPoints.map((point) => (
            <li key={point.title.es} className="flex gap-2.5">
              <Check className="mt-1 h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
              <div>
                <p className="body">{tr(point.title)}</p>
                <p className="body-s mt-0.5">{tr(point.text)}</p>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Banda de compra: único bloque de color saturado a todo el ancho.
          Purple Heart sólido con texto y logos en Seashell, en ambos temas. */}
      <motion.div
        variants={childVariants}
        className="relative left-1/2 mt-14 w-screen -translate-x-1/2 bg-[#4E2BCC] py-10 text-[#EFEFEF] sm:py-12"
      >
        <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-4 px-5 sm:px-6">
          <h4 className="label text-[#EFEFEF]/80">{t("buyTitle")}</h4>

          {hasEnglish && (
            <div
              role="group"
              aria-label={t("editionLabel")}
              className="flex items-center rounded-full border border-[#EFEFEF]/25 p-0.5"
            >
              {book.editions.map((e) => (
                <motion.button
                  key={e.language}
                  type="button"
                  onClick={() => setEditionLang(e.language)}
                  whileTap={tap}
                  aria-pressed={editionLang === e.language}
                  className="relative flex h-9 items-center justify-center rounded-full px-3.5"
                >
                  {editionLang === e.language && (
                    <motion.span
                      layoutId={`edition-${book.slug}`}
                      transition={springFast}
                      className="absolute inset-0 rounded-full bg-[#EFEFEF]/18"
                    />
                  )}
                  <span
                    className={`label relative z-1 ${
                      editionLang === e.language ? "text-[#EFEFEF]" : "text-[#EFEFEF]/65"
                    }`}
                  >
                    {e.language === "es" ? t("editionEs") : t("editionEn")}
                  </span>
                </motion.button>
              ))}
            </div>
          )}

          <CrossfadeText
            k={`buy-${book.slug}-${editionLang}-${lang}`}
            className="mt-4 w-full space-y-6"
          >
            {edition.physical.length === 0 && edition.digital.length === 0 ? (
              <p className="body-s text-center text-[#EFEFEF]/85">{t("soonRetailers")}</p>
            ) : (
              <>
                {edition.physical.length > 0 && (
                  <div>
                    <p className="label text-center text-[#EFEFEF]/70">{t("physical")}</p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2.5">
                      {edition.physical.map((retailer) => (
                        <RetailerButton
                          key={retailer.name}
                          name={retailer.name}
                          url={retailer.url}
                          onBand
                        />
                      ))}
                    </div>
                  </div>
                )}
                {edition.digital.length > 0 && (
                  <div>
                    <p className="label text-center text-[#EFEFEF]/70">{t("digital")}</p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2.5">
                      {edition.digital.map((retailer) => (
                        <RetailerButton
                          key={retailer.name}
                          name={retailer.name}
                          url={retailer.url}
                          onBand
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CrossfadeText>
        </div>
      </motion.div>


    </motion.article>
  );
}
