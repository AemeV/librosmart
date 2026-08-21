import { useSiteContent } from "@/context/SiteContentContext";
import { useLang } from "@/context/LanguageContext";
import { BookEntry } from "./BookEntry";

export function BooksSection() {
  const { t } = useLang();
  const { books } = useSiteContent();
  // El orden y la visibilidad se administran desde el panel: aquí sólo se
  // respeta lo que llega (ya ordenado por `position`).
  const ordered = books.filter((book) => book.published !== false);

  return (
    <section id="libros" aria-label={t("booksTitle")} className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <div>
          {ordered.map((book) => (
            <BookEntry key={book.slug} book={book} />
          ))}
        </div>

        <div className="mt-6 border-t border-line" aria-hidden="true" />
      </div>
    </section>
  );
}
