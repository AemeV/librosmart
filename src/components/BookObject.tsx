import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Book, Edition } from "@/data/books";
import { useLang } from "@/context/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * <BookObject /> — un libro físico, no una tarjeta.
 *
 * DESKTOP (≥768px): objeto 3D interactivo. Se abre como una puerta sobre el
 * canto de las hojas revelando contratapa e índice.
 *
 * MÓVIL (<768px): objeto PASIVO. No es botón, no se abre, no tiene handlers de
 * touch/pointer/drag — el scroll vertical pasa limpio por encima. Solo reacciona
 * a la luz: balanceo mínimo de rotación y una banda especular ligados al scroll,
 * todo con motion values (cero re-renders por frame). El índice vive en un
 * acordeón debajo del libro (ver <BookContents /> en BookEntry).
 */

const OPEN_SPRING = { type: "spring" as const, stiffness: 60, damping: 18 };
const HOVER_SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

/** Canto de las hojas apiladas: líneas verticales finas de papel crema. */
function PageEdge({ style, className = "" }: { style?: React.CSSProperties; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: "#efe9dc",
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(120,108,88,0.42) 0px, rgba(120,108,88,0.42) 0.5px, rgba(255,253,247,0.95) 0.5px, rgba(255,253,247,0.95) 2px)",
        ...style,
      }}
    />
  );
}

function Paper({
  children,
  className = "",
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`bg-surface-alt ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(214,192,150,0.16) 0%, rgba(214,192,150,0.05) 45%, rgba(120,108,88,0.08) 100%)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CoverFace({ edition, book, alt }: { edition: Edition; book: Book; alt: string }) {
  const isPlaceholder = edition.coverUrl.startsWith("/covers/");
  if (isPlaceholder) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="flex h-full w-full flex-col items-center justify-center gap-3 bg-midnight px-6 text-center text-seashell [backface-visibility:hidden] dark:bg-seashell dark:text-midnight"
      >
        <span className="display-m">{book.title}</span>
        <span className="label">Portada pendiente</span>
      </div>
    );
  }
  return (
    <img
      src={edition.coverUrl}
      alt={alt}
      loading="lazy"
      className="h-full w-full bg-transparent object-contain [backface-visibility:hidden]"
      draggable={false}
    />
  );
}

/** Caras estructurales compartidas: contratapa, lomo y bloque de hojas. */
function BookFaces({
  book,
  width,
  height,
  thickness,
}: {
  book: Book;
  width: number;
  height: number;
  thickness: number;
}) {
  return (
    <>
      {/* Contratapa */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[10px] bg-midnight [backface-visibility:hidden] dark:bg-seashell"
        style={{ transform: `translateZ(-${thickness / 2}px) rotateY(180deg)` }}
      />

      {/* Lomo: título en vertical */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 flex items-center justify-center overflow-hidden rounded-[3px] bg-midnight text-seashell [backface-visibility:hidden] dark:bg-seashell dark:text-midnight"
        style={{
          width: thickness,
          height,
          transform: `translateX(-${thickness / 2}px) rotateY(-90deg)`,
          boxShadow: "inset 0 0 12px rgba(0,0,0,0.35)",
        }}
      >
        <span className="spine-text whitespace-nowrap" style={{ writingMode: "vertical-rl" }}>
          {book.title}
        </span>
      </div>

      {/* Bloque de hojas */}
      <PageEdge
        className="absolute top-0 right-0 rounded-[2px]"
        style={{
          width: thickness,
          height: height - 6,
          top: 3,
          transform: `translateX(${thickness / 2}px) rotateY(90deg)`,
        }}
      />
      <PageEdge
        className="absolute right-0 rounded-[2px]"
        style={{
          height: thickness,
          width: width - 8,
          top: -thickness / 2 + 3,
          transform: `rotateX(90deg) translateZ(0px)`,
        }}
      />
    </>
  );
}

export function ChapterList({ book, revealed }: { book: Book; revealed: boolean }) {
  const { tr, t } = useLang();
  return (
    <div>
      <p className="label">{t("indexTitle")}</p>
      <ol className="mt-4 space-y-3">
        {book.chapters.map((chapter, i) => (
          <motion.li
            key={chapter.number}
            initial={{ opacity: 0, y: 8 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.4, delay: revealed ? i * 0.05 : 0 }}
            className="flex gap-3"
          >
            <span className="label pt-0.5">{String(chapter.number).padStart(2, "0")}</span>
            <span>
              <span className="body">{tr(chapter.title)}</span>
              {chapter.summary ? <span className="body-s block">{tr(chapter.summary)}</span> : null}
            </span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/** Móvil: libro pasivo que solo reacciona a la luz al hacer scroll. */
function PassiveBook({
  book,
  edition,
  width,
  height,
  thickness,
  alt,
  reduced,
}: {
  book: Book;
  edition: Edition;
  width: number;
  height: number;
  thickness: number;
  alt: string;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const rotateY = useTransform(scrollYProgress, [0, 1], reduced ? [-12, -12] : [-18, -6]);
  const shineX = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-130%", "130%"]);
  const shadowX = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [10, -10]);
  const shadowScale = useTransform(scrollYProgress, [0, 0.5, 1], reduced ? [1, 1, 1] : [1.06, 1, 1.06]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative block"
      style={{ perspective: 2000, width, height }}
    >
      <motion.div
        className="pointer-events-none absolute right-2 -bottom-4 left-[-6%] h-6 rounded-[50%]"
        style={{
          x: shadowX,
          scaleX: shadowScale,
          background: "rgba(0,0,0,0.75)",
          filter: "blur(16px)",
          opacity: 0.24,
        }}
      />
      <motion.div
        className="relative"
        style={{ width, height, transformStyle: "preserve-3d", rotateY, rotateX: 4 }}
      >
        <BookFaces book={book} width={width} height={height} thickness={thickness} />

        {/* Tapa + banda especular */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[4px_10px_10px_4px]"
          style={{ transform: `translateZ(${thickness / 2}px)` }}
        >
          <CoverFace book={book} edition={edition} alt={alt} />
          <motion.div
            className="pointer-events-none absolute inset-y-[-40%] left-0 w-[45%]"
            style={{
              x: shineX,
              rotate: 18,
              backgroundImage:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 100%)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export function BookObject({
  book,
  edition,
  featured = false,
}: {
  book: Book;
  edition: Edition;
  featured?: boolean;
}) {
  const { t, tr } = useLang();
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [past90, setPast90] = useState(false);
  const [hover, setHover] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const width = isMobile ? 260 : featured ? 300 : 232;
  const height = Math.round(width * 1.5);
  const thickness = Math.max(18, edition.specs.pages * 0.055);

  const angle = useSpring(0, OPEN_SPRING);
  const coverRotate = useTransform(angle, (v) => v);
  const coverOpacity = useTransform(angle, [-82, -100], [1, 0]);
  const seamOpacity = useTransform(angle, [0, -90, -165], [0, 0.45, 0.12]);

  useMotionValueEvent(angle, "change", (v) => setPast90(v < -90));

  useEffect(() => {
    if (isMobile) return;
    angle.set(open ? -165 : 0);
  }, [open, angle, isMobile]);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Escape + focus trap dentro del índice abierto (solo desktop).
  useEffect(() => {
    if (!open || isMobile) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const root = overlayRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const raf = requestAnimationFrame(() => {
      overlayRef.current?.querySelector<HTMLElement>("button")?.focus();
    });
    return () => {
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
    };
  }, [open, close, isMobile]);

  const alt = `${t("coverAlt")} ${book.title} — ${tr(book.subtitle)}`;
  const label = open ? `${t("closeBook")} ${book.title}` : `${t("openBook")} ${book.title}`;

  // MÓVIL: objeto pasivo, sin gestos ni handlers. El scroll manda.
  if (isMobile) {
    return (
      <PassiveBook
        book={book}
        edition={edition}
        width={width}
        height={height}
        thickness={thickness}
        alt={alt}
        reduced={reduced}
      />
    );
  }

  const spread = (
    <>
      {/* Contratapa interior (izquierda del pliego) */}
      <Paper
        className="absolute top-0 overflow-hidden rounded-l-[10px] p-6 text-left shadow-[inset_-14px_0_24px_-18px_rgba(0,0,0,0.5)]"
        style={{
          width,
          height,
          left: -width,
          transform: `translateZ(${thickness / 2 - 4}px)`,
        }}
      >
        <p className="label">{t("backCoverTitle")}</p>
        <p className="body-s mt-4">{tr(edition.backCover)}</p>
      </Paper>

      {/* Índice (derecha del pliego, sobre el bloque de hojas) */}
      <Paper
        className="absolute inset-0 overflow-hidden rounded-r-[10px] p-6 text-left"
        style={{ transform: `translateZ(${thickness / 2 - 4}px)` }}
      >
        <ChapterList book={book} revealed={past90} />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-10"
          style={{
            opacity: seamOpacity,
            backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.55), rgba(0,0,0,0))",
          }}
        />
      </Paper>
    </>
  );

  const book3d = (
    <motion.div
      className="relative"
      style={{ width, height, transformStyle: "preserve-3d" }}
      animate={
        reduced
          ? {}
          : {
              rotateY: open ? -6 : hover ? -6 : -12,
              rotateX: open ? 0 : 4,
              y: hover && !open ? -12 : 0,
              x: open ? width / 2 : 0,
            }
      }
      transition={open ? OPEN_SPRING : HOVER_SPRING}
    >
      {open && spread}

      <BookFaces book={book} width={width} height={height} thickness={thickness} />

      {/* Tapa frontal: puerta sobre el canto de las hojas */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-[4px_10px_10px_4px]"
        style={{
          transformOrigin: "left center",
          transformStyle: "flat",
          rotateY: reduced ? 0 : coverRotate,
          translateZ: thickness / 2,
          backfaceVisibility: "hidden",
          opacity: reduced ? (open ? 0 : 1) : coverOpacity,
        }}
      >
        <CoverFace book={book} edition={edition} alt={alt} />
      </motion.div>
    </motion.div>
  );

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className="relative block cursor-pointer rounded-[12px] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-text"
        style={{
          perspective: 2000,
          width,
          height,
          transformStyle: "preserve-3d",
          zIndex: open ? 50 : undefined,
        }}
      >
        {/* Sombra proyectada asimétrica, coherente con la rotación en reposo */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute right-2 -bottom-4 left-[-6%] h-6 rounded-[50%]"
          animate={{
            opacity: hover ? 0.32 : 0.22,
            scaleX: hover ? 1.06 : 1,
            filter: hover ? "blur(22px)" : "blur(14px)",
          }}
          transition={HOVER_SPRING}
          style={{ background: "rgba(0,0,0,0.75)" }}
        />
        {book3d}
      </motion.button>

      {/* Desktop abierto: clic fuera cierra, y el botón de cierre siempre visible. */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            id={panelId}
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <div className="pointer-events-none absolute inset-0 bg-black/25" />
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="glass absolute top-24 right-5 flex h-11 w-11 items-center justify-center rounded-full sm:right-8"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
