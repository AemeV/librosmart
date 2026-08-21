import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Hero } from "@/components/Hero";
import { ReaderWall } from "@/components/ReaderWall";
import { BooksSection } from "@/components/BooksSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { AuthorSection } from "@/components/AuthorSection";
import { ContactSection, Footer } from "@/components/ContactSection";

const title = "Sm@rt — Libros de David Mauricio Guerrero Vélez";
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

/** Primer scroll imantado: del hero directo a la primera portada. */
function useMagneticFirstScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let done = false;
    let animating = false;
    let startY = 0;

    const target = () => document.querySelector<HTMLElement>("#libros [id^='book-']");

    const snap = () => {
      const el = target();
      if (!el) return false;
      const offset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--header-height") || "104",
        10,
      );
      const y = el.getBoundingClientRect().top + window.scrollY - offset - 24;
      animating = true;
      window.scrollTo({ top: y, behavior: "smooth" });
      window.setTimeout(() => {
        animating = false;
      }, 900);
      return true;
    };

    const trigger = (event: Event) => {
      if (done || animating) {
        if (animating) event.preventDefault();
        return;
      }
      if (window.scrollY > 40) {
        done = true;
        return;
      }
      event.preventDefault();
      if (snap()) done = true;
    };

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY <= 0) return;
      trigger(event);
    };
    const onTouchStart = (event: TouchEvent) => {
      startY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? 0;
      if (startY - y < 12) return;
      trigger(event);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);
}

function Index() {
  useMagneticFirstScroll();

  useEffect(() => {
    // Siempre abrir la landing en el banner principal, limpiando cualquier
    // hash o posición de scroll previa que el navegador pudiera restaurar.
    if (typeof window === "undefined") return;
    if (window.location.hash && window.location.hash !== "#top") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <h1 className="sr-only">Sm@rt — David Mauricio Guerrero Vélez</h1>
      <Hero />
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
