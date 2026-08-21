import type { Localized } from "@/i18n/strings";
import sextaExtincionCover from "@/assets/portada-sexta-extincion.png.asset.json";
import colonizacionCover from "@/assets/portada-colonizacion.png.asset.json";
import smart3Cover from "@/assets/portada-smart-3.png.asset.json";
import smart2Cover from "@/assets/portada-smart-2.png.asset.json";
import smart1Cover from "@/assets/portada-smart-1.png.asset.json";
import guiaCovidCover from "@/assets/portada-guia-covid.png.asset.json";

export type Retailer = {
  name: string;
  url: string;
  region?: "CO" | "US" | "UK" | "DE" | "GLOBAL";
};

/**
 * Ficha técnica: vive en la EDICIÓN, no en el libro. El ISBN, el editor y las
 * páginas cambian entre la edición en español y la inglesa.
 */
export type BookSpecs = {
  publisher: string;
  releaseDate: string;
  pages: number;
  dimensions: string;
  isbn: string;
  illustrated: boolean;
  ageRange?: Localized;
};

export type Edition = {
  language: "es" | "en";
  coverUrl: string;
  /** Imagen de contraportada: aparece al lado de la portada al pasar el cursor. */
  backCoverUrl?: string;
  /** Ficha técnica de esta edición. `specs.pages` define el grosor del objeto libro. */
  specs: BookSpecs;
  backCover: Localized;
  physical: Retailer[];
  digital: Retailer[];
};

export type Chapter = { number: number; title: Localized; summary?: Localized };

/** Punto clave: título corto + desarrollo. Máximo 4 por libro. */
export type KeyPoint = { title: Localized; text: Localized };

export type Book = {
  slug: string;
  title: string;
  subtitle: Localized;
  year: number;
  featured: boolean;
  description: Localized;
  keyPoints: KeyPoint[];
  chapters: Chapter[];
  editions: Edition[];
};

/**
 * TODO (David): reemplazar cada `coverUrl` por el archivo real en /public/covers/
 * (por ejemplo "/covers/colonizacion-es.jpg") cuando las portadas estén subidas.
 * TODO (David): completar capítulos reales, contraportadas y las URLs de cada retailer.
 * TODO (David): completar toda la ficha técnica (`specs`) de cada edición: editor,
 * fecha exacta, páginas, dimensiones, ISBN, si va ilustrada y rango de edad.
 */
export const books: Book[] = [
  {
    slug: "sexta-extincion",
    title: "La Sexta Extinción Masiva de Especies",
    subtitle: {
      es: "La carrera por salvar la Biodiversidad",
      en: "The race to save biodiversity",
    },
    year: 2026,
    featured: true,
    description: {
      es: "Un recorrido por la crisis de biodiversidad más acelerada desde la desaparición de los dinosaurios: qué la está causando, qué se está perdiendo y quiénes están corriendo para evitarlo. Lanzamiento en la FILBo 2026.",
      en: "A journey through the fastest biodiversity crisis since the dinosaurs vanished: what is driving it, what is being lost and who is racing to stop it. Launching at FILBo 2026.",
    },
    keyPoints: [
      {
        title: { es: "La Sexta Extinción", en: "The Sixth Extinction" },
        text: {
          es: "A diferencia de las cinco extinciones anteriores en la historia de la Tierra, la crisis actual es acelerada y causada exclusivamente por la actividad humana.",
          en: "Unlike the five previous extinctions in Earth's history, the current crisis is accelerated and driven exclusively by human activity.",
        },
      },
      {
        title: { es: "Tres frentes de colapso", en: "Three fronts of collapse" },
        text: {
          es: "Océanos vaciados, bosques fragmentados y suelos agotados: los tres sistemas donde la pérdida de especies avanza más rápido.",
          en: "Emptied oceans, fragmented forests and exhausted soils: the three systems where species loss is advancing fastest.",
        },
      },
      {
        title: { es: "Colombia en riesgo", en: "Colombia at risk" },
        text: {
          es: "Una de las potencias mundiales de biodiversidad, y también uno de los territorios donde más presión soportan los ecosistemas.",
          en: "One of the world's biodiversity powerhouses, and also one of the territories where ecosystems are under the most pressure.",
        },
      },
      {
        title: { es: "Lo que sí funciona", en: "What actually works" },
        text: {
          es: "Restauración, corredores biológicos y conservación comunitaria: las estrategias con resultados medidos, no con buenas intenciones.",
          en: "Restoration, biological corridors and community conservation: the strategies with measured results, not good intentions.",
        },
      },
    ],
    chapters: [
      // TODO (David): índice definitivo
      { number: 1, title: { es: "Cinco veces antes", en: "Five times before" } },
      { number: 2, title: { es: "El pulso del planeta", en: "The planet's pulse" } },
      { number: 3, title: { es: "Océanos vaciados", en: "Emptied oceans" } },
      { number: 4, title: { es: "El bosque que se calla", en: "The forest going silent" } },
      { number: 5, title: { es: "La carrera contrarreloj", en: "Racing the clock" } },
    ],
    editions: [
      {
        language: "es",
        coverUrl: sextaExtincionCover.url,
        specs: {
          publisher: "Sm@rt", // TODO (David)
          releaseDate: "2026-04", // TODO (David): fecha exacta de FILBo
          pages: 320, // TODO (David)
          dimensions: "16 × 23 cm", // TODO (David)
          isbn: "978-000-0000-00-0", // TODO (David)
          illustrated: true, // TODO (David)
          ageRange: { es: "14 años en adelante", en: "Ages 14 and up" }, // TODO (David)
        },
        backCover: {
          es: "TODO (David): texto de contraportada de la edición en español.",
          en: "TODO (David): back cover copy for the Spanish edition.",
        },
        // TODO (David): URLs reales de compra
        physical: [{ name: "Librería Nacional", url: "#", region: "CO" }],
        digital: [],
      },
    ],
  },
  {
    slug: "colonizacion",
    title: "La Colonización del Espacio",
    subtitle: {
      es: "El camino de la Humanidad hacia la conquista espacial",
      en: "Humanity's road to conquering space",
    },
    year: 2024,
    featured: false,
    description: {
      es: "De los primeros cohetes a las bases permanentes: la ingeniería, la biología y la política de vivir fuera de la Tierra, sin ciencia ficción de por medio.",
      en: "From the first rockets to permanent bases: the engineering, biology and politics of living off Earth, with no science fiction in between.",
    },
    keyPoints: [
      {
        title: { es: "La Luna, otra vez", en: "The Moon, again" },
        text: {
          es: "Por qué medio siglo después la Luna volvió a ser prioridad para agencias y empresas privadas.",
          en: "Why, half a century later, the Moon became a priority again for agencies and private companies.",
        },
      },
      {
        title: { es: "Marte sin retórica", en: "Mars without the rhetoric" },
        text: {
          es: "Los obstáculos que nadie ha resuelto todavía: radiación, combustible de regreso y logística de suministros.",
          en: "The obstacles nobody has solved yet: radiation, return fuel and supply logistics.",
        },
      },
      {
        title: { es: "El cuerpo en gravedad cero", en: "The body in zero gravity" },
        text: {
          es: "Huesos, músculos y visión: lo que le pasa a un organismo humano cuando deja de sentir peso.",
          en: "Bones, muscles and vision: what happens to a human organism when it stops feeling weight.",
        },
      },
      {
        title: { es: "Quién manda allá arriba", en: "Who rules up there" },
        text: {
          es: "Los tratados que gobiernan el espacio, y los vacíos legales que la minería orbital ya está poniendo a prueba.",
          en: "The treaties governing space, and the legal gaps that orbital mining is already testing.",
        },
      },
    ],
    chapters: [
      // TODO (David): índice definitivo
      { number: 1, title: { es: "Salir de la cuna", en: "Leaving the cradle" } },
      { number: 2, title: { es: "La Luna, otra vez", en: "The Moon, again" } },
      { number: 3, title: { es: "Camino a Marte", en: "Road to Mars" } },
      { number: 4, title: { es: "Vivir allá afuera", en: "Living out there" } },
    ],
    editions: [
      {
        language: "es",
        coverUrl: colonizacionCover.url, // TODO (David)
        specs: {
          publisher: "Sm@rt", // TODO (David)
          releaseDate: "2024", // TODO (David)
          pages: 248, // TODO (David)
          dimensions: "15 × 22 cm", // TODO (David)
          isbn: "978-000-0000-01-7", // TODO (David)
          illustrated: true, // TODO (David)
        },
        backCover: {
          es: "TODO (David): contraportada, edición en español.",
          en: "TODO (David): back cover, Spanish edition.",
        },
        physical: [{ name: "Librería Nacional", url: "#", region: "CO" }],
        digital: [{ name: "Kobo", url: "#", region: "GLOBAL" }],
      },
      {
        language: "en",
        coverUrl: colonizacionCover.url, // TODO (David)
        specs: {
          publisher: "Sm@rt", // TODO (David)
          releaseDate: "2024", // TODO (David)
          pages: 248, // TODO (David)
          dimensions: "6 × 9 in", // TODO (David)
          isbn: "978-000-0000-02-4", // TODO (David)
          illustrated: true, // TODO (David)
        },
        backCover: {
          es: "TODO (David): contraportada, edición en inglés.",
          en: "TODO (David): back cover, English edition.",
        },
        physical: [
          { name: "Amazon US", url: "#", region: "US" },
          { name: "Barnes & Noble", url: "#", region: "US" },
        ],
        digital: [{ name: "Kobo", url: "#", region: "GLOBAL" }],
      },
    ],
  },
  {
    slug: "smart-3",
    title: "Sm@rt 3",
    subtitle: {
      es: "Tercera entrega de la colección Sm@rt",
      en: "Third volume of the Sm@rt collection",
    },
    year: 2023,
    featured: false,
    description: {
      es: "La colección que resume, en capítulos breves, los avances científicos que de verdad importaron: física, medicina, clima, computación y espacio.",
      en: "The collection that sums up, in short chapters, the scientific advances that truly mattered: physics, medicine, climate, computing and space.",
    },
    keyPoints: [
      {
        title: { es: "Un capítulo por descubrimiento", en: "One chapter per discovery" },
        text: {
          es: "Capítulos breves y autocontenidos: se puede entrar por cualquier página sin perder el hilo.",
          en: "Short, self-contained chapters: you can start on any page without losing the thread.",
        },
      },
      {
        title: { es: "Fuentes a la vista", en: "Sources in plain sight" },
        text: {
          es: "Cada afirmación remite a la publicación primaria de la que sale, citada de forma verificable.",
          en: "Every claim points back to the primary publication it comes from, cited so it can be checked.",
        },
      },
      {
        title: { es: "Lectura no especializada", en: "Non-specialist reading" },
        text: {
          es: "Escrito para quien no tiene formación científica previa, sin sacrificar precisión.",
          en: "Written for readers with no prior scientific training, without sacrificing precision.",
        },
      },
    ],
    chapters: [
      // TODO (David): índice definitivo
      { number: 1, title: { es: "Capítulo por definir", en: "Chapter to be defined" } },
    ],
    editions: [
      {
        language: "es",
        coverUrl: smart3Cover.url, // TODO (David)
        specs: {
          publisher: "Sm@rt", // TODO (David)
          releaseDate: "2023", // TODO (David)
          pages: 196, // TODO (David)
          dimensions: "15 × 22 cm", // TODO (David)
          isbn: "978-000-0000-03-1", // TODO (David)
          illustrated: false, // TODO (David)
        },
        backCover: {
          es: "TODO (David): contraportada, edición en español.",
          en: "TODO (David): back cover, Spanish edition.",
        },
        physical: [{ name: "Librería Nacional", url: "#", region: "CO" }],
        digital: [],
      },
      {
        language: "en",
        coverUrl: smart3Cover.url, // TODO (David)
        specs: {
          publisher: "Sm@rt", // TODO (David)
          releaseDate: "2023", // TODO (David)
          pages: 196, // TODO (David)
          dimensions: "6 × 9 in", // TODO (David)
          isbn: "978-000-0000-04-8", // TODO (David)
          illustrated: false, // TODO (David)
        },
        backCover: {
          es: "TODO (David): contraportada, edición en inglés.",
          en: "TODO (David): back cover, English edition.",
        },
        physical: [{ name: "Amazon US", url: "#", region: "US" }],
        digital: [{ name: "Kobo", url: "#", region: "GLOBAL" }],
      },
    ],
  },
  {
    slug: "smart-2",
    title: "Sm@rt 2",
    subtitle: {
      es: "Los más recientes e importantes descubrimientos científicos",
      en: "The most recent and important scientific discoveries",
    },
    year: 2021,
    featured: false,
    description: {
      es: "Segunda entrega de la colección Sm@rt, disponible en español, inglés y ebook, con distribución internacional.",
      en: "Second volume of the Sm@rt collection, available in Spanish, English and ebook, with international distribution.",
    },
    keyPoints: [
      {
        title: { es: "Edición internacional", en: "International edition" },
        text: {
          es: "Publicado también en inglés, con traducción revisada para lectores de fuera de Colombia.",
          en: "Also published in English, with a revised translation for readers outside Colombia.",
        },
      },
      {
        title: { es: "Disponible en ebook", en: "Available as an ebook" },
        text: {
          es: "Versión digital para lectura en cualquier dispositivo, con el mismo contenido de la edición impresa.",
          en: "A digital version for reading on any device, with the same content as the print edition.",
        },
      },
      {
        title: { es: "Distribución global", en: "Global distribution" },
        text: {
          es: "Disponible en Estados Unidos, Reino Unido y Alemania además de las librerías colombianas.",
          en: "Available in the United States, United Kingdom and Germany besides Colombian bookstores.",
        },
      },
    ],
    chapters: [
      // TODO (David): índice definitivo
      { number: 1, title: { es: "Capítulo por definir", en: "Chapter to be defined" } },
    ],
    editions: [
      {
        language: "es",
        coverUrl: smart2Cover.url, // TODO (David)
        specs: {
          publisher: "Sm@rt", // TODO (David)
          releaseDate: "2021", // TODO (David)
          pages: 180, // TODO (David)
          dimensions: "15 × 22 cm", // TODO (David)
          isbn: "978-000-0000-05-5", // TODO (David)
          illustrated: false, // TODO (David)
        },
        backCover: {
          es: "TODO (David): contraportada, edición en español.",
          en: "TODO (David): back cover, Spanish edition.",
        },
        physical: [{ name: "Librería Nacional", url: "#", region: "CO" }],
        digital: [{ name: "Kobo", url: "#", region: "GLOBAL" }],
      },
      {
        language: "en",
        coverUrl: smart2Cover.url, // TODO (David)
        specs: {
          publisher: "Sm@rt", // TODO (David)
          releaseDate: "2021", // TODO (David)
          pages: 180, // TODO (David)
          dimensions: "6 × 9 in", // TODO (David)
          isbn: "978-000-0000-06-2", // TODO (David)
          illustrated: false, // TODO (David)
        },
        backCover: {
          es: "TODO (David): contraportada, edición en inglés.",
          en: "TODO (David): back cover, English edition.",
        },
        physical: [
          { name: "Amazon US", url: "#", region: "US" },
          { name: "Amazon UK", url: "#", region: "UK" },
          { name: "Amazon DE", url: "#", region: "DE" },
          { name: "Barnes & Noble", url: "#", region: "US" },
        ],
        digital: [
          { name: "Kobo", url: "#", region: "GLOBAL" },
          { name: "Amazon Kindle", url: "#", region: "GLOBAL" },
        ],
      },
    ],
  },
  {
    slug: "smart-1",
    title: "Sm@rt 1",
    subtitle: {
      es: "El primer volumen de la colección",
      en: "The first volume of the collection",
    },
    year: 2019,
    featured: false,
    description: {
      es: "El libro que abrió la colección Sm@rt: una selección de descubrimientos científicos contados sin jerga y con fuentes a la vista.",
      en: "The book that opened the Sm@rt collection: a selection of scientific discoveries told without jargon, sources in plain sight.",
    },
    keyPoints: [
      {
        title: { es: "El origen de la colección", en: "Where the collection started" },
        text: {
          es: "El primer volumen fijó el formato de toda la serie: capítulos breves, una idea por capítulo.",
          en: "The first volume set the format for the whole series: short chapters, one idea each.",
        },
      },
      {
        title: { es: "Edición en español", en: "Spanish edition" },
        text: {
          es: "Publicado únicamente en español, con distribución en librerías colombianas.",
          en: "Published in Spanish only, distributed through Colombian bookstores.",
        },
      },
    ],
    chapters: [
      // TODO (David): índice definitivo
      { number: 1, title: { es: "Capítulo por definir", en: "Chapter to be defined" } },
    ],
    editions: [
      {
        language: "es",
        coverUrl: smart1Cover.url, // TODO (David)
        specs: {
          publisher: "Sm@rt", // TODO (David)
          releaseDate: "2019", // TODO (David)
          pages: 164, // TODO (David)
          dimensions: "15 × 22 cm", // TODO (David)
          isbn: "978-000-0000-07-9", // TODO (David)
          illustrated: false, // TODO (David)
        },
        backCover: {
          es: "TODO (David): contraportada, edición en español.",
          en: "TODO (David): back cover, Spanish edition.",
        },
        physical: [{ name: "Librería Nacional", url: "#", region: "CO" }],
        digital: [],
      },
    ],
  },
  {
    slug: "guia-covid",
    title: "Guía Covid-19",
    subtitle: {
      es: "Lo que la ciencia estableció durante la pandemia",
      en: "What science established during the pandemic",
    },
    year: 2020,
    featured: false,
    description: {
      es: "Una guía de divulgación escrita durante la pandemia: virología básica, transmisión, vacunas y cómo leer la evidencia cuando cambia cada semana.",
      en: "A popular-science guide written during the pandemic: basic virology, transmission, vaccines and how to read evidence that shifts every week.",
    },
    keyPoints: [
      {
        title: { es: "Virología desde cero", en: "Virology from scratch" },
        text: {
          es: "Qué es un virus, cómo infecta y por qué muta, explicado sin dar nada por sabido.",
          en: "What a virus is, how it infects and why it mutates, explained without assuming prior knowledge.",
        },
      },
      {
        title: { es: "Evidencia en tiempo real", en: "Evidence in real time" },
        text: {
          es: "Cómo se lee un estudio preliminar y por qué las recomendaciones cambiaban de una semana a otra.",
          en: "How to read a preliminary study and why recommendations changed from one week to the next.",
        },
      },
    ],
    chapters: [
      // TODO (David): índice definitivo
      { number: 1, title: { es: "Capítulo por definir", en: "Chapter to be defined" } },
    ],
    editions: [
      {
        language: "es",
        coverUrl: guiaCovidCover.url, // TODO (David)
        specs: {
          publisher: "Sm@rt", // TODO (David)
          releaseDate: "2020", // TODO (David)
          pages: 96, // TODO (David)
          dimensions: "14 × 21 cm", // TODO (David)
          isbn: "978-000-0000-08-6", // TODO (David)
          illustrated: false, // TODO (David)
        },
        backCover: {
          es: "TODO (David): contraportada, edición en español.",
          en: "TODO (David): back cover, Spanish edition.",
        },
        physical: [{ name: "Librería Nacional", url: "#", region: "CO" }],
        digital: [],
      },
    ],
  },
];
