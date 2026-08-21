import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeProvider } from "@/context/ThemeContext";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso de editores · Sm@rt" },
      {
        name: "description",
        content:
          "Acceso privado para el equipo editorial de Sm@rt: gestión de libros, galería y textos del sitio.",
      },
      { property: "og:title", content: "Acceso de editores · Sm@rt" },
      {
        property: "og:description",
        content: "Acceso privado para el equipo editorial de Sm@rt.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        navigate({ to: "/admin", replace: true });
        return;
      }
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (signUpError) throw signUpError;
      if (data.session) {
        navigate({ to: "/admin", replace: true });
        return;
      }
      setNotice("Revisa tu correo para confirmar la cuenta y luego inicia sesión.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos completar la operación.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ThemeProvider>
      <main className="flex min-h-dvh items-center justify-center bg-surface px-5 py-20">
        <div className="glass w-full max-w-[420px] rounded-[24px] p-7">
          <p className="label text-text-muted">Sm@rt · Panel editorial</p>
          <h1 className="display-m mt-2">
            {mode === "signin" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="label text-text-muted">Correo</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                maxLength={255}
                onChange={(event) => setEmail(event.target.value)}
                className="body-s rounded-[12px] border border-line bg-surface-2 px-4 py-3 outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="label text-text-muted">Contraseña</span>
              <input
                type="password"
                required
                minLength={8}
                maxLength={72}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="body-s rounded-[12px] border border-line bg-surface-2 px-4 py-3 outline-none focus:border-accent"
              />
            </label>

            {error && <p className="body-s text-red-500">{error}</p>}
            {notice && <p className="body-s text-text-muted">{notice}</p>}

            <button
              type="submit"
              disabled={busy}
              className="label rounded-full bg-accent px-6 py-3 text-white disabled:opacity-60"
            >
              {busy ? "Un momento…" : mode === "signin" ? "Entrar" : "Registrarme"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
            className="body-s mt-5 text-text-muted underline"
          >
            {mode === "signin" ? "Necesito crear una cuenta" : "Ya tengo cuenta"}
          </button>
        </div>
      </main>
    </ThemeProvider>
  );
}
