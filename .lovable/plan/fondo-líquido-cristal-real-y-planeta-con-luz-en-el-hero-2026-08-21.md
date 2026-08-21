# Fondo líquido, cristal real y planeta con luz en el hero

## 1. Fondo: degradado líquido en movimiento continuo

Reemplazar el degradado lineal fijo de `SkyGradient` por un campo de luz vivo:

- Tres o cuatro "manchas" de luz morada (radial-gradient) de gran radio, muy difusas, desplazándose lentamente en trayectorias distintas (ciclos de 20–40 s, desfasados) para dar la sensación líquida de los referentes.
- La paleta se mantiene: Midnight Purple, Purple Heart, Lavender, Seashell. Se conserva la regla de luminosidad actual (oscuro nunca pasa del 45 %, claro nunca baja del 75 %) para que el texto siga leyéndose sin scrims.
- El scroll sigue mandando la evolución cromática (de arriba morado profundo a base clara), sumado ahora al movimiento propio.
- Todo por motion values / animación CSS: cero re-renders por frame.
- Con `prefers-reduced-motion` el fondo se congela en un estado estático agradable.

## 2. Cristal tipo referencia en todo el sitio

El material `.glass` existe pero es discreto. Se sube a "vidrio real" al estilo de las imágenes:

- Más desenfoque y saturación, borde superior más luminoso (highlight de 1 px) y borde inferior más apagado, para simular canto de vidrio.
- Sombra suave hacia abajo + reflejo interior tenue.
- Se aplica al header, menú, sheets, pastilla del hero, tarjetas de reseñas y cajas de compra. No se cambia estructura ni contenido, solo material.
- Se mantiene el máximo de superficies de cristal simultáneas para no matar el rendimiento, y el fallback sólido cuando el navegador no soporta backdrop-filter.

## 3. Hero: planeta con luz de borde

Detrás del logo Sm@rt, en la parte inferior del hero:

- Un planeta grande (círculo oscuro) que asoma desde abajo, con un arco de luz fino y brillantísimo en su borde superior y un halo morado difuso que se expande hacia arriba — el efecto de las dos últimas referencias.
- Hecho con CSS puro (círculo + gradientes radiales + blur), no imagen: escala perfecto y pesa cero.
- Respiración muy lenta del halo (opacidad/escala) y ligero parallax con el scroll: el planeta se hunde mientras la página avanza.
- Del borde del planeta hacia abajo arranca el degradado del resto del sitio, de modo que hero y contenido quedan cosidos sin corte visible.
- El logo y la pastilla quedan por encima, con contraste garantizado sobre la zona más oscura.

## Notas técnicas

- `src/components/SkyGradient.tsx`: capas radiales animadas + interpolación por `scrollYProgress`; se añaden keyframes de deriva en `src/styles.css`.
- Nuevo `src/components/PlanetGlow.tsx`, montado dentro de `Hero.tsx` (posición absoluta, `aria-hidden`, `pointer-events-none`).
- `.glass` y variables `--glass-*` refinadas en `src/styles.css`; sin prefijos `-webkit-` escritos a mano.
- Sin cambios de datos, rutas ni lógica.
