/**
 * Fondo del hero. Aislado a propósito: aquí entrará el cielo en tiempo real.
 * Por ahora, degradado sólido sensible al tema.
 */
export function SkyBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--surface)_0%,var(--bg)_55%,var(--surface-2)_100%)]" />
      <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/18 blur-3xl" />
      <div className="absolute bottom-0 right-[-10%] h-[380px] w-[380px] rounded-full bg-text/5 blur-3xl" />
    </div>
  );
}
