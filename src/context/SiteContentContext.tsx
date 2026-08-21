import { createContext, useContext, type ReactNode } from "react";
import { fallbackContent, type SiteContent } from "@/lib/site-content";

const SiteContentContext = createContext<SiteContent>(fallbackContent);

export function SiteContentProvider({
  value,
  children,
}: {
  value?: SiteContent | undefined;
  children: ReactNode;
}) {
  return (
    <SiteContentContext.Provider value={value ?? fallbackContent}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
