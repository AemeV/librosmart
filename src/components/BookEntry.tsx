import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import type { Book, Edition } from "@/data/books";
import { useLang } from "@/context/LanguageContext";
import { BookCard } from "./BookCard";
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
    <div className="w-full">
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
            <div className="mx-auto mt-4 max-w-[52ch] rounded-[14px] border border-line bg-surface-alt p-6 text-center">
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

  // Siempre cuatro tarjetas: los huecos se rellenan con texto provisional que
  // el administrador reemplaza desde el panel.
  const fourPoints = Array.from({ length: 4 }, (_, index) =>
    book.keyPoints[index] ?? {
      title: { es: "Próximamente", en: "Coming soon" },
      text: {
        es: "Texto provisional. Este punto se completa desde el panel de administración.",
        en: "Placeholder text. This point is edited from the admin panel.",
      },
    },
  );

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
      <motion.div
        variants={childVariants}
        style={{ y: parallax }}
        {...(book.featured ? { "data-magnet-block": "" } : {})}
      >
        <BookCard
          book={book}
          edition={edition}
          featured={book.featured}
          alt={`${t("coverAlt")} ${book.title}`}
        />
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

      <motion.h3
        id={`book-${book.slug}`}
        variants={childVariants}
        {...(book.featured ? { "data-magnet-block": "" } : {})}
        className="mt-4 max-w-[22ch] text-balance display-xl"
      >
        {book.title}
      </motion.h3>

      <motion.div variants={childVariants} className="mx-auto max-w-[52ch]">
        <CrossfadeText k={`sub-${book.slug}-${lang}`} as="p" className="body-lead mt-4">
          {tr(book.subtitle)}
        </CrossfadeText>
      </motion.div>

      {/* Texto corrido: justificado dentro de la columna centrada. */}
      <motion.div variants={childVariants} className="prose-measure mt-8">
        <CrossfadeText k={`desc-${book.slug}-${lang}`} as="p" className="body text-center">
          {tr(book.description)}
        </CrossfadeText>
      </motion.div>

      {/* Qué vas a encontrar: galería horizontal scrolleable de tarjetas
          glassmorphism. */}
      <motion.div variants={childVariants} className="mt-14 w-full">
        <h4 className="body uppercase text-center">{t("keyPoints")}</h4>
        <ul className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {fourPoints.map((point, index) => (
            <li
              key={`${book.slug}-kp-${index}`}
              className="glass-card-dark glass-card-content !shadow-none flex flex-col items-center p-5 text-center sm:p-6"
            >
              <p className="body text-center text-seashell">{tr(point.title)}</p>
              <p className="body-s mt-2 text-center text-seashell/80">{tr(point.text)}</p>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Dónde comprarlo: tarjeta glassmorphism. */}
      <motion.h4 variants={childVariants} className="body uppercase text-center mt-14">
        {t("buyTitle")}
      </motion.h4>
      <motion.div
        variants={childVariants}
        className="glass-card glass-card-content mt-4 w-full p-6 text-center sm:p-8"
      >
        {hasEnglish && (
          <div
            role="group"
            aria-label={t("editionLabel")}
            className="glass-card-content mx-auto mt-4 inline-flex items-center rounded-full border border-line bg-surface/60 p-0.5"
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
                    className="absolute inset-0 rounded-full bg-text/10"
                  />
                )}
                <span
                  className={`label relative z-1 ${
                    editionLang === e.language ? "text-text" : "text-text-muted"
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
          className="glass-card-content mt-5 w-full space-y-6"
        >
          {edition.physical.length === 0 && edition.digital.length === 0 ? (
            <p className="body-s">{t("soonRetailers")}</p>
          ) : (
            <>
              {edition.physical.length > 0 && (
                <div>
                  <p className="body-s">{t("physical")}</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2.5">
                    {edition.physical.map((retailer) => (
                      <RetailerButton key={retailer.name} name={retailer.name} url={retailer.url} />
                    ))}
                  </div>
                </div>
              )}
              {edition.digital.length > 0 && (
                <div>
                  <p className="body-s">{t("digital")}</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2.5">
                    {edition.digital.map((retailer) => (
                      <RetailerButton key={retailer.name} name={retailer.name} url={retailer.url} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CrossfadeText>
      </motion.div>



    </motion.article>
  );
}
