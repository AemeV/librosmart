import { useEffect, useRef, useState } from "react";
import { computeSky, planetNames, rgb, type City, type SkyState } from "@/lib/sky";

export type PlanetHit = { id: string; name: string; x: number; y: number; alt: number; az: number };

const RECOMPUTE_MS = 60_000;
const FRAME_MS = 1000 / 30;

/** Color característico de cada planeta: es lo que los distingue de una estrella. */
const PLANET_COLORS: Record<string, string> = {
  mercury: "#C9C2B8",
  venus: "#FFF4D6",
  mars: "#E08A5C",
  jupiter: "#F2E2C0",
  saturn: "#E6D9A8",
};

type Projected = { x: number; y: number };

function project(alt: number, az: number, cx: number, cy: number, radius: number): Projected {
  const r = ((90 - alt) / 90) * radius;
  const a = (az * Math.PI) / 180;
  return { x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) };
}

function starRadius(mag: number) {
  return Math.max(0.5, 1.9 - mag * 0.34);
}

function starAlpha(mag: number) {
  return Math.max(0.16, Math.min(1, (4.2 - mag) / 4.2));
}

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace("#", "");
  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ];
}

/**
 * Una capa de cielo para una ciudad. Recalcula posiciones cada 60s;
 * entre recálculos sólo anima el parpadeo de estrellas a 30fps.
 * El parpadeo es EXCLUSIVO de las estrellas: los planetas tienen luz fija,
 * y por eso se distinguen a simple vista.
 */
export function SkyLayer({
  city,
  visible,
  starLimit,
  reduced,
  lang,
  mobile,
  onState,
  onHits,
}: {
  city: City;
  visible: boolean;
  starLimit: number;
  reduced: boolean;
  lang: "es" | "en";
  mobile: boolean;
  onState?: (state: SkyState) => void;
  onHits?: (hits: PlanetHit[]) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [fallbackPalette, setFallbackPalette] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setFailed(true);
      return;
    }

    let state = computeSky(city, new Date(), starLimit);
    onState?.(state);
    setFallbackPalette(
      `linear-gradient(180deg, ${rgb(state.palette.top)} 0%, ${rgb(state.palette.mid)} 55%, ${rgb(
        state.palette.bottom,
      )} 100%)`,
    );

    let width = 0;
    let height = 0;
    let dpr = 1;
    let phases = state.stars.map((_, i) => i * 1.7);
    let raf = 0;
    let lastFrame = 0;
    let lastCompute = performance.now();
    let inView = true;
    let running = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const cx = width / 2;
      const cy = height * 0.62;
      const radius = Math.hypot(width, height) * 0.62;
      const p = state.palette;

      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, rgb(p.top));
      grad.addColorStop(0.55, rgb(p.mid));
      grad.addColorStop(1, rgb(p.bottom));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // estrellas: las únicas que titilan
      if (p.starOpacity > 0.01) {
        state.stars.forEach((star, i) => {
          const { x, y } = project(star.alt, star.az, cx, cy, radius);
          if (x < -8 || x > width + 8 || y < -8 || y > height + 8) return;
          const twinkle = reduced ? 0 : Math.sin(time / 700 + phases[i]!) * 0.15;
          const alpha = Math.max(0, Math.min(1, (starAlpha(star.mag) + twinkle) * p.starOpacity));
          const r = starRadius(star.mag);
          if (r > 1.2) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(226,236,255,${alpha * 0.18})`;
            ctx.arc(x, y, r * 2.6, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.beginPath();
          ctx.fillStyle = `rgba(244,248,255,${alpha})`;
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // línea de horizonte: referencia espacial en el borde del domo
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,255,255,${0.1 + (1 - p.brightness) * 0.08})`;
      ctx.lineWidth = 1;
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // sol, con halo amplio y luminoso
      if (state.sunAlt > -3) {
        const { x, y } = project(state.sunAlt, state.sunAz, cx, cy, radius);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 260);
        glow.addColorStop(0, "rgba(255,248,222,0.98)");
        glow.addColorStop(0.08, "rgba(255,240,196,0.7)");
        glow.addColorStop(0.28, "rgba(255,226,160,0.32)");
        glow.addColorStop(1, "rgba(255,214,140,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 260, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,253,242,0.99)";
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // luna: claramente más grande que todo lo demás, con su fase real
      const hits: PlanetHit[] = [];
      if (state.moon.alt > 0) {
        const { x, y } = project(state.moon.alt, state.moon.az, cx, cy, radius);
        const r = 28;
        const dim = Math.max(0.28, 1 - p.brightness * 0.75);
        ctx.save();
        const halo = ctx.createRadialGradient(x, y, r, x, y, r * 4.5);
        halo.addColorStop(0, `rgba(235,240,255,${0.18 * dim})`);
        halo.addColorStop(1, "rgba(235,240,255,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, r * 4.5, 0, Math.PI * 2);
        ctx.fill();

        // disco apagado
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150,158,182,${0.16 * dim})`;
        ctx.fill();

        // parte iluminada: círculo + terminador elíptico
        const f = Math.max(0, Math.min(1, state.moon.fraction));
        const waxing = state.moon.waxing;
        ctx.beginPath();
        const start = waxing ? -Math.PI / 2 : Math.PI / 2;
        ctx.arc(x, y, r, start, start + Math.PI, false);
        const termWidth = Math.abs(1 - 2 * f) * r;
        const sweep = f > 0.5 ? !waxing : waxing;
        ctx.ellipse(x, y, termWidth, r, 0, start + Math.PI, start, sweep);
        ctx.closePath();
        ctx.fillStyle = `rgba(248,246,236,${0.95 * dim + 0.05})`;
        ctx.fill();
        ctx.restore();

        hits.push({ id: "moon", name: "Luna", x, y, alt: state.moon.alt, az: state.moon.az });
      }

      // planetas: luz fija (no titilan), mayores que las estrellas, con color propio
      for (const planet of state.planets) {
        const { x, y } = project(planet.alt, planet.az, cx, cy, radius);
        const color = PLANET_COLORS[planet.id] ?? "#FFF4D6";
        const [cr, cg, cb] = hexToRgb(color);
        const r = Math.max(3.2, 6.4 - planet.mag * 0.7);
        const alpha = Math.max(0.45, Math.min(1, 1 - p.brightness * 0.75));

        const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 7);
        glow.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha * 0.42})`);
        glow.addColorStop(0.4, `rgba(${cr},${cg},${cb},${alpha * 0.14})`);
        glow.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, r * 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // etiqueta permanente: siempre en desktop, en móvil sólo por encima de 15°
        if (!mobile || planet.alt > 15) {
          const name = (planetNames[planet.id]?.[lang] ?? planet.name).toUpperCase();
          ctx.save();
          ctx.font = "500 9px 'Inter Tight', system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.shadowColor = "rgba(0,0,0,0.65)";
          ctx.shadowBlur = 4;
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${Math.min(1, alpha + 0.15)})`;
          ctx.fillText(name, x, y + r + 6);
          ctx.restore();
        }

        hits.push({ id: planet.id, name: planet.name, x, y, alt: planet.alt, az: planet.az });
      }

      onHits?.(hits);
    };

    const loop = (time: number) => {
      raf = 0;
      if (!inView) {
        running = false;
        return;
      }
      if (time - lastCompute >= RECOMPUTE_MS) {
        lastCompute = time;
        state = computeSky(city, new Date(), starLimit);
        phases = state.stars.map((_, i) => i * 1.7);
        onState?.(state);
      }
      if (time - lastFrame >= FRAME_MS) {
        lastFrame = time;
        draw(time);
      }
      if (reduced) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || raf) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    try {
      resize();
      draw(performance.now());
      if (!reduced) start();
    } catch (error) {
      console.error(error);
      setFailed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        if (inView && !reduced) start();
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    resizeObserver.observe(canvas);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city.id, starLimit, reduced, lang, mobile]);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 transition-opacity duration-[800ms] ease-out"
      style={{
        opacity: visible ? 1 : 0,
        ...(failed && fallbackPalette ? { background: fallbackPalette } : {}),
      }}
    >
      {!failed && <canvas ref={canvasRef} className="h-full w-full" />}
    </div>
  );
}
