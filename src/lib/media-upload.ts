import { supabase } from "@/integrations/supabase/client";

/**
 * Sube una imagen al bucket privado `media` y devuelve la URL pública que
 * sirve la ruta `/api/public/media/*`.
 */
export async function uploadMedia(folder: string, file: File): Promise<string> {
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${crypto.randomUUID()}.${ext || "jpg"}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return `/api/public/media/${path}`;
}
