import type { Book, Edition, Retailer } from "@/data/books";
import { books as staticBooks } from "@/data/books";
import { readerPhotos as staticReaders, type ReaderPhoto } from "@/data/readers";
import type { Lang, Localized } from "@/i18n/strings";
import portraitAsset from "@/assets/retrato-david.png.asset.json";

/** Fila cruda de la tabla `books` tal como la devuelve la base de datos. */
export type BookRow = {
  id: string;
  slug: string;
  title: string;
  subtitle_es: string;
  subtitle_en: string;
  description_es: string;
  description_en: string;
  year: number;
  featured: boolean;
  position: number;
  cover_url: string;
  back_cover_url: string | null;
  back_cover_es: string;
  back_cover_en: string;
  publisher: string;
  release_date: string;
  pages: number;
  dimensions: string;
  isbn: string;
  illustrated: boolean;
  key_points: KeyPointRow[];
  chapters: ChapterRow[];
  retailers: RetailerRow[];
};

export type KeyPointRow = {
  title_es: string;
  title_en: string;
  text_es: string;
  text_en: string;
};
export type ChapterRow = { number: number; title_es: string; title_en: string };
export type RetailerRow = {
  name: string;
  url: string;
  region?: Retailer["region"];
  kind: "physical" | "digital";
  language: Lang;
};

export type ReaderPhotoRow = {
  id: string;
  image_url: string;
  caption_es: string;
  caption_en: string;
  position: number;
};

export type SiteTextRow = { key: string; value_es: string; value_en: string };

export type SiteContent = {
  books: Book[];
  readers: ReaderPhoto[];
  texts: Record<string, Localized>;
  images: Record<string, string>;
};

function toRetailer(r: RetailerRow): Retailer {
  return r.region ? { name: r.name, url: r.url, region: r.region } : { name: r.name, url: r.url };
}

const loc = (es: string, en: string): Localized => ({ es, en: en || es });

export function mapBookRow(row: BookRow): Book {
  const languages: Lang[] = ["es", "en"];
  const editions: Edition[] = languages
    .filter((lang) => lang === "es" || row.retailers.some((r) => r.language === "en"))
    .map((lang) => ({
      language: lang,
      coverUrl: row.cover_url,
      specs: {
        publisher: row.publisher,
        releaseDate: row.release_date,
        pages: row.pages,
        dimensions: row.dimensions,
        isbn: row.isbn,
        illustrated: row.illustrated,
      },
      backCover: loc(row.back_cover_es, row.back_cover_en),
      physical: row.retailers
        .filter((r) => r.language === lang && r.kind === "physical")
        .map(toRetailer),
      digital: row.retailers
        .filter((r) => r.language === lang && r.kind === "digital")
        .map(toRetailer),
    }));

  return {
    slug: row.slug,
    title: row.title,
    subtitle: loc(row.subtitle_es, row.subtitle_en),
    year: row.year,
    featured: row.featured,
    description: loc(row.description_es, row.description_en),
    keyPoints: (row.key_points ?? []).map((k) => ({
      title: loc(k.title_es, k.title_en),
      text: loc(k.text_es, k.text_en),
    })),
    chapters: (row.chapters ?? []).map((c) => ({
      number: c.number,
      title: loc(c.title_es, c.title_en),
    })),
    editions,
  };
}

export function mapReaderRow(row: ReaderPhotoRow): ReaderPhoto {
  const caption = loc(row.caption_es, row.caption_en);
  return row.image_url
    ? { id: row.id, src: row.image_url, caption }
    : { id: row.id, caption };
}

/** Contenido estático: se usa mientras la base responde o si falla. */
export const fallbackContent: SiteContent = {
  books: staticBooks,
  readers: staticReaders,
  texts: {},
  images: { author_portrait: portraitAsset.url },
};
