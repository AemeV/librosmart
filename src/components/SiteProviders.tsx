import type { ReactNode } from "react";
import { SiteContentProvider } from "@/context/SiteContentContext";
import type { SiteContent } from "@/lib/site-content";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthorSheetProvider } from "@/context/AuthorSheetContext";
import { AuthorSheet } from "@/components/AuthorSheet";
import { LogoMigrationProvider } from "@/context/LogoMigrationContext";
import { LogoMetalProvider } from "@/context/LogoMetalContext";
import { SkyGradient } from "@/components/SkyGradient";

/**
 * Contexto compartido por todas las rutas del sitio (tema, idioma, sheet del autor).
 * Vive en el layout `_site`, así cualquier ruta nueva o anidada lo hereda sin cambios.
 */
export function SiteProviders({
  children,
  content,
}: {
  children: ReactNode;
  content?: SiteContent | undefined;
}) {
  return (
    <SiteContentProvider value={content}>
      <ThemeProvider>
      <LanguageProvider>
        <AuthorSheetProvider>
          <LogoMetalProvider>
            <LogoMigrationProvider>
              <SkyGradient />
              {children}
              <AuthorSheet />
            </LogoMigrationProvider>
          </LogoMetalProvider>
        </AuthorSheetProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SiteContentProvider>
  );
}
