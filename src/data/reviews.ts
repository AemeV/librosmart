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

/** Ficha real en Goodreads de "Sm@rt? Los más recientes e importantes descubrimientos científicos". */
export const goodreadsBookUrl =
  "https://www.goodreads.com/book/show/50957766-sm-rt-los-m-s-recientes-e-importantes-descubrimientos-cient-ficos";

/** Perfil de autor en Goodreads. */
export const goodreadsProfileUrl =
  "https://www.goodreads.com/author/show/19536331.David_Mauricio_Guerrero_Velez";

/** Datos verificados en la ficha de Goodreads (agosto 2026). */
export const goodreadsStats = {
  rating: 5,
  ratingCount: 8,
  reviewCount: 6,
  bookTitle: "Sm@rt? Los más recientes e importantes descubrimientos científicos",
};

// Los textos de las reseñas de Goodreads no son redistribuibles automáticamente:
// pegar aquí sólo citas reales, con autor y enlace verificables.
export const reviews: Review[] = [];
