import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { springFast, springSheet, tap } from "@/lib/motion-config";
import { bodyById } from "@/data/bodies";
import { bodyDistanceMkm, compass } from "@/lib/sky";
import type { PlanetHit } from "./SkyLayer";

/**
 * Tarjeta de información de un cuerpo del cielo. Anclada junto al cuerpo en
 * desktop, sheet arrastrable desde abajo en mobile. Los datos de posición se
 * calculan en vivo con astronomy-engine; los datos característicos vienen de
 * src/data/bodies.ts.
 */
export function SkyBodyCard({ hit, onClose }: { hit: PlanetHit; onClose: () => void }) {
  const { lang, t } = useLang();
  const isMobile = useIsMobile();
  const info = bodyById(hit.id);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    ref.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!info) return null;

  const distance = bodyDistanceMkm(hit.id, new Date());
  const title = info.name[lang];

  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <h3 className="display-m">{title}</h3>
        <motion.button
          type="button"
          onClick={onClose}
          whileTap={tap}
          aria-label={t("close")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/85"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      </div>

      <div className="mt-4">
        <p className="label opacity-70">{t("skyLivePosition")}</p>
        <dl className="mt-2 grid grid-cols-3 gap-3">
          <div>
            <dt className="label opacity-60">{t("skyAltitude")}</dt>
            <dd className="body-s mt-1 text-white/90">{hit.alt.toFixed(1)}°</dd>
          </div>
          <div>
            <dt className="label opacity-60">{t("skyAzimuth")}</dt>
            <dd className="body-s mt-1 text-white/90">
              {hit.az.toFixed(1)}° {compass(hit.az, lang)}
            </dd>
          </div>
          <div>
            <dt className="label opacity-60">{t("skyDistance")}</dt>
            <dd className="body-s mt-1 text-white/90">
              {distance ? `${distance.toFixed(1)} M km` : "—"}
            </dd>
          </div>
        </dl>
      </div>

      <p className="body-s mt-4 text-left text-white/85">{info.blurb[lang]}</p>

      <dl className="mt-4 grid gap-x-4 gap-y-3 sm:grid-cols-2">
        {info.facts.map((fact) => (
          <div key={fact.label.en}>
            <dt className="label opacity-60">{fact.label[lang]}</dt>
            <dd className="body-s mt-1 text-white/90">{fact.value[lang]}</dd>
          </div>
        ))}
      </dl>

      <Link
        to="/libros/$slug"
        params={{ slug: info.relatedBookSlug }}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#4E2BCC] px-5 text-sm font-medium text-[#EFEFEF]"
      >
        {t("skyReadMore")}
      </Link>
    </>
  );

  if (isMobile) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm"
        />
        <motion.div
          ref={ref}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={springSheet}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, i) => {
            if (i.offset.y > 100 || i.velocity.y > 600) onClose();
          }}
          className="glass fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[24px] px-5 pt-3 pb-10 text-white"
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/35" aria-hidden="true" />
          {body}
        </motion.div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
      <motion.div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="false"
        aria-label={title}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={springFast}
        className="glass absolute z-50 w-[340px] max-w-[86vw] rounded-[20px] p-5 text-white"
        style={{
          left: Math.max(12, Math.min(hit.x - 170, (typeof window !== "undefined" ? window.innerWidth : 1200) - 360)),
          top: Math.max(12, hit.y + hit.r + 24),
        }}
      >
        {body}
      </motion.div>
    </>
  );
}
