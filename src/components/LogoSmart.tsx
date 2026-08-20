import { motion, useMotionValueEvent, useReducedMotion } from "motion/react";
import { useId, useRef } from "react";
import { useLogoMetalAngle } from "@/context/LogoMetalContext";

/**
 * Logotipo Sm@rt con acabado metalizado: un degradado de marca enmascarado al
 * trazo del logo (Seashell → Lavender Indigo → Purple Heart → Seashell, con las
 * paradas apretadas en el centro) cuyo ángulo responde al movimiento, más un
 * brillo especular que lo recorre en bucle. Es la única excepción a la
 * prohibición de degradados del sistema.
 *
 * `plain` devuelve el logo en currentColor, para casos donde el metal no cabe.
 */
const PATHS = [
  "M235.72.13h-34.11c-.69,0-1.26.5-1.26,1.2v7.36c0,.69.57,1.26,1.26,1.26h12.27v42.73c0,.82.57,1.51,1.2,1.51h7.43c.63,0,1.2-.69,1.2-1.51V9.94h12.02c.82,0,1.51-.57,1.51-1.26V1.32c0-.69-.69-1.2-1.51-1.2Z",
  "M195.64,16.17c0-4.34-2.01-8.49-5.48-11.39-3.52-3.02-8.49-4.59-14.22-4.59h-18.38c-.69,0-1.26.57-1.26,1.2v4.97l.63,1.13v.06l8.37,14.73h-9v30.71c0,.69.57,1.26,1.26,1.26h7.36c.63,0,1.2-.57,1.2-1.26v-20.89h4.72l1.32,2.39,10.76,19,.13.19c.19.32.57.57,1.01.57h8.43c.69,0,1.2-.57,1.2-1.32,0-.19,0-.38-.13-.57l-.06-.13-10.01-17.75-1.38-2.39-.32-.57c9.12-2.01,13.84-8.75,13.84-15.35ZM178.4,22.15c-.57.06-1.2.13-1.82.13l-1.32-2.33-5.6-9.94h6.29c6.8,0,9.82,3.21,9.82,6.17,0,2.52-2.27,5.29-7.36,5.98Z",
  "M146.87,46.57h-26.3c-11.08,0-19.76-8.43-19.76-19.19s8.87-19.76,19.76-19.76c11.96,0,19.76,7.8,19.76,19.76v.06c0,.19,0,1.89-.5,3.59-.19.63-.88,2.01-3.21,2.01-1.45,0-2.83-.06-4.09-.19V15.61c0-.69-.57-1.32-1.26-1.38h-5.1c-.69.06-1.26.69-1.26,1.38v.69c-1.64-.75-3.4-1.2-5.22-1.2-6.8,0-12.27,5.54-12.27,12.27s5.47,12.27,12.27,12.27c1.82,0,3.59-.38,5.22-1.13v1.07l3.21.44c.19.06,4.28.63,8.49.63,6.17,0,9.5-4.03,10.51-7.49.82-2.58.82-5.03.82-5.79,0-8.31-2.83-15.29-8.12-20.26-4.91-4.59-11.77-7.11-19.26-7.11-15.1,0-27.44,12.27-27.44,27.37,0,7.36,2.9,14.1,8.12,19.13,5.1,4.97,11.96,7.68,19.32,7.68h26.24c.76,0,1.32-.57,1.32-1.38v-4.85c0-.75-.57-1.32-1.26-1.38ZM124.91,29.95c-.94,1.95-2.96,3.27-5.22,3.27-3.21,0-5.85-2.64-5.85-5.85s2.64-5.79,5.85-5.79c2.26,0,4.28,1.32,5.22,3.27.38.76.57,1.64.57,2.52,0,.94-.19,1.82-.57,2.58Z",
  "M43.8.19v52.8c0,.69.57,1.26,1.2,1.26h7.3c.69,0,1.2-.57,1.2-1.26v-29.45l10.89,10.89,10.89-10.89v29.45c0,.69.57,1.26,1.26,1.26h7.24c.69,0,1.2-.57,1.2-1.26V.19l-20.58,20.58L43.8.19Z",
  "M27.06,23.98c-4.15-1.7-8.18-1.76-8.62-1.76,0,0-2.52-.06-4.91-1.01-3.27-1.32-3.71-3.33-3.71-5.1,0,0,.13-2.45,1.82-4.15,1.45-1.45,3.71-2.14,6.8-2.14,4.78,0,6.48,2.08,7.36,3.65.63,1.26.94,2.52,1.13,3.4v.19c.13.5.57.94,1.07,1.01h7.61c.69,0,1.2-.57,1.2-1.32v-.13c-.25-2.52-1.26-7.61-5.22-11.64C27.5.82,22.15,0,18.44,0,12.65,0,7.99,1.7,4.72,5.03.13,9.63,0,15.48,0,16.11c0,6.61,3.46,11.64,9.82,14.22,4.15,1.64,8.18,1.7,8.62,1.7,0,0,2.52.06,4.91,1.07,3.27,1.32,3.71,3.4,3.71,5.16,0,0-.13,1.57-1.01,3.02-1.32,2.14-3.78,3.21-7.61,3.21-3.59,0-6.04-1.13-7.36-3.34-.63-.94-.94-2.01-1.07-2.77,0-.06-.06-.13-.06-.19v-.06c-.13-.5-.5-.82-1.01-.88H1.2c-.63.06-1.13.63-1.13,1.26,0,.13.06.25.06.38.19,1.64.75,4.22,2.2,6.86,3.08,5.48,8.81,8.56,16.11,8.56,9.25,0,13.78-4.28,15.98-7.93,2.39-3.84,2.45-7.61,2.45-8.05,0-6.61-3.46-11.7-9.82-14.35Z",
];

const VIEW_W = 237.23;
const VIEW_H = 54.31;

export function LogoSmart({ className, plain = false }: { className?: string; plain?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const angle = useLogoMetalAngle();
  const reduced = useReducedMotion();
  const gradRef = useRef<SVGLinearGradientElement>(null);

  useMotionValueEvent(angle, "change", (value) => {
    gradRef.current?.setAttribute("gradientTransform", `rotate(${value} 0.5 0.5)`);
  });

  if (plain) {
    return (
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label="Sm@rt"
        className={className}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {PATHS.map((d) => (
          <path key={d.slice(0, 12)} d={d} />
        ))}
      </svg>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label="Sm@rt"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          ref={gradRef}
          id={`metal-${uid}`}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="objectBoundingBox"
          gradientTransform={`rotate(${angle.get()} 0.5 0.5)`}
        >
          <stop offset="0" stopColor="#EFEFEF" />
          <stop offset="0.4" stopColor="#905BF4" />
          <stop offset="0.5" stopColor="#4E2BCC" />
          <stop offset="0.6" stopColor="#905BF4" />
          <stop offset="1" stopColor="#EFEFEF" />
        </linearGradient>

        <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        <mask id={`stroke-${uid}`} maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="black" />
          {PATHS.map((d) => (
            <path key={d.slice(0, 12)} d={d} fill="white" />
          ))}
        </mask>
      </defs>

      <g mask={`url(#stroke-${uid})`}>
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill={`url(#metal-${uid})`} />
        {!reduced && (
          <motion.rect
            y="0"
            width={VIEW_W * 0.22}
            height={VIEW_H}
            fill={`url(#sheen-${uid})`}
            initial={{ x: -VIEW_W * 0.25 }}
            animate={{ x: VIEW_W }}
            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
          />
        )}
      </g>
    </svg>
  );
}
