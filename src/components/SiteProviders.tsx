import type { ReactNode } from "react";
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
export function SiteProviders({ children }: { children: ReactNode }) {
  return (
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
  );
}
