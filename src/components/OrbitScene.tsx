import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useMemo, useRef } from "react";

/**
 * Escena orbital del hero: estamos en órbita sobre la Tierra mirando al espacio,
 * con la luz principal arriba al centro. Todo con divs, CSS y motion — sin
 * canvas, sin WebGL y sin imágenes externas.
 *
 * Traducción a la paleta clara del sitio: el cielo es lila claro, así que los
 * cuerpos son siluetas violeta profundo (siempre MÁS OSCURAS que el cielo) y el
 * filo de luz va en blanco/lavanda. Cada filo apunta hacia el centro-superior.
 */

/** Ruido monocromático fino generado con feTurbulence (data URI, no imagen). */
const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="220" height="220" filter="url(#n)"/></svg>`,
);

type Body = {
  id: string;
  /** Posición dentro de la escena, en %. */
  left: string;
  top: string;
  /** Diámetro relativo al ancho del viewport. */
  size: string;
  background: string;
  /** Filo de luz + halo exterior. */
  boxShadow: string;
  /** Deriva elíptica: recorrido en px y duración en segundos. */
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
  /** Cercanía aparente: multiplicadores de paralaje. */
  scrollFactor: number;
  cursorFactor: number;
  opacity: number;
};

const BODIES: Body[] = [
  {
    // Luna: grande, arriba a la izquierda, saliendo del encuadre.
    id: "luna",
    left: "-6%",
    top: "6%",
    size: "34vw",
    background: "radial-gradient(circle at 62% 22%, #2A1550 0%, #1A0A3C 60%, #14082F 100%)",
    boxShadow:
      "inset 8px -8px 16px -8px rgba(255,255,255,0.85), inset 4px -4px 26px -10px rgba(190,170,255,0.6), 0 0 60px rgba(144,91,244,0.12)",
    driftX: 60,
    driftY: -34,
    duration: 90,
    delay: 0,
    scrollFactor: 1,
    cursorFactor: 1,
    opacity: 0.5,
  },
  {
    // Marte: pequeño, a la derecha, a media altura. Filo rojizo.
    id: "marte",
    left: "84%",
    top: "38%",
    size: "7vw",
    background: "radial-gradient(circle at 35% 25%, #2B1246 0%, #1A0A38 70%, #15082E 100%)",
    boxShadow:
      "inset -5px -5px 11px -5px rgba(224,138,92,0.7), 0 0 60px rgba(144,91,244,0.1)",
    driftX: -40,
    driftY: 24,
    duration: 70,
    delay: -18,
    scrollFactor: 0.55,
    cursorFactor: 0.6,
    opacity: 0.55,
  },
  {
    // Júpiter: mediano, abajo a la derecha, muy tenue y más lejano.
    id: "jupiter",
    left: "68%",
    top: "70%",
    size: "16vw",
    background: "radial-gradient(circle at 40% 22%, #291247 0%, #1B0B3A 65%, #160830 100%)",
    boxShadow:
      "inset -6px -6px 14px -7px rgba(190,170,255,0.55), 0 0 60px rgba(144,91,244,0.08)",
    driftX: 25,
    driftY: -16,
    duration: 120,
    delay: -40,
    scrollFactor: 0.2,
    cursorFactor: 0.25,
    opacity: 0.3,
  },
];

/** Puntos de polvo estelar: irregulares y deterministas (sin Math.random en render). */
function useDust(count: number) {
  return useMemo(() => {
    let seed = 20260821;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(rand() * 100).toFixed(2)}%`,
      top: `${(rand() * 92).toFixed(2)}%`,
      opacity: 0.15 + rand() * 0.35,
      duration: 3 + rand() * 4,
      delay: -(rand() * 7),
    }));
  }, [count]);
}

function OrbitBody({
  body,
  scrollY,
  cursorX,
  cursorY,
  reduced,
}: {
  body: Body;
  scrollY: MotionValue<number>;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  reduced: boolean;
}) {
  const y = useTransform(scrollY, (v) => v * body.scrollFactor);
  const px = useTransform(cursorX, (v) => v * body.cursorFactor);
  const py = useTransform(cursorY, (v) => v * body.cursorFactor);

  return (
    <motion.div
      className="absolute"
      style={{ left: body.left, top: body.top, y, x: px, translateZ: 0 }}
    >
      <motion.div style={{ y: py }}>
        <motion.div
          animate={reduced ? undefined : { x: [0, body.driftX], y: [0, body.driftY] }}
          transition={
            reduced
              ? undefined
              : {
                  duration: body.duration,
                  delay: body.delay,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
          className="rounded-full"
          style={{
            width: body.size,
            height: body.size,
            background: body.background,
            boxShadow: body.boxShadow,
            opacity: body.opacity,
            willChange: "transform",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export function OrbitScene() {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Paralaje de scroll: base en px, cada cuerpo lo escala por su cercanía.
  const scrollBase = useTransform(scrollYProgress, [0, 0.3], reduced ? [0, 0] : [0, -140]);

  // Paralaje de cursor (solo desktop): hasta 10px, spring suave.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const cursorX = useSpring(rawX, { stiffness: 40, damping: 20 });
  const cursorY = useSpring(rawY, { stiffness: 40, damping: 20 });

  const dustCount = typeof window !== "undefined" && window.innerWidth < 640 ? 25 : 50;
  const dust = useDust(dustCount);

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (event: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set(((event.clientX - rect.left) / rect.width - 0.5) * 20);
      rawY.set(((event.clientY - rect.top) / rect.height - 0.5) * 20);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY, reduced]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-1 overflow-hidden"
    >
      {/* Cuerpos en contraluz */}
      {BODIES.map((body) => (
        <OrbitBody
          key={body.id}
          body={body}
          scrollY={scrollBase}
          cursorX={cursorX}
          cursorY={cursorY}
          reduced={reduced}
        />
      ))}

      {/* Sol: la fuente de luz. Arriba, ligeramente descentrado. Único cálido. */}
      <motion.div
        className="absolute"
        style={{ left: "56%", top: "9%", y: useTransform(scrollBase, (v) => v * 0.12) }}
      >
        <motion.div
          animate={reduced ? undefined : { x: [0, 8], y: [0, -6] }}
          transition={
            reduced
              ? undefined
              : {
                  duration: 100,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
          className="h-3 w-3 rounded-full"
          style={{
            background: "#FFF4E0",
            boxShadow:
              "0 0 12px rgba(255,244,224,0.95), 0 0 90px rgba(255,214,150,0.55), 0 0 140px rgba(255,196,120,0.22)",
            willChange: "transform",
          }}
        />
      </motion.div>

      {/* Polvo estelar */}
      {dust.map((point) => (
        <span
          key={point.id}
          className={`absolute h-px w-px rounded-full ${reduced ? "" : "dust-twinkle"}`}
          style={{
            left: point.left,
            top: point.top,
            backgroundColor: "rgba(78,43,204,0.9)",
            opacity: point.opacity,
            boxShadow: "0 0 2px rgba(144,91,244,0.7)",
            animationDuration: `${point.duration.toFixed(2)}s`,
            animationDelay: `${point.delay.toFixed(2)}s`,
          }}
        />
      ))}

      {/* Borde de la Tierra: 2.5x el ancho del viewport, asomando un 25%. */}
      <div className="absolute inset-x-0 bottom-0 h-[46%] overflow-hidden">
        <div
          className="absolute left-1/2 aspect-square w-[250vw] -translate-x-1/2 rounded-full"
          style={{
            top: "75%",
            background:
              "radial-gradient(circle at 50% 0%, #1B0A3F 0%, #120428 45%, #0A0118 100%)",
            boxShadow:
              "0 -2px 4px rgba(200,180,255,0.55), 0 -12px 40px rgba(144,91,244,0.35), 0 -40px 120px rgba(78,43,204,0.22)",
          }}
        />
        {/* Capa duplicada del arco: solo pulsa su opacidad (nunca box-shadow). */}
        <div
          className={`absolute left-1/2 aspect-square w-[250vw] -translate-x-1/2 rounded-full ${
            reduced ? "" : "arc-breath"
          }`}
          style={{
            top: "75%",
            boxShadow:
              "0 -2px 4px rgba(200,180,255,0.4), 0 -12px 40px rgba(144,91,244,0.28), 0 -40px 120px rgba(78,43,204,0.16)",
            opacity: 0.1,
          }}
        />
      </div>

      {/* Viñeta */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 70% at 50% 45%, rgba(15,3,45,0) 40%, rgba(15,3,45,0.24) 75%, rgba(15,3,45,0.45) 100%)",
        }}
      />

      {/* Grano: feTurbulence inline, corrige el banding del degradado. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")`,
          backgroundSize: "220px 220px",
          opacity: 0.035,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
