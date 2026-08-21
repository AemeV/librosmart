import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import type { Book, Edition } from "@/data/books";

/**
 * <BookCard /> — la portada como tarjeta, no como objeto libro.
 * Movimiento leve: inclinación suave siguiendo el cursor (desktop) y una banda
 * especular que cruza al pasar por encima. Si la edición tiene contraportada,
 * al pasar el cursor esta se despliega al lado de la portada.
 */

export function isPlaceholderCover(edition: Edition) {
  return !edition.coverUrl || edition.coverUrl.startsWith("/covers/");
}

const SOFT = { stiffness: 140, damping: 18, mass: 0.6 };

export function BookCard({
  book,
  edition,
  alt,
}: {
  book: Book;
  edition: Edition;
  /** Se conserva por compatibilidad: todas las portadas comparten alto. */
  featured?: boolean;
  alt: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const [hover, setHover] = useState(false);

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

  const placeholder = isPlaceholderCover(edition);
  const backCover = edition.backCoverUrl;

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHover(true);
      }}
      onPointerLeave={() => {
        setHover(false);
        px.set(0);
        py.set(0);
      }}
      className="relative mx-auto flex h-[320px] w-full items-center justify-center gap-4 sm:h-[440px]"
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative h-full overflow-hidden rounded-[16px]"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={reduced ? {} : { y: -6 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
      >
        {placeholder ? (
          <div
            role="img"
            aria-label={alt}
            className="flex h-full w-[213px] flex-col items-center justify-center gap-3 rounded-[16px] border border-line bg-surface-alt px-6 text-center sm:w-[293px]"
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
            className="block h-full w-auto rounded-[16px] object-contain shadow-[0_18px_50px_-20px_rgba(15,3,45,0.55)]"
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

      {/* Contraportada: sólo desktop y sólo al pasar el cursor. */}
      {backCover ? (
        <AnimatePresence>
          {hover && (
            <motion.img
              key="back"
              src={backCover}
              alt=""
              aria-hidden="true"
              draggable={false}
              initial={{ opacity: 0, x: -24, rotateY: 12 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -24, rotateY: 12 }}
              transition={springFast}
              className="hidden h-full w-auto rounded-[16px] object-contain shadow-[0_18px_50px_-20px_rgba(15,3,45,0.45)] lg:block"
            />
          )}
        </AnimatePresence>
      ) : null}
    </div>
  );
}
