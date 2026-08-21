import { motion, useReducedMotion } from "motion/react";
import { Star, ArrowUpRight } from "lucide-react";
import { reviews, goodreadsBookUrl, goodreadsProfileUrl, goodreadsStats } from "@/data/reviews";
import { useLang } from "@/context/LanguageContext";
import { SectionHeading } from "./SectionHeading";
import { childVariants, inViewProps, sectionVariants, springFast, tap } from "@/lib/motion-config";

const spans = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-12",
];

export function ReviewsSection() {
  const { t, tr } = useLang();
  const reduced = useReducedMotion();

  return (
    <motion.section
      id="resenas"
      aria-labelledby="resenas-title"
      variants={sectionVariants(reduced)}
      {...inViewProps}
      className="py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6">
        <div id="resenas-title">
          <SectionHeading title={t("reviewsTitle")} subtitle={t("reviewsSubtitle")} />
        </div>

        {/* Tarjeta con la valoración real verificada en Goodreads. */}
        <motion.div
          variants={childVariants}
          className="glass-card glass-card-content mx-auto mt-10 max-w-[560px] p-8 text-center"
        >
          <div className="flex justify-center gap-1" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, star) => (
              <Star key={star} className="h-4 w-4 fill-current text-text" />
            ))}
          </div>
          <p className="display-m mt-4">{goodreadsStats.rating.toFixed(1)}</p>
          <p className="label mt-2">
            {goodreadsStats.ratingCount} {t("goodreadsRatings")} · {goodreadsStats.reviewCount}{" "}
            {t("goodreadsReviews")} · Goodreads
          </p>
          <p className="body-s mt-4">{goodreadsStats.bookTitle}</p>
          <motion.a
            href={goodreadsBookUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={tap}
            transition={springFast}
            className="glass label mt-6 inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-text"
          >
            {t("goodreadsBookCta")}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </motion.a>
        </motion.div>

        {reviews.length > 0 && (
          <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-12 lg:overflow-visible">
            {reviews.map((review, index) => (
              <motion.figure
                key={review.id}
                variants={childVariants}
                className={`min-w-[80vw] snap-center rounded-[14px] border border-line bg-surface p-6 sm:min-w-[420px] lg:min-w-0 ${
                  spans[index % spans.length]
                }`}
              >
                {review.rating ? (
                  <div className="flex gap-0.5" aria-label={`${review.rating}/5`}>
                    {Array.from({ length: review.rating }).map((_, star) => (
                      <Star
                        key={star}
                        className="h-3.5 w-3.5 fill-current text-text"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                ) : null}
                <blockquote className="body mt-4 text-justify hyphens-auto">
                  “{tr(review.text)}”
                </blockquote>
                <figcaption className="label mt-6">
                  {review.author} · {review.source}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}

        <motion.div variants={childVariants} className="mt-10 text-center">
          <motion.a
            href={goodreadsProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={tap}
            transition={springFast}
            className="label inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-text-muted transition-colors hover:text-text"
          >
            {t("goodreadsCta")}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
}
