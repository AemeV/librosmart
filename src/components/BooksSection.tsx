import { useSiteContent } from "@/context/SiteContentContext";
import { useLang } from "@/context/LanguageContext";
import { useAuthorSheet } from "@/context/AuthorSheetContext";
import { BookEntry } from "./BookEntry";

export function BooksSection() {
  const { t } = useLang();
  const { books } = useSiteContent();
  // Orden manual pedido: destacado, colonización, la serie Sm@rt seguida y la
  // cartilla del coronavirus al final.
  const ORDER = [
    "sexta-extincion",
    "colonizacion",
    "smart-3",
    "smart-2",
    "smart-1",
    "guia-covid",
  ];
  const rank = (slug: string) => {
    const index = ORDER.indexOf(slug);
    return index === -1 ? ORDER.length : index;
  };
  const ordered = [...books].sort((a, b) => rank(a.slug) - rank(b.slug));
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
