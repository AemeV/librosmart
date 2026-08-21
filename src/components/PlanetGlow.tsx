import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Planeta con luz de borde detrás del logo del hero. CSS puro: círculo oscuro
 * que asoma desde abajo, arco de luz fino en el borde superior y halo morado
 * difuso que se expande hacia arriba. El degradado del sitio continúa desde su
 * borde hacia abajo, así que hero y contenido quedan cosidos sin corte.
 */
export function PlanetGlow() {
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.25], reduced ? [0, 0] : [0, 90]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-1 overflow-hidden"
      style={{ height: "70%", y }}
    >
      {/* Halo difuso que sube desde el limbo */}
      <div
        className={`absolute left-1/2 h-[70%] w-[160%] -translate-x-1/2 ${
          reduced ? "" : "halo-breath"
        }`}
        style={{
          bottom: "24%",
          filter: "blur(60px)",
          backgroundImage:
            "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(178,140,255,0.55) 0%, rgba(120,72,220,0.28) 40%, transparent 75%)",
        }}
      />

      {/* Cuerpo del planeta */}
      <div
        className="absolute left-1/2 aspect-square w-[190%] -translate-x-1/2 rounded-full"
        style={{
          top: "34%",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(60,32,110,0.9) 0%, rgba(18,6,44,0.98) 28%, #0b0220 60%)",
        }}
      />

      {/* Arco especular del limbo */}
      <div
        className="absolute left-1/2 aspect-square w-[190%] -translate-x-1/2 rounded-full"
        style={{
          top: "34%",
          boxShadow:
            "0 -1px 0 0.5px rgba(255,255,255,0.95), 0 -2px 18px rgba(200,170,255,0.75), 0 -6px 60px rgba(144,91,244,0.5)",
        }}
      />
    </motion.div>
  );
}
