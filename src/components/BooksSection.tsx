import { books } from "@/data/books";
import { useLang } from "@/context/LanguageContext";
import { useAuthorSheet } from "@/context/AuthorSheetContext";
import { BookEntry } from "./BookEntry";

// Orden: el destacado primero, luego por año descendente.
const ordered = [...books].sort((a, b) => {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return b.year - a.year;
});

export function BooksSection() {
  const { t } = useLang();
  const { openSheet } = useAuthorSheet();

  return (
    <section id="libros" aria-label={t("booksTitle")} className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <div>
          {ordered.map((book) => (
            <BookEntry key={book.slug} book={book} />
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={openSheet}
            className="body underline decoration-line underline-offset-4 transition-colors hover:text-text-muted"
          >
            {t("authorSheetOpen")}
          </button>
        </div>
      </div>
    </section>
  );
}
