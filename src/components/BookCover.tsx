import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { BookOpen } from "lucide-react";
import type { MouseEvent } from "react";
import { springFast } from "@/lib/motion-config";

/** Portada con tilt 3D siguiendo el cursor (máx. 8°) y sombra proyectada. */
export function BookCover({
  src,
  alt,
  title,
}: {
  src: string;
  alt: string;
  title: string;
}) {
  const reduced = useReducedMotion();
  const rx = useSpring(useMotionValue(0), springFast);
  const ry = useSpring(useMotionValue(0), springFast);
  const rotateX = useTransform(rx, (v) => `${v}deg`);
  const rotateY = useTransform(ry, (v) => `${v}deg`);
  const isPlaceholder = src.startsWith("/covers/");

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 16);
    rx.set(-py * 16);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div
      className="w-[65vw] max-w-[340px] sm:w-full sm:max-w-[380px]"
      style={{ perspective: 1000 }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="overflow-hidden rounded-[14px] border border-line bg-surface-2 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)]"
      >
        {isPlaceholder ? (
          // TODO (David): al subir la portada a /public/covers/ esto muestra la imagen real.
          <div
            className="flex flex-col items-center justify-center gap-3 px-6 text-center"
            style={{ aspectRatio: "2 / 3" }}
            role="img"
            aria-label={alt}
          >
            <BookOpen className="h-6 w-6 text-text-muted" aria-hidden="true" />
            <span className="display text-2xl leading-tight">{title}</span>
            <span className="meta">Portada pendiente</span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="block w-full"
            style={{ aspectRatio: "2 / 3", objectFit: "cover" }}
          />
        )}
      </motion.div>
    </div>
  );
}
