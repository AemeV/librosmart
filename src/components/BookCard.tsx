import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import type { Book, Edition } from "@/data/books";

/**
 * <BookCard /> — la portada como tarjeta, no como objeto libro.
 * Movimiento leve: inclinación suave siguiendo el cursor (desktop) y una banda
 * especular que cruza al pasar por encima. En móvil es una tarjeta quieta.
 */

export function isPlaceholderCover(edition: Edition) {
  return !edition.coverUrl || edition.coverUrl.startsWith("/covers/");
}

const SOFT = { stiffness: 140, damping: 18, mass: 0.6 };

export function BookCard({
  book,
  edition,
  featured = false,
  alt,
}: {
  book: Book;
  edition: Edition;
  featured?: boolean;
  alt: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], reduced ? [0, 0] : [-7, 7]), SOFT);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], reduced ? [0, 0] : [5, -5]), SOFT);
  const shineX = useSpring(useTransform(px, [-0.5, 0.5], reduced ? ["0%", "0%"] : ["-60%", "160%"]), SOFT);

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    px.set(0);
    py.set(0);
  }

  const placeholder = isPlaceholderCover(edition);

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative mx-auto w-full ${featured ? "max-w-[320px]" : "max-w-[260px]"}`}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative overflow-hidden rounded-[16px]"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={reduced ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
      >
        {placeholder ? (
          <div
            role="img"
            aria-label={alt}
            className="flex aspect-[2/3] w-full flex-col items-center justify-center gap-3 rounded-[16px] border border-line bg-surface-alt px-6 text-center"
          >
            <span className="display-m">{book.title}</span>
            <span className="label">Portada pendiente</span>
          </div>
        ) : (
          <img
            src={edition.coverUrl}
            alt={alt}
            loading="lazy"
            draggable={false}
            className="block w-full rounded-[16px] object-contain shadow-[0_18px_50px_-20px_rgba(15,3,45,0.55)]"
          />
        )}

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-[-30%] left-0 w-[35%]"
          style={{
            x: shineX,
            rotate: 14,
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0) 100%)",
          }}
        />
      </motion.div>
    </div>
  );
}
