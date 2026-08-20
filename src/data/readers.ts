import type { Localized } from "@/i18n/strings";

export type ReaderPhoto = {
  id: string;
  /** TODO (David): reemplazar por la foto real en /public/readers/. */
  src?: string;
  caption: Localized;
};

export const readerPhotos: ReaderPhoto[] = [
  { id: "p1", caption: { es: "Lectora en la FILBo", en: "Reader at FILBo" } },
  { id: "p2", caption: { es: "Sm@rt 2 en Medellín", en: "Sm@rt 2 in Medellín" } },
  { id: "p3", caption: { es: "Club de lectura escolar", en: "School reading club" } },
  { id: "p4", caption: { es: "Firma de libros", en: "Book signing" } },
  { id: "p5", caption: { es: "Lector en Barcelona", en: "Reader in Barcelona" } },
  { id: "p6", caption: { es: "Biblioteca pública", en: "Public library" } },
  { id: "p7", caption: { es: "Charla universitaria", en: "University talk" } },
  { id: "p8", caption: { es: "Lectora en Cartagena", en: "Reader in Cartagena" } },
  { id: "p9", caption: { es: "Sm@rt 3 recién llegado", en: "Sm@rt 3 just arrived" } },
  { id: "p10", caption: { es: "Lector en Ciudad de México", en: "Reader in Mexico City" } },
];
