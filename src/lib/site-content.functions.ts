import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  fallbackContent,
  mapBookRow,
  mapReaderRow,
  type BookRow,
  type ReaderPhotoRow,
  type SiteContent,
} from "@/lib/site-content";
import type { Localized } from "@/i18n/strings";

/**
 * Lectura pública del contenido editable (libros, lectores, textos, imágenes).
 * Usa la clave publicable: las políticas de la base solo permiten leer.
 */
export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteContent> => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return fallbackContent;

    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    try {
      const [booksRes, readersRes, textsRes, imagesRes] = await Promise.all([
        supabase.from("books").select("*").order("position", { ascending: true }),
        supabase.from("reader_photos").select("*").order("position", { ascending: true }),
        supabase.from("site_texts").select("key, value_es, value_en"),
        supabase.from("site_images").select("key, image_url"),
      ]);

      const texts: Record<string, Localized> = {};
      for (const row of textsRes.data ?? []) {
        texts[row.key] = { es: row.value_es, en: row.value_en || row.value_es };
      }
      const images: Record<string, string> = { ...fallbackContent.images };
      for (const row of imagesRes.data ?? []) {
        if (row.image_url) images[row.key] = row.image_url;
      }

      const books = (booksRes.data ?? []).map((row) => mapBookRow(row as unknown as BookRow));
      const readers = (readersRes.data ?? []).map((row) =>
        mapReaderRow(row as unknown as ReaderPhotoRow),
      );

      return {
        books: books.length ? books : fallbackContent.books,
        readers: readers.length ? readers : fallbackContent.readers,
        texts,
        images,
      };
    } catch {
      return fallbackContent;
    }
  },
);
