import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Check, ListTree } from "lucide-react";
import { useRef, useState } from "react";
import type { Book } from "@/data/books";
import { useLang } from "@/context/LanguageContext";
import { BookCover } from "./BookCover";
import { RetailerButton } from "./RetailerButton";
import { CrossfadeText } from "./CrossfadeText";
import { Sheet } from "./Sheet";
import { childVariants, inViewProps, sectionVariants, springFast, tap } from "@/lib/motion-config";

export function BookEntry({ book, index }: { book: Book; index: number }) {
  const { t, tr, lang } = useLang();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [editionLang, setEditionLang] = useState<"es" | "en">(book.editions[0]!.language);
  const [sheetOpen, setSheetOpen] = useState(false);

  const edition = book.editions.find((e) => e.language === editionLang) ?? book.editions[0]!;
  const hasEnglish = book.editions.some((e) => e.language === "en");
  const coverFirst = index % 2 === 0;

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
      className="border-t border-line py-14 first:border-t-0 sm:py-20"
    >
      <div
        className={`grid items-start gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-14 ${
          coverFirst ? "" : "lg:[&>*:first-child]:order-2"
        }`}
      >
        <motion.div variants={childVariants} style={{ y: parallax }} className="lg:sticky lg:top-32">
          <CrossfadeText k={`${book.slug}-${editionLang}`}>
            <BookCover
              src={edition.coverUrl}
              alt={`${t("coverAlt")} ${book.title} — ${tr(book.subtitle)}`}
              title={book.title}
            />
          </CrossfadeText>
        </motion.div>

        <div className="min-w-0">
          <motion.div variants={childVariants} className="flex flex-wrap items-center gap-3">
            {book.featured && (
              <span className="rounded-full bg-accent px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-accent-text">
                {t("featured")}
              </span>
            )}
            <span className="meta">
              {book.year} · {languages}
              {formats ? ` · ${formats}` : ""}
            </span>
          </motion.div>

          <motion.h3
            id={`book-${book.slug}`}
            variants={childVariants}
            className="display mt-4 text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.02]"
          >
            {book.title}
          </motion.h3>

          <motion.div variants={childVariants}>
            <CrossfadeText
              k={`sub-${book.slug}-${lang}`}
              as="p"
              className="mt-2 text-lg text-text-muted"
            >
              {tr(book.subtitle)}
            </CrossfadeText>
          </motion.div>

          <motion.div variants={childVariants} className="mt-6 max-w-prose">
            <CrossfadeText k={`desc-${book.slug}-${lang}`} as="p" className="text-base leading-relaxed">
              {tr(book.description)}
            </CrossfadeText>
          </motion.div>

          <motion.div variants={childVariants} className="mt-8">
            <h4 className="meta">{t("keyPoints")}</h4>
            <ul className="mt-3 space-y-2">
              {book.keyPoints.map((point) => (
                <li key={point.es} className="flex gap-2.5 text-sm leading-relaxed">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
                  <span>{tr(point)}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={childVariants} className="mt-8">
            <motion.button
              type="button"
              onClick={() => setSheetOpen(true)}
              whileTap={tap}
              transition={springFast}
              className="glass flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
            >
              <ListTree className="h-4 w-4" aria-hidden="true" />
              {t("viewIndex")}
            </motion.button>
          </motion.div>

          <motion.div
            variants={childVariants}
            className="mt-10 rounded-[20px] border border-line bg-surface p-5 sm:p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h4 className="tight text-xl font-semibold">{t("buyTitle")}</h4>

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
                        className={`relative z-1 font-mono text-[11px] uppercase tracking-[0.08em] ${
                          editionLang === e.language ? "text-text" : "text-text-muted"
                        }`}
                      >
                        {e.language === "es" ? t("editionEs") : t("editionEn")}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            <CrossfadeText k={`buy-${book.slug}-${editionLang}-${lang}`} className="mt-6 space-y-6">
              {edition.physical.length === 0 && edition.digital.length === 0 ? (
                <p className="text-sm text-text-muted">{t("soonRetailers")}</p>
              ) : (
                <>
                  {edition.physical.length > 0 && (
                    <div>
                      <p className="meta">{t("physical")}</p>
                      <div className="mt-3 flex flex-wrap gap-2.5">
                        {edition.physical.map((retailer) => (
                          <RetailerButton
                            key={retailer.name}
                            name={retailer.name}
                            url={retailer.url}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {edition.digital.length > 0 && (
                    <div>
                      <p className="meta">{t("digital")}</p>
                      <div className="mt-3 flex flex-wrap gap-2.5">
                        {edition.digital.map((retailer) => (
                          <RetailerButton
                            key={retailer.name}
                            name={retailer.name}
                            url={retailer.url}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CrossfadeText>
          </motion.div>
        </div>
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={book.title}>
        <div className="space-y-8">
          <section>
            <h4 className="meta">{t("indexTitle")}</h4>
            <ol className="mt-3 space-y-2.5">
              {book.chapters.map((chapter) => (
                <li key={chapter.number} className="flex gap-3 text-sm">
                  <span className="font-mono text-[11px] tracking-[0.08em] text-text-muted">
                    {String(chapter.number).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="font-medium">{tr(chapter.title)}</span>
                    {chapter.summary ? (
                      <span className="block text-text-muted">{tr(chapter.summary)}</span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h4 className="meta">{t("backCoverTitle")}</h4>
            <p className="mt-3 text-sm leading-relaxed">{tr(edition.backCover)}</p>
          </section>
        </div>
      </Sheet>
    </motion.article>
  );
}
