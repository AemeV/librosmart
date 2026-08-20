import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SiteProviders } from "@/components/SiteProviders";

/**
 * Layout del sitio público. Todas las rutas nuevas se crean como
 * `_site.<ruta>.tsx` (y `_site.<ruta>.index.tsx` para anidar) y heredan
 * tema, idioma y el sheet del autor sin configuración extra.
 */
export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <SiteProviders>
      <Outlet />
    </SiteProviders>
  );
}
