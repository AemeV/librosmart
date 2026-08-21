import { motion } from "motion/react";
import { Instagram, Music2 } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";
import { INSTAGRAM_URL, TIKTOK_URL } from "@/lib/social";
import { tap } from "@/lib/motion-config";

/**
 * Tarjeta del autor: horizontal en desktop, vertical en móvil.
 * Se reutiliza tanto en el sheet emergente como en la sección inline.
 */
export function AuthorCard({ className }: { className?: string }) {
  const { t } = useLang();
  const { images } = useSiteContent();
  const portrait = images["author_portrait"] ?? "";

  return (
    <div
      className={`relative flex w-full flex-col overflow-hidden rounded-[28px] bg-midnight text-seashell shadow-[0_30px_80px_-20px_rgba(5,1,16,0.7)] md:flex-row ${className ?? ""}`}
    >
      <div className="relative shrink-0 md:w-[42%]">
        <img
          src={portrait}
          alt={t("authorPortraitAlt")}
          width={1024}
          height={1024}
          loading="lazy"
          className="h-64 w-full object-cover object-center md:h-full"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight via-midnight/25 to-transparent md:bg-gradient-to-r md:from-transparent md:via-midnight/10 md:to-midnight"
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-8 text-center sm:px-10 sm:py-12">
        <div>
          <h2 className="display-m">David Mauricio Guerrero Vélez</h2>
          <p className="label mt-3 text-seashell/70">{t("authorSheetRole")}</p>
        </div>

        <p className="body-s text-center text-seashell/85">{t("authorBio1")}</p>
        <p className="body-s text-center text-seashell/85">{t("authorBio2")}</p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <motion.a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={tap}
            className="body-s inline-flex min-h-11 items-center gap-2 rounded-full border border-seashell/30 bg-seashell/10 px-5 text-seashell transition-colors hover:bg-seashell hover:text-midnight"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            Instagram
          </motion.a>
          <motion.a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={tap}
            className="body-s inline-flex min-h-11 items-center gap-2 rounded-full border border-seashell/30 bg-seashell/10 px-5 text-seashell transition-colors hover:bg-seashell hover:text-midnight"
          >
            <Music2 className="h-4 w-4" aria-hidden="true" />
            TikTok
          </motion.a>
        </div>
      </div>
    </div>
  );
}
