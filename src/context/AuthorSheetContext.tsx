import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type AuthorSheetValue = {
  open: boolean;
  openSheet: () => void;
  closeSheet: () => void;
};

const AuthorSheetContext = createContext<AuthorSheetValue | null>(null);

export function AuthorSheetProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openSheet = useCallback(() => setOpen(true), []);
  const closeSheet = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, openSheet, closeSheet }), [open, openSheet, closeSheet]);
  return <AuthorSheetContext.Provider value={value}>{children}</AuthorSheetContext.Provider>;
}

export function useAuthorSheet() {
  const ctx = useContext(AuthorSheetContext);
  if (!ctx) throw new Error("useAuthorSheet must be used inside AuthorSheetProvider");
  return ctx;
}
