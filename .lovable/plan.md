# Escena orbital en el hero (versión clara)

El hero deja de ser un degradado plano y pasa a ser una escena en contraluz: estamos en órbita, la luz principal viene de arriba-centro y el borde de la Tierra asoma abajo. Todo con divs, CSS y motion — sin canvas, sin WebGL, sin imágenes externas.

Como el sitio está en modo claro, la escena se traduce a la paleta clara: cielo lila claro, cuerpos como siluetas violeta-oscuro suaves (siempre más oscuros que el cielo, para que lean como siluetas y no como manchas) y el filo de luz en blanco/lavanda. El logo, la pastilla "Nuevo" y el indicador "Desliza" no se tocan y quedan siempre por encima de la escena.

## Lo que se ve

1. **Grano** — capa a pantalla completa de ruido fino generado con un filtro SVG `feTurbulence` (baseFrequency 0.8, 4 octavas), opacidad 0.035, mezclado en `overlay`. Es lo que quita el banding y la sensación sintética del degradado.
2. **Viñeta** — degradado radial: transparente al centro, violeta profundo translúcido en las esquinas. Concentra la mirada.
3. **Polvo estelar** — 50 puntos de 1px en desktop, 25 en móvil, distribución irregular, opacidades 0.15–0.5, titilando con periodos distintos de 3 a 7 s. En claro los puntos van en lavanda/violeta suave para que se perciban sin ensuciar.
4. **Borde de la Tierra** — círculo de 2.5× el ancho del viewport, centrado y bajado para que solo asome un 25% de su altura, con el arco atmosférico encima del filo: intenso y estrecho en el borde, desvaneciéndose ampliamente hacia arriba. Pulsa un 10% en ciclos de 8 s.
5. **Cuatro cuerpos en contraluz** — Sol arriba ligeramente descentrado (único elemento cálido, disco pequeño con resplandor), Luna grande arriba a la izquierda saliendo del encuadre, Marte pequeño a la derecha a media altura con filo rojizo, Júpiter mediano abajo a la derecha y muy tenue. Siluetas puras, sin textura.
6. **Movimiento** — nadie rota sobre su eje. Cada cuerpo deriva en una elipse muy amplia con fases y recorridos distintos (Luna 60px/90s, Marte 40px/70s, Júpiter 25px/120s, Sol 8px/100s), en `mirror` infinito. Al hacer scroll suben con paralaje distinto según cercanía aparente. En desktop siguen el cursor hasta 10px con spring suave.
7. **Reduced motion** — escena completamente estática: se conservan grano, viñeta y contraluz; se apagan deriva, paralaje y pulso.

## Detalles técnicos

- **Nuevo componente** `src/components/OrbitScene.tsx`: contiene grano, viñeta, polvo, el borde de la Tierra y los cuatro cuerpos. Se monta dentro de `Hero.tsx` en lugar de `PlanetGlow`, en una capa absoluta con `-z-1` y `pointer-events-none`; los bloques de contenido del hero ya viven en `z-1`, así que quedan por encima.
- **Grano**: `background-image: url("data:image/svg+xml,…")` con `<filter><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4"/><feColorMatrix type="saturate" values="0"/></filter>` — data URI inline, no archivo de imagen. Se añade como `@utility grain-overlay` en `src/styles.css`.
- **Cuerpos**: cada uno es un div redondo con fondo `rgba` violeta-oscuro por debajo de la luminosidad del cielo claro en ese punto, `box-shadow inset` desplazado hacia arriba-centro (el signo de cada eje depende de la posición del cuerpo) para el filo de luz, más halo exterior tenue. Marte usa `rgba(224,138,92,0.7)` en su filo.
- **Deriva y paralaje**: `useScroll` + `useTransform` para el eje Y de scroll y `useMotionValue` + `useSpring` (stiffness 40, damping 20) para el cursor; la deriva usa `animate` con `repeat: Infinity, repeatType: "mirror", ease: "easeInOut"`. Todo son motion values puros — cero `useState` y cero re-renders por frame. El listener de mouse se registra solo en desktop (`matchMedia` con `pointer: fine`).
- **Rendimiento**: solo `transform` y `opacity` animados; `will-change: transform` únicamente en los cuatro cuerpos. Polvo y pulso del arco por keyframes CSS en `src/styles.css`, respetando el bloque `prefers-reduced-motion` existente.
- **Pulso del arco**: keyframe CSS que varía `opacity` un 10% en 8 s sobre una capa duplicada del arco, sin tocar `box-shadow` animado.
- `PlanetGlow.tsx` queda sin uso; se elimina para no dejar dos planetas compitiendo.
- Contraste: la banda más clara del arco se mantiene por debajo del blanco puro y detrás del logo se baja opacidad de cualquier cuerpo que compita, verificando AA sobre los textos del hero.

## Fuera de alcance

No se toca la paleta del sitio, el logo metalizado, la pastilla "Nuevo", el header ni ninguna sección debajo del hero.
