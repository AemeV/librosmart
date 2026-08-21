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

const headerOffset = () =>
  parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--header-height") || "104",
    10,
  ) || 104;

/** Destino: centro del bloque alineado con el centro de la ventana. */
function targetY(): number | null {
  const block = document.querySelector<HTMLElement>("[data-magnet-block]");
  if (block) {
    const rect = block.getBoundingClientRect();
    const tall = rect.height > window.innerHeight - headerOffset() - 24;
    const y = tall
      ? rect.top + window.scrollY - headerOffset() - 24
      : rect.top + window.scrollY - (window.innerHeight - rect.height) / 2;
    return Math.min(Math.max(y, 0), maxScroll());
  }
  // Fallback: ancla del libro con offset de header.
  const anchor = document.querySelector<HTMLElement>("#libros [id^='book-']");
  if (!anchor) return null;
  const y = anchor.getBoundingClientRect().top + window.scrollY - headerOffset() - 24;
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

  const run = () => {
    const initial = targetY();
    if (initial === null) return false;
    if (reduced) {
      window.scrollTo({ top: initial, behavior: "auto" });
      return true;
    }

    const from = window.scrollY;
    let to = initial;
    const start = performance.now();
    animating = true;

    const step = (now: number) => {
      if (!animating) return;
      const p = Math.min(1, (now - start) / DURATION);
      // Recalcular destino: las animaciones de entrada mueven el bloque.
      const fresh = targetY();
      if (fresh !== null) to += (fresh - to) * 0.25;
      window.scrollTo({ top: from + (to - from) * easeOutQuint(p), behavior: "auto" });
      if (p < 1) {
        frame = requestAnimationFrame(step);
      } else {
        stop();
      }
    };
    frame = requestAnimationFrame(step);
    return true;
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
