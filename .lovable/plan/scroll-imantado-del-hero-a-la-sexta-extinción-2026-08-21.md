# Scroll imantado del Hero a "La Sexta Extinción"

Al primer scroll desde el banner principal, la página debe deslizarse sola —con una transición suave y moderna— hasta que la portada y el título del primer libro queden centrados vertical y horizontalmente en pantalla.

## Qué cambia

1. **Bloque a centrar**: en la ficha del libro se agrupan portada + etiqueta "NUEVO LIBRO" + título en un contenedor marcado (`data-magnet-block`). Eso es lo que se centra, no la sección completa (que es muy alta y hoy queda descuadrada).
2. **Centrado real**: en vez de alinear con el header, el destino se calcula para que el centro del bloque coincida con el centro de la ventana. Si el bloque es más alto que la pantalla, se alinea justo debajo del header.
3. **Animación propia y suave**: se reemplaza `window.scrollTo({ behavior: "smooth" })` (rápido y desigual según navegador) por una animación de ~1.1 s con curva de salida suave, recalculando el destino en cada fotograma para que las animaciones de entrada de la sección no dejen el bloque descuadrado.
4. **Robustez del gesto**: el imán actúa una sola vez, sólo si la página está arriba y el gesto es hacia abajo; se cancela si el usuario vuelve a hacer scroll, arrastra, toca teclas o usa la navegación superior. Con "reducir movimiento" activo, salto directo sin animación.

## Detalle técnico

- `src/components/BookEntry.tsx`: envolver portada, etiqueta y `<h3>` del título en un `div` con `data-magnet-block` (sólo estructura, sin cambios visuales).
- `src/routes/_site.index.tsx` (`useMagneticFirstScroll`): mover la lógica a `src/lib/magnetic-scroll.ts`.
  - Destino: `blockRect.top + scrollY - (innerHeight - blockRect.height) / 2`, acotado a `[0, scrollMaxY]`.
  - Animación con `requestAnimationFrame` + easing `easeOutQuint`, duración 1100 ms, recálculo del destino en cada frame (lerp hacia el nuevo valor) y cancelación por `wheel`/`touchstart`/`keydown` del usuario durante el vuelo.
  - Disparadores: `wheel` (deltaY > 0), `touchmove` (delta > 12 px) y `keydown` en flechas/espacio/PageDown; se hace `preventDefault` sólo en el frame del disparo.
  - Fallback si no existe `[data-magnet-block]`: comportamiento actual (ancla del libro con offset de header).
