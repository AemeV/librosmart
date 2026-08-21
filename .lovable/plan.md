# Aclarar el círculo degradado del hero

El borde de la Tierra en `OrbitScene.tsx` quedó demasiado oscuro (`#241048` → `#0A0118`) y rompe la continuidad con el cielo claro del sitio (`#F3EEF9`, `#E9E0F7`). Se va a retonar para que lea como un limbo luminoso, no como una mancha negra.

## Cambios

1. **Degradado del planeta**  
   Reemplazar los valores actuales del círculo terrestre por una escala mucho más clara dentro de la paleta morada del sitio, por ejemplo desde un lavanda suave (`#E9E0F7` / `#DFD4F2`) hacia un púrpura medio (`#9B7ED4` / `#7A5ABF`) en lugar de caer a casi negro. La idea es que el fondo del hero fluya directamente al resto de la página.

2. **Arco atmosférico**  
   Mantener el filo de luz lavanda/blanco, pero rebajar la intensidad de las sombras violetas profundas para que no compitan con el contenido. El pulso `arc-breath` se conserva.

3. **Bloom inferior**  
   Suavizar el resplandor que sube desde el limbo para que actúe como transición, no como contraste.

4. **Verificación de contenido superpuesto**  
   Confirmar que la pastilla "Nuevo" y el indicador "Desliza" siguen siendo legibles sobre el círculo aclarado; ajustar opacidades o sombras si es necesario.

## Archivos a editar

- `src/components/OrbitScene.tsx`: ajustar colores del círculo terrestre, bloom y arco.
- Posiblemente `src/components/Hero.tsx` si hay que reubicar el botón "Nuevo" tras aclarar el fondo.

## Fuera de alcance

No se toca la estructura de la escena, los cuerpos celestes, el grano, la viñeta, el paralaje ni el resto del sitio.
