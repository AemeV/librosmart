import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/ContactSection";
import { BookEntry } from "@/components/BookEntry";
import { useLang } from "@/context/LanguageContext";
import { books } from "@/data/books";

export const Route = createFileRoute("/_site/libros/$slug")({
  loader: ({ params }) => {
    const book = books.find((b) => b.slug === params.slug);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Librosmart" }, { name: "robots", content: "noindex" }],
      };
    }
    const { book } = loaderData;
    const title = `${book.title} — Librosmart`;
    const description = book.description.es.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "book" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: BookDetailPage,
});

function BookDetailPage() {
  const { book } = Route.useLoaderData();
  const { t } = useLang();

  return (
    <>
      <main className="px-5 pt-24 pb-24 sm:px-6">
        <div className="mx-auto max-w-[1100px]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link
              to="/"
              hash="libros"
              className="label inline-flex items-center gap-1.5 text-text-muted transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {t("backToBooks")}
            </Link>
          </motion.div>

          <BookEntry book={book} />
        </div>
      </main>
      <Footer />
    </>
  );
}
