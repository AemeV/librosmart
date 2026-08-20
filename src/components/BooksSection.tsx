import { motion, useReducedMotion } from "motion/react";
import { books } from "@/data/books";
import { useLang } from "@/context/LanguageContext";
import { SectionHeading } from "./SectionHeading";
import { BookEntry } from "./BookEntry";
import { inViewProps, sectionVariants } from "@/lib/motion-config";

export function BooksSection() {
  const { t } = useLang();
  const reduced = useReducedMotion();

  return (
    <section id="libros" aria-labelledby="libros-title" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div variants={sectionVariants(reduced)} {...inViewProps} id="libros-title">
          <SectionHeading title={t("booksTitle")} subtitle={t("booksSubtitle")} />
        </motion.div>

        <div className="mt-10">
          {books.map((book, index) => (
            <BookEntry key={book.slug} book={book} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
