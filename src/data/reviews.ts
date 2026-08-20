import type { Localized } from "@/i18n/strings";

export type Review = {
  id: string;
  text: Localized;
  author: string;
  source: string;
  sourceKind: "goodreads" | "press" | "institution";
  rating?: number;
  bookSlug?: string;
};

// TODO (David): reemplazar por reseñas reales, con autor y fuente verificables.
export const goodreadsProfileUrl = "https://www.goodreads.com/"; // TODO (David): URL del perfil

export const reviews: Review[] = [
  {
    id: "r1",
    text: {
      es: "Explica ciencia dura sin bajarle el nivel al lector. La colección Sm@rt debería estar en toda biblioteca escolar del país.",
      en: "It explains hard science without talking down to the reader. The Sm@rt collection belongs in every school library in the country.",
    },
    author: "Lectora en Bogotá",
    source: "Goodreads",
    sourceKind: "goodreads",
    rating: 5,
    bookSlug: "smart-2",
  },
  {
    id: "r2",
    text: {
      es: "Un libro de divulgación que no simplifica de más: cita fuentes y admite lo que todavía no sabemos.",
      en: "Popular science that doesn't over-simplify: it cites sources and admits what we still don't know.",
    },
    author: "Reseña de prensa",
    source: "Prensa cultural",
    sourceKind: "press",
    bookSlug: "colonizacion",
  },
  {
    id: "r3",
    text: {
      es: "Material útil para clases de ciencias naturales en bachillerato.",
      en: "Useful material for high-school natural science classes.",
    },
    author: "Docente",
    source: "Institución educativa",
    sourceKind: "institution",
    rating: 5,
    bookSlug: "smart-3",
  },
  {
    id: "r4",
    text: {
      es: "Lo empecé por curiosidad sobre Marte y terminé leyéndolo completo en dos noches.",
      en: "I started it out of curiosity about Mars and finished the whole thing in two nights.",
    },
    author: "Lector en Medellín",
    source: "Goodreads",
    sourceKind: "goodreads",
    rating: 4,
    bookSlug: "colonizacion",
  },
  {
    id: "r5",
    text: {
      es: "La guía más clara que leí durante la pandemia, y la única que envejeció bien.",
      en: "The clearest guide I read during the pandemic, and the only one that aged well.",
    },
    author: "Lectora en Cali",
    source: "Goodreads",
    sourceKind: "goodreads",
    rating: 5,
    bookSlug: "guia-covid",
  },
];
