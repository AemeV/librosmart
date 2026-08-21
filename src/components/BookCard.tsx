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
  const [, setHover] = useState(false);
  const [turns, setTurns] = useState(0);

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
  const canFlip = Boolean(backCover) && !placeholder;
  const showingBack = turns % 2 === 1;

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
      className="relative mx-auto flex h-[320px] w-full items-center justify-center sm:h-[440px]"
      style={{ perspective: 1400 }}
    >
      <motion.div
        className="relative h-full"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={reduced ? {} : { y: -6 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
      >
        <motion.div
          role={canFlip ? "button" : undefined}
          tabIndex={canFlip ? 0 : undefined}
          aria-label={canFlip ? (showingBack ? "Ver portada" : "Ver contraportada") : undefined}
          onClick={() => canFlip && setTurns((v) => v + 1)}
          onKeyDown={(event) => {
            if (!canFlip) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setTurns((v) => v + 1);
            }
          }}
          animate={{ rotateY: turns * 180 }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 16 }}
          className={`relative h-full ${canFlip ? "cursor-pointer" : ""}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Cara frontal: portada */}
          <div className="relative h-full" style={{ backfaceVisibility: "hidden" }}>
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
              className="pointer-events-none absolute inset-y-[-30%] left-0 w-[35%] overflow-hidden"
              style={{
                x: shineX,
                rotate: 14,
                backgroundImage:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0) 100%)",
              }}
            />
          </div>

          {/* Cara trasera: contraportada, girada 180deg. */}
          {canFlip ? (
            <img
              src={backCover}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="absolute inset-0 block h-full w-full rounded-[16px] object-contain shadow-[0_18px_50px_-20px_rgba(15,3,45,0.45)]"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            />
          ) : null}
        </motion.div>
      </motion.div>
    </div>
  );
}
