import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
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
 * Cuatro caras (tapa, lomo, bloque de hojas, contratapa) en 3D real, con grosor
 * derivado del número de páginas de la edición activa. Se abre como una puerta
 * sobre el canto de las hojas. Reutilizable desde la landing y desde la página
 * individual de cada libro.
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

function CoverFace({
  edition,
  book,
  alt,
}: {
  edition: Edition;
  book: Book;
  alt: string;
}) {
  const isPlaceholder = edition.coverUrl.startsWith("/covers/");
  if (isPlaceholder) {
    // TODO (David): al subir la portada real a /public/covers/ esto muestra la imagen.
    return (
      <div
        role="img"
        aria-label={alt}
        className="flex h-full w-full flex-col items-center justify-center gap-3 bg-surface-alt px-6 text-center [backface-visibility:hidden]"
      >
        <span className="display text-2xl leading-tight">{book.title}</span>
        <span className="label">Portada pendiente</span>
      </div>
    );
  }
  return (
    <img
      src={edition.coverUrl}
      alt={alt}
      loading="lazy"
      className="h-full w-full object-cover [backface-visibility:hidden]"
      draggable={false}
    />
  );
}

function ChapterList({ book, revealed }: { book: Book; revealed: boolean }) {
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
            className="flex gap-3 text-sm"
          >
            <span className="label pt-0.5">{String(chapter.number).padStart(2, "0")}</span>
            <span>
              <span className="font-medium">{tr(chapter.title)}</span>
              {chapter.summary ? (
                <span className="block text-text-muted">{tr(chapter.summary)}</span>
              ) : null}
            </span>
          </motion.li>
        ))}
      </ol>
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

  const width = featured ? 300 : 232;
  const height = Math.round(width * 1.5);
  const thickness = Math.max(18, edition.pages * 0.055);

  const angle = useSpring(0, OPEN_SPRING);
  const coverRotate = useTransform(angle, (v) => v);
  // Al pasar los 90° la tapa está de canto: ahí se apaga para no mostrar su reverso.
  const coverOpacity = useTransform(angle, [-82, -100], [1, 0]);
  const seamOpacity = useTransform(angle, [0, -90, -165], [0, 0.45, 0.12]);

  useMotionValueEvent(angle, "change", (v) => setPast90(v < -90));

  useEffect(() => {
    if (reduced) {
      setPast90(open);
      return;
    }
    angle.set(open ? -165 : 0);
  }, [open, angle, reduced]);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Escape + focus trap dentro del índice abierto.
  useEffect(() => {
    if (!open) return;
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
  }, [open, close]);

  const alt = `${t("coverAlt")} ${book.title} — ${tr(book.subtitle)}`;
  const label = open ? `${t("closeBook")} ${book.title}` : `${t("openBook")} ${book.title}`;

  const spread = (
    <>
      {/* Contratapa interior (izquierda del pliego) */}
      <Paper
        className="absolute top-0 overflow-hidden rounded-l-[10px] border border-line p-6 text-left shadow-[inset_-14px_0_24px_-18px_rgba(0,0,0,0.5)]"
        style={{
          width,
          height,
          left: -width,
          transform: `translateZ(${thickness / 2 - 4}px)`,
        }}
      >
        <p className="label">{t("backCoverTitle")}</p>
        <p className="mt-4 text-[13px] leading-relaxed">{tr(edition.backCover)}</p>
      </Paper>

      {/* Índice (derecha del pliego, sobre el bloque de hojas) */}
      <Paper
        className="absolute inset-0 overflow-hidden rounded-r-[10px] border border-line p-6 text-left"
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

      {/* Contratapa */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[10px] border border-line bg-surface-alt"
        style={{ transform: `translateZ(-${thickness / 2}px) rotateY(180deg)` }}
      />

      {/* Lomo: título en vertical */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 flex items-center justify-center overflow-hidden rounded-[3px] bg-surface-alt"
        style={{
          width: thickness,
          height,
          transform: `translateX(-${thickness / 2}px) rotateY(-90deg)`,
          boxShadow: "inset 0 0 12px rgba(0,0,0,0.35)",
        }}
      >
        <span
          className="label whitespace-nowrap"
          style={{ writingMode: "vertical-rl", fontSize: 8 }}
        >
          {book.title}
        </span>
      </div>

      {/* Bloque de hojas: eje físico de la apertura */}
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

      {/* Tapa frontal: puerta sobre el canto de las hojas */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-[4px_10px_10px_4px] border border-line bg-surface-alt"
        style={{
          transformOrigin: "left center",
          transformStyle: "flat",
          rotateY: reduced ? 0 : coverRotate,
          translateZ: thickness / 2,
          boxShadow: "6px 10px 30px -12px rgba(0,0,0,0.55)",
          backfaceVisibility: "hidden",
          opacity: reduced ? (open ? 0 : 1) : coverOpacity,
        }}
      >
        <CoverFace book={book} edition={edition} alt={alt} />
      </motion.div>
    </motion.div>
  );

  const mobileSheet = (
    <motion.div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={book.title}
      id={panelId}
      className="fixed inset-0 z-70 flex flex-col"
      initial={{ y: reduced ? 0 : "100%", opacity: reduced ? 0 : 1 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: reduced ? 0 : "100%", opacity: reduced ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      drag={reduced ? false : "y"}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.5 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 120 || info.velocity.y > 600) close();
      }}
    >
      <Paper className="flex h-full flex-col">
        {/* El canto de las hojas nunca desaparece: sostiene la metáfora. */}
        <PageEdge className="absolute inset-y-0 left-0 w-3" />
        <div className="flex items-center justify-between gap-3 border-b border-line py-4 pr-4 pl-6">
          <span className="display min-w-0 truncate text-xl">{book.title}</span>
          <button
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6 pl-7 text-left">
          <ChapterList book={book} revealed />
          <div>
            <p className="label">{t("backCoverTitle")}</p>
            <p className="mt-3 text-sm leading-relaxed">{tr(edition.backCover)}</p>
          </div>
        </div>
      </Paper>
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
        {!(open && (isMobile || reduced)) && book3d}
      </motion.button>

      <AnimatePresence>
        {open && (isMobile || reduced) && (
          <>
            <motion.div
              aria-hidden="true"
              className="fixed inset-0 z-60 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            {mobileSheet}
          </>
        )}
      </AnimatePresence>

      {/* Desktop abierto: clic fuera cierra, y el botón de cierre siempre visible. */}
      <AnimatePresence>
        {open && !isMobile && !reduced && (
          <motion.div
            ref={overlayRef}
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
