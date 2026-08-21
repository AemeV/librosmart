/**
 * Primer scroll imantado del hero a la primera portada.
 *
 * Al primer gesto de scroll hacia abajo (rueda, arrastre táctil o teclado)
 * desde el tope de la landing, la página viaja sola hasta dejar el bloque
 * marcado con `data-magnet-block` (portada + etiqueta + título) centrado
 * verticalmente en la ventana, con una animación propia y suave.
 */

const DURATION = 1100;

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

const maxScroll = () =>
  Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

/** Alto ocupado arriba por elementos fijos: header + menú flotante. */
const topChrome = () => {
  const header =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--header-height") || "104",
      10,
    ) || 104;
  const nav = document.querySelector<HTMLElement>("[data-floating-nav]");
  if (!nav) return header;
  const rect = nav.getBoundingClientRect();
  return Math.max(header, rect.bottom);
};

/**
 * Posición del elemento en el documento sin contar transformaciones (parallax,
 * animaciones de entrada). Así el destino es estable y no se persigue a sí mismo.
 */
function layoutTop(el: HTMLElement): number {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

/** Destino: centro del bloque alineado con el centro del área útil. */
function targetY(): number | null {
  // El bloque puede marcarse con uno o dos nodos (inicio y fin); se centra la
  // unión: portada … título.
  const parts = Array.from(document.querySelectorAll<HTMLElement>("[data-magnet-block]"));
  if (parts.length > 0) {
    const tops = parts.map((el) => layoutTop(el));
    const top = Math.min(...tops);
    const bottom = Math.max(...parts.map((el, i) => tops[i]! + el.offsetHeight));
    const height = bottom - top;
    // Se centra dentro del área útil (debajo del header y del menú flotante);
    // si el bloque no cabe, se alinea justo debajo de ellos.
    const header = topChrome() + 12;
    const available = window.innerHeight - header;
    const slack = Math.max(0, available - height);
    const y = top - header - slack / 2;
    return Math.min(Math.max(y, 0), maxScroll());
  }
  // Fallback: ancla del libro con offset de header.
  const anchor = document.querySelector<HTMLElement>("#libros [id^='book-']");
  if (!anchor) return null;
  const y = layoutTop(anchor) - topChrome() - 24;
  return Math.min(Math.max(y, 0), maxScroll());
}

export function initMagneticFirstScroll(): () => void {
  if (typeof window === "undefined") return () => {};

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let done = false;
  let animating = false;
  let frame = 0;
  let touchStartY = 0;

  const stop = () => {
    animating = false;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };

  /** Un tramo de animación con easing; al terminar corrige el resto. */
  const glide = (duration: number, pass: number) => {
    const initial = targetY();
    if (initial === null) return false;
    const from = window.scrollY;
    let to = initial;
    if (Math.abs(to - from) < 2) return true;
    const start = performance.now();
    animating = true;

    const step = (now: number) => {
      if (!animating) return;
      const p = Math.min(1, (now - start) / duration);
      // Recalcular destino: el parallax y las animaciones de entrada mueven el
      // bloque mientras viajamos.
      const fresh = targetY();
      if (fresh !== null) to += (fresh - to) * (0.15 + 0.5 * p);
      // `instant` es obligatorio: el CSS del sitio usa scroll-behavior: smooth y
      // "auto" heredaría esa animación, peleando con nuestra curva.
      window.scrollTo({ top: from + (to - from) * easeOutQuint(p), behavior: "instant" });
      if (p < 1) {
        frame = requestAnimationFrame(step);
        return;
      }
      stop();
      // Ajuste fino: si el bloque terminó desplazado, se corrige suavemente.
      if (pass < 2) {
        const fix = targetY();
        if (fix !== null && Math.abs(fix - window.scrollY) > 4) glide(360, pass + 1);
      }
    };
    frame = requestAnimationFrame(step);
    return true;
  };

  const run = () => {
    if (reduced) {
      const initial = targetY();
      if (initial === null) return false;
      window.scrollTo({ top: initial, behavior: "instant" });
      return true;
    }
    return glide(DURATION, 0);
  };

  const trigger = (event: Event) => {
    if (animating) {
      // Segundo gesto del usuario: devolverle el control.
      stop();
      done = true;
      return;
    }
    if (done) return;
    if (window.scrollY > 40) {
      done = true;
      return;
    }
    if (event.cancelable) event.preventDefault();
    done = run() || done;
  };

  const onWheel = (event: WheelEvent) => {
    if (event.deltaY <= 0) return;
    trigger(event);
  };
  const onTouchStart = (event: TouchEvent) => {
    touchStartY = event.touches[0]?.clientY ?? 0;
    if (animating) trigger(event);
  };
  const onTouchMove = (event: TouchEvent) => {
    const y = event.touches[0]?.clientY ?? 0;
    if (touchStartY - y < 12) return;
    trigger(event);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (["ArrowDown", "PageDown", " ", "Spacebar", "End"].includes(event.key)) trigger(event);
    else if (animating) {
      stop();
      done = true;
    }
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("keydown", onKeyDown);

  return () => {
    stop();
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("keydown", onKeyDown);
  };
}
