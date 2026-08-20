import { useMotionValue, useReducedMotion, useSpring, type MotionValue } from "motion/react";
import { createContext, useContext, useEffect, type ReactNode } from "react";

/**
 * Ángulo del degradado metalizado del logo. Es la ÚNICA excepción a la regla
 * de "sin degradados" del sistema: simula el reflejo de un metal pulido.
 * En desktop el ángulo responde a la posición horizontal del cursor sobre el
 * header; en mobile, al progreso de scroll de la página. Suavizado con spring
 * {120, 20} para que se sienta como un reflejo deslizándose.
 */
const REST_ANGLE = -12;
const MAX_ANGLE = 25;

const LogoMetalContext = createContext<MotionValue<number> | null>(null);

export function LogoMetalProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const angle = useSpring(REST_ANGLE, { stiffness: 120, damping: 20 });

  useEffect(() => {
    if (reduced) {
      angle.jump(REST_ANGLE);
      return;
    }
    const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (hasHover) {
      const onMove = (event: PointerEvent) => {
        const headerHeight =
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--header-height"),
          ) || 104;
        if (event.clientY > headerHeight) return;
        const ratio = event.clientX / Math.max(1, window.innerWidth);
        angle.set((ratio * 2 - 1) * MAX_ANGLE);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    }

    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / max));
      angle.set((ratio * 2 - 1) * MAX_ANGLE);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [angle, reduced]);

  return <LogoMetalContext.Provider value={angle}>{children}</LogoMetalContext.Provider>;
}

/** Ángulo compartido; si no hay provider devuelve un ángulo fijo agradable. */
export function useLogoMetalAngle(): MotionValue<number> {
  const shared = useContext(LogoMetalContext);
  const fallback = useMotionValue(REST_ANGLE);
  return shared ?? fallback;
}
