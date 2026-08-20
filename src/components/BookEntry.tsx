import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Check } from "lucide-react";
import { useRef, useState } from "react";
import type { Book } from "@/data/books";
import { useLang } from "@/context/LanguageContext";
import { BookObject } from "./BookObject";
import { RetailerButton } from "./RetailerButton";
import { CrossfadeText } from "./CrossfadeText";
import { childVariants, inViewProps, sectionVariants, springFast, tap } from "@/lib/motion-config";

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
        book.featured ? "pb-24 sm:pb-36" : "py-16 sm:py-24"
      } ${book.featured ? "pt-16 sm:pt-20" : ""}`}
    >
      <motion.div variants={childVariants} style={{ y: parallax }}>
        <BookObject book={book} edition={edition} featured={book.featured} />
      </motion.div>

      <motion.div
        variants={childVariants}
        className={`flex flex-col items-center gap-2 ${book.featured ? "mt-10" : "mt-8"}`}
      >
        {book.featured && (
          <span className="label rounded-full bg-text px-3 py-1.5 text-bg">{t("newBook")}</span>
        )}
        <span className="label">
          {book.year} · {languages}
          {formats ? ` · ${formats}` : ""}
        </span>
      </motion.div>

      <motion.h3
        id={`book-${book.slug}`}
        variants={childVariants}
        className={`mt-4 ${book.featured ? "display-xl" : "display-m"}`}
      >
        {book.title}
      </motion.h3>

      <motion.div variants={childVariants} className="mx-auto max-w-[52ch]">
        <CrossfadeText k={`sub-${book.slug}-${lang}`} as="p" className="body-s mt-3">
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

      <motion.div
        variants={childVariants}
        className="mt-12 w-full max-w-2xl rounded-[20px] border border-line bg-surface p-6 sm:p-8"
      >
        <div className="flex flex-col items-center gap-4">
          <h4 className="label">{t("buyTitle")}</h4>


          {hasEnglish && (
            <div
              role="group"
              aria-label={t("editionLabel")}
              className="flex items-center rounded-full border border-line p-0.5"
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
                      editionLang === e.language ? "text-text" : ""
                    }`}
                  >
                    {e.language === "es" ? t("editionEs") : t("editionEn")}
                  </span>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        <CrossfadeText k={`buy-${book.slug}-${editionLang}-${lang}`} className="mt-7 space-y-6">
          {edition.physical.length === 0 && edition.digital.length === 0 ? (
            <p className="text-sm text-text-muted">{t("soonRetailers")}</p>
          ) : (
            <>
              {edition.physical.length > 0 && (
                <div>
                  <p className="label">{t("physical")}</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2.5">
                    {edition.physical.map((retailer) => (
                      <RetailerButton key={retailer.name} name={retailer.name} url={retailer.url} />
                    ))}
                  </div>
                </div>
              )}
              {edition.digital.length > 0 && (
                <div>
                  <p className="label">{t("digital")}</p>
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
