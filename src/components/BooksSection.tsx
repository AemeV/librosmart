import { motion, useReducedMotion } from "motion/react";
import { books } from "@/data/books";
import { useLang } from "@/context/LanguageContext";
import { SectionHeading } from "./SectionHeading";
import { BookEntry } from "./BookEntry";
import { inViewProps, sectionVariants } from "@/lib/motion-config";

// Orden: el destacado primero, luego por año descendente.
const ordered = [...books].sort((a, b) => {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return b.year - a.year;
});

export function BooksSection() {
  const { t } = useLang();
  const reduced = useReducedMotion();

  return (
    <section id="libros" aria-labelledby="libros-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <motion.div variants={sectionVariants(reduced)} {...inViewProps} id="libros-title">
          <SectionHeading title={t("booksTitle")} subtitle={t("booksSubtitle")} />
        </motion.div>

        <div className="mt-14">
          {ordered.map((book) => (
            <BookEntry key={book.slug} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}
