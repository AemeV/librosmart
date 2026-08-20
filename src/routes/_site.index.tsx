import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ReaderWall } from "@/components/ReaderWall";
import { BooksSection } from "@/components/BooksSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { AuthorSection } from "@/components/AuthorSection";
import { ContactSection, Footer } from "@/components/ContactSection";

const title = "Librosmart — Libros de David Mauricio Guerrero Vélez";
const description =
  "Los libros de divulgación científica de David Mauricio Guerrero Vélez: biodiversidad, espacio y la colección Sm@rt. Encuentra tu edición y tu librería.";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <h1 className="sr-only">Librosmart — David Mauricio Guerrero Vélez</h1>
      <Hero />
      <Header />
      <main>
        <BooksSection />
        <ReaderWall />
        <ReviewsSection />
        <AuthorSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
