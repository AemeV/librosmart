import type { Localized } from "@/i18n/strings";
import sextaExtincionCover from "@/assets/portada-sexta-extincion.png.asset.json";

export type Retailer = {
  name: string;
  url: string;
  region?: "CO" | "US" | "UK" | "DE" | "GLOBAL";
};

export type Edition = {
  language: "es" | "en";
  coverUrl: string;
  /** Número de páginas: define el grosor real del objeto libro. TODO (David): ajustar. */
  pages: number;
  backCover: Localized;
  physical: Retailer[];
  digital: Retailer[];
};

export type Chapter = { number: number; title: Localized; summary?: Localized };

export type Book = {
  slug: string;
  title: string;
  subtitle: Localized;
  year: number;
  featured: boolean;
  description: Localized;
  keyPoints: Localized[];
  chapters: Chapter[];
  editions: Edition[];
};

/**
 * TODO (David): reemplazar cada `coverUrl` por el archivo real en /public/covers/
 * (por ejemplo "/covers/colonizacion-es.jpg") cuando las portadas estén subidas.
 * TODO (David): completar capítulos reales, contraportadas y las URLs de cada retailer.
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
        es: "Las cinco extinciones anteriores y por qué esta es distinta",
        en: "The five previous extinctions and why this one is different",
      },
      {
        es: "Océanos, bosques y suelos: los tres frentes del colapso",
        en: "Oceans, forests and soils: the three fronts of collapse",
      },
      {
        es: "Colombia como potencia de biodiversidad en riesgo",
        en: "Colombia as a biodiversity powerhouse at risk",
      },
      {
        es: "Qué está funcionando en conservación y restauración",
        en: "What is actually working in conservation and restoration",
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
        pages: 320,
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
      { es: "Por qué la Luna vuelve a ser prioridad", en: "Why the Moon is a priority again" },
      { es: "Marte: los obstáculos que nadie resuelve todavía", en: "Mars: the obstacles nobody has solved yet" },
      { es: "El cuerpo humano en gravedad cero", en: "The human body in zero gravity" },
      { es: "Quién manda en el espacio y con qué leyes", en: "Who rules space, and under which laws" },
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
        coverUrl: "/covers/colonizacion-es.jpg", // TODO (David)
        pages: 248,
        backCover: {
          es: "TODO (David): contraportada, edición en español.",
          en: "TODO (David): back cover, Spanish edition.",
        },
        physical: [{ name: "Librería Nacional", url: "#", region: "CO" }],
        digital: [{ name: "Kobo", url: "#", region: "GLOBAL" }],
      },
      {
        language: "en",
        coverUrl: "/covers/colonizacion-en.jpg", // TODO (David)
        pages: 248,
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
      { es: "Capítulos breves, uno por descubrimiento", en: "Short chapters, one per discovery" },
      { es: "Fuentes primarias citadas", en: "Primary sources cited" },
      { es: "Pensado para lectura no especializada", en: "Written for non-specialist readers" },
    ],
    chapters: [
      // TODO (David): índice definitivo
      { number: 1, title: { es: "Capítulo por definir", en: "Chapter to be defined" } },
    ],
    editions: [
      {
        language: "es",
        coverUrl: "/covers/smart-3-es.jpg", // TODO (David)
        pages: 196,
        backCover: {
          es: "TODO (David): contraportada, edición en español.",
          en: "TODO (David): back cover, Spanish edition.",
        },
        physical: [{ name: "Librería Nacional", url: "#", region: "CO" }],
        digital: [],
      },
      {
        language: "en",
        coverUrl: "/covers/smart-3-en.jpg", // TODO (David)
        pages: 196,
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
      { es: "Edición internacional en inglés", en: "International English edition" },
      { es: "Disponible en ebook", en: "Available as an ebook" },
      { es: "Distribución en EE. UU., Reino Unido y Alemania", en: "Distribution in the US, UK and Germany" },
    ],
    chapters: [
      // TODO (David): índice definitivo
      { number: 1, title: { es: "Capítulo por definir", en: "Chapter to be defined" } },
    ],
    editions: [
      {
        language: "es",
        coverUrl: "/covers/smart-2-es.jpg", // TODO (David)
        pages: 180,
        backCover: {
          es: "TODO (David): contraportada, edición en español.",
          en: "TODO (David): back cover, Spanish edition.",
        },
        physical: [{ name: "Librería Nacional", url: "#", region: "CO" }],
        digital: [{ name: "Kobo", url: "#", region: "GLOBAL" }],
      },
      {
        language: "en",
        coverUrl: "/covers/smart-2-en.jpg", // TODO (David)
        pages: 180,
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
      { es: "El origen de la colección", en: "Where the collection started" },
      { es: "Edición en español", en: "Spanish edition" },
    ],
    chapters: [
      // TODO (David): índice definitivo
      { number: 1, title: { es: "Capítulo por definir", en: "Chapter to be defined" } },
    ],
    editions: [
      {
        language: "es",
        coverUrl: "/covers/smart-1-es.jpg", // TODO (David)
        pages: 164,
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
      { es: "Virología explicada desde cero", en: "Virology explained from scratch" },
      { es: "Cómo se leyó la evidencia en tiempo real", en: "How evidence was read in real time" },
    ],
    chapters: [
      // TODO (David): índice definitivo
      { number: 1, title: { es: "Capítulo por definir", en: "Chapter to be defined" } },
    ],
    editions: [
      {
        language: "es",
        coverUrl: "/covers/guia-covid-es.jpg", // TODO (David)
        pages: 96,
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
