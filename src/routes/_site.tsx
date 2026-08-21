import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SiteProviders } from "@/components/SiteProviders";
import { Header } from "@/components/Header";
import { MigratingLogo } from "@/components/MigratingLogo";
import { getSiteContent } from "@/lib/site-content.functions";

/**
 * Layout del sitio público. Todas las rutas nuevas se crean como
 * `_site.<ruta>.tsx` (y `_site.<ruta>.index.tsx` para anidar) y heredan
 * tema, idioma y el sheet del autor sin configuración extra.
 */
export const Route = createFileRoute("/_site")({
  loader: () => getSiteContent(),
  component: SiteLayout,
});

function SiteLayout() {
  const content = Route.useLoaderData();
  return (
    <SiteProviders content={content}>
      <Header />
      <MigratingLogo />
      <Outlet />
    </SiteProviders>
  );
}
