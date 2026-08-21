import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { claimFirstAdmin } from "@/lib/admin.functions";
import { ThemeProvider } from "@/context/ThemeContext";
import { Button, Field, ImageUpload, MultiImageUpload, NumberInput, TextArea, TextInput } from "@/components/admin/AdminUI";
import type { BookRow, ChapterRow, KeyPointRow, RetailerRow } from "@/lib/site-content";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type Tab = "books" | "readers" | "author" | "texts";

type ReaderRow = {
  id: string;
  image_url: string;
  caption_es: string;
  caption_en: string;
  position: number;
};
type TextRow = { key: string; value_es: string; value_en: string };

function AdminPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "denied" | "ok">("loading");
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState<Tab>("books");
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const checkRole = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    setEmail(userData.user?.email ?? "");
    const { data } = await supabase.rpc("is_admin");
    setStatus(data ? "ok" : "denied");
  }, []);

  useEffect(() => {
    void checkRole();
  }, [checkRole]);

  async function onClaim() {
    setClaiming(true);
    setClaimError(null);
    try {
      const result = await claimFirstAdmin();
      if (!result.granted) {
        setClaimError("Ya existe un administrador. Pídele que te dé acceso.");
        return;
      }
      await checkRole();
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "No pudimos concederte el acceso.");
    } finally {
      setClaiming(false);
    }
  }

  async function onSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <ThemeProvider>
      <main className="min-h-dvh bg-surface px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-[1100px]">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="label text-text-muted">Sm@rt · Panel editorial</p>
              <h1 className="display-m mt-1">Administración</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="body-s text-text-muted">{email}</span>
              <Button variant="ghost" onClick={() => void onSignOut()}>
                Salir
              </Button>
            </div>
          </header>

          {status === "loading" && <p className="body mt-10 text-text-muted">Cargando…</p>}

          {status === "denied" && (
            <section className="glass mt-10 rounded-[20px] p-6">
              <h2 className="display-m">Sin permisos de edición</h2>
              <p className="body mt-3 text-text-muted">
                Tu cuenta no tiene rol de administrador. Si eres la primera persona en configurar
                el panel, puedes tomar el acceso ahora.
              </p>
              {claimError && <p className="body-s mt-3 text-red-500">{claimError}</p>}
              <div className="mt-5">
                <Button onClick={() => void onClaim()} disabled={claiming}>
                  {claiming ? "Un momento…" : "Tomar acceso de administrador"}
                </Button>
              </div>
            </section>
          )}

          {status === "ok" && (
            <>
              <nav className="mt-8 flex flex-wrap gap-2">
                {(
                  [
                    ["books", "Libros"],
                    ["readers", "Galería de lectores"],
                    ["author", "Autor"],
                    ["texts", "Textos del sitio"],
                  ] as [Tab, string][]
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`label rounded-full px-4 py-2 ${
                      tab === id ? "bg-accent text-white" : "border border-line text-text-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              <div className="mt-8">
                {tab === "books" && <BooksAdmin />}
                {tab === "readers" && <ReadersAdmin />}
                {tab === "author" && <AuthorAdmin />}
                {tab === "texts" && <TextsAdmin />}
              </div>
            </>
          )}
        </div>
      </main>
    </ThemeProvider>
  );
}

function useSaveState() {
  const [message, setMessage] = useState<string | null>(null);
  const flash = useCallback((text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  }, []);
  return { message, flash };
}

/* ---------------------------------- Libros --------------------------------- */

const emptyBook = (position = 99): BookRow => ({
  published: true,
  id: "",
  slug: "",
  title: "",
  subtitle_es: "",
  subtitle_en: "",
  description_es: "",
  description_en: "",
  year: new Date().getFullYear(),
  featured: false,
  position: 99,
  cover_url: "",
  back_cover_url: null,
  back_cover_es: "",
  back_cover_en: "",
  publisher: "Sm@rt",
  release_date: "",
  pages: 0,
  dimensions: "",
  isbn: "",
  illustrated: true,
  key_points: [],
  chapters: [],
  retailers: [],
});

function BooksAdmin() {
  const [rows, setRows] = useState<BookRow[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState<BookRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { message, flash } = useSaveState();

  const load = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from("books")
      .select("*")
      .order("position", { ascending: true });
    if (loadError) {
      setError(loadError.message);
      return;
    }
    setRows((data ?? []) as unknown as BookRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!selected) return;
    const row = rows.find((r) => r.id === selected);
    if (row) setDraft(structuredClone(row));
  }, [selected, rows]);

  function patch(next: Partial<BookRow>) {
    setDraft((current) => (current ? { ...current, ...next } : current));
  }

  async function save() {
    if (!draft) return;
    if (!draft.slug.trim() || !draft.title.trim()) {
      setError("El libro necesita título y slug.");
      return;
    }
    setError(null);
    const { id, ...rest } = draft;
    const payload = {
      ...rest,
      key_points: rest.key_points as unknown as never,
      chapters: rest.chapters as unknown as never,
      retailers: rest.retailers as unknown as never,
    };
    const { error: saveError } = id
      ? await supabase.from("books").update(payload).eq("id", id)
      : await supabase.from("books").insert(payload);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    flash("Guardado");
    setSelected(null);
    setDraft(null);
    await load();
  }

  async function remove(id: string) {
    if (!window.confirm("¿Borrar este libro del sitio?")) return;
    const { error: deleteError } = await supabase.from("books").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setSelected(null);
    setDraft(null);
    await load();
  }

  if (draft) {
    return (
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="display-m">{draft.title || "Nuevo libro"}</h2>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { setDraft(null); setSelected(null); }}>
              Cancelar
            </Button>
            <Button onClick={() => void save()}>Guardar</Button>
          </div>
        </div>
        {error && <p className="body-s text-red-500">{error}</p>}
        {message && <p className="body-s text-text-muted">{message}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título">
            <TextInput value={draft.title} onChange={(v) => patch({ title: v })} />
          </Field>
          <Field label="Slug (URL)">
            <TextInput value={draft.slug} onChange={(v) => patch({ slug: v })} maxLength={80} />
          </Field>
          <Field label="Subtítulo (ES)">
            <TextInput value={draft.subtitle_es} onChange={(v) => patch({ subtitle_es: v })} />
          </Field>
          <Field label="Subtítulo (EN)">
            <TextInput value={draft.subtitle_en} onChange={(v) => patch({ subtitle_en: v })} />
          </Field>
          <Field label="Descripción (ES)">
            <TextArea value={draft.description_es} onChange={(v) => patch({ description_es: v })} />
          </Field>
          <Field label="Descripción (EN)">
            <TextArea value={draft.description_en} onChange={(v) => patch({ description_en: v })} />
          </Field>
          <Field label="Año">
            <NumberInput value={draft.year} onChange={(v) => patch({ year: v })} />
          </Field>
          <Field label="Orden en el sitio">
            <NumberInput value={draft.position} onChange={(v) => patch({ position: v })} />
          </Field>
          <label className="body-s flex items-center gap-3">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(event) => patch({ featured: event.target.checked })}
            />
            Destacado (aparece primero y en el banner)
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <ImageUpload
            label="Portada"
            folder="covers"
            value={draft.cover_url}
            onChange={(url) => patch({ cover_url: url })}
          />
          <ImageUpload
            label="Contraportada (imagen)"
            folder="covers"
            value={draft.back_cover_url ?? ""}
            onChange={(url) => patch({ back_cover_url: url || null })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Texto de contraportada (ES)">
            <TextArea value={draft.back_cover_es} onChange={(v) => patch({ back_cover_es: v })} />
          </Field>
          <Field label="Texto de contraportada (EN)">
            <TextArea value={draft.back_cover_en} onChange={(v) => patch({ back_cover_en: v })} />
          </Field>
          <Field label="Editorial">
            <TextInput value={draft.publisher} onChange={(v) => patch({ publisher: v })} />
          </Field>
          <Field label="Fecha de publicación">
            <TextInput value={draft.release_date} onChange={(v) => patch({ release_date: v })} />
          </Field>
          <Field label="Páginas">
            <NumberInput value={draft.pages} onChange={(v) => patch({ pages: v })} />
          </Field>
          <Field label="Dimensiones">
            <TextInput value={draft.dimensions} onChange={(v) => patch({ dimensions: v })} />
          </Field>
          <Field label="ISBN">
            <TextInput value={draft.isbn} onChange={(v) => patch({ isbn: v })} />
          </Field>
          <label className="body-s flex items-center gap-3">
            <input
              type="checkbox"
              checked={draft.illustrated}
              onChange={(event) => patch({ illustrated: event.target.checked })}
            />
            Ilustrado
          </label>
        </div>

        <ListEditor<KeyPointRow>
          title="Qué vas a encontrar"
          items={draft.key_points ?? []}
          onChange={(items) => patch({ key_points: items })}
          create={() => ({ title_es: "", title_en: "", text_es: "", text_en: "" })}
          render={(item, update) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Título (ES)">
                <TextInput value={item.title_es} onChange={(v) => update({ title_es: v })} />
              </Field>
              <Field label="Título (EN)">
                <TextInput value={item.title_en} onChange={(v) => update({ title_en: v })} />
              </Field>
              <Field label="Texto (ES)">
                <TextArea value={item.text_es} onChange={(v) => update({ text_es: v })} rows={3} />
              </Field>
              <Field label="Texto (EN)">
                <TextArea value={item.text_en} onChange={(v) => update({ text_en: v })} rows={3} />
              </Field>
            </div>
          )}
        />

        <ListEditor<ChapterRow>
          title="Índice"
          items={draft.chapters ?? []}
          onChange={(items) => patch({ chapters: items })}
          create={(index) => ({ number: index + 1, title_es: "", title_en: "" })}
          render={(item, update) => (
            <div className="grid gap-3 sm:grid-cols-[100px_1fr_1fr]">
              <Field label="Nº">
                <NumberInput value={item.number} onChange={(v) => update({ number: v })} />
              </Field>
              <Field label="Título (ES)">
                <TextInput value={item.title_es} onChange={(v) => update({ title_es: v })} />
              </Field>
              <Field label="Título (EN)">
                <TextInput value={item.title_en} onChange={(v) => update({ title_en: v })} />
              </Field>
            </div>
          )}
        />

        <ListEditor<RetailerRow>
          title="Dónde comprarlo"
          items={draft.retailers ?? []}
          onChange={(items) => patch({ retailers: items })}
          create={() => ({ name: "", url: "", kind: "physical", language: "es" })}
          render={(item, update) => (
            <div className="grid gap-3 sm:grid-cols-4">
              <Field label="Tienda">
                <TextInput value={item.name} onChange={(v) => update({ name: v })} />
              </Field>
              <Field label="Enlace">
                <TextInput value={item.url} onChange={(v) => update({ url: v })} maxLength={600} />
              </Field>
              <Field label="Formato">
                <select
                  value={item.kind}
                  onChange={(event) =>
                    update({ kind: event.target.value as RetailerRow["kind"] })
                  }
                  className="body-s rounded-[12px] border border-line bg-surface-2 px-3 py-2"
                >
                  <option value="physical">Físico</option>
                  <option value="digital">Digital</option>
                </select>
              </Field>
              <Field label="Edición">
                <select
                  value={item.language}
                  onChange={(event) =>
                    update({ language: event.target.value as RetailerRow["language"] })
                  }
                  className="body-s rounded-[12px] border border-line bg-surface-2 px-3 py-2"
                >
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                </select>
              </Field>
            </div>
          )}
        />

        <div className="flex justify-between">
          {draft.id ? (
            <Button variant="danger" onClick={() => void remove(draft.id)}>
              Borrar libro
            </Button>
          ) : (
            <span />
          )}
          <Button onClick={() => void save()}>Guardar</Button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="display-m">Libros</h2>
        <Button onClick={() => setDraft(emptyBook())}>Añadir libro</Button>
      </div>
      {error && <p className="body-s mt-3 text-red-500">{error}</p>}
      <ul className="mt-6 flex flex-col gap-3">
        {rows.map((row) => (
          <li
            key={row.id}
            className="glass flex items-center gap-4 rounded-[16px] p-4"
          >
            <div className="h-20 w-14 shrink-0 overflow-hidden rounded-[8px] border border-line bg-surface-2">
              {row.cover_url ? (
                <img src={row.cover_url} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="body">{row.title}</p>
              <p className="body-s text-text-muted">
                {row.year} · /{row.slug} {row.featured ? "· destacado" : ""}
              </p>
            </div>
            <Button variant="ghost" onClick={() => setSelected(row.id)}>
              Editar
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ListEditor<T>({
  title,
  items,
  onChange,
  create,
  render,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  create: (index: number) => T;
  render: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <section className="glass rounded-[16px] p-5">
      <div className="flex items-center justify-between">
        <h3 className="body">{title}</h3>
        <Button variant="ghost" onClick={() => onChange([...items, create(items.length)])}>
          Añadir
        </Button>
      </div>
      <div className="mt-4 flex flex-col gap-5">
        {items.map((item, index) => (
          <div key={index} className="rounded-[12px] border border-line p-4">
            {render(item, (patch) => {
              const next = [...items];
              next[index] = { ...items[index]!, ...patch };
              onChange(next);
            })}
            <div className="mt-3 flex justify-end">
              <Button
                variant="danger"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
              >
                Quitar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- Galería de lectores --------------------------- */

function ReadersAdmin() {
  const [rows, setRows] = useState<ReaderRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { message, flash } = useSaveState();

  const load = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from("reader_photos")
      .select("*")
      .order("position", { ascending: true });
    if (loadError) setError(loadError.message);
    else setRows((data ?? []) as ReaderRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function patch(id: string, next: Partial<ReaderRow>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...next } : row)));
  }

  async function add() {
    const { error: insertError } = await supabase.from("reader_photos").insert({
      caption_es: "",
      caption_en: "",
      position: rows.length,
    });
    if (insertError) setError(insertError.message);
    else await load();
  }

  /** Varias imágenes de golpe: cada una entra como una foto nueva de la galería. */
  async function addMany(urls: string[]) {
    setError(null);
    const { error: insertError } = await supabase.from("reader_photos").insert(
      urls.map((url, index) => ({
        image_url: url,
        caption_es: "",
        caption_en: "",
        position: rows.length + index,
      })),
    );
    if (insertError) setError(insertError.message);
    else {
      flash(`${urls.length} imagen(es) añadidas`);
      await load();
    }
  }

  async function saveAll() {
    setError(null);
    for (const row of rows) {
      const { error: saveError } = await supabase
        .from("reader_photos")
        .update({ image_url: row.image_url, position: row.position })
        .eq("id", row.id);
      if (saveError) {
        setError(saveError.message);
        return;
      }
    }
    flash("Galería guardada");
  }

  async function remove(id: string) {
    const { error: deleteError } = await supabase.from("reader_photos").delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    else await load();
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="display-m">Galería de lectores</h2>
        <div className="flex flex-wrap items-center gap-2">
          <MultiImageUpload
            label="Subir varias imágenes"
            folder="readers"
            onUploaded={addMany}
          />
          <Button variant="ghost" onClick={() => void add()}>
            Añadir vacía
          </Button>
          <Button onClick={() => void saveAll()}>Guardar todo</Button>
        </div>
      </div>
      {error && <p className="body-s mt-3 text-red-500">{error}</p>}
      {message && <p className="body-s mt-3 text-text-muted">{message}</p>}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <li key={row.id} className="glass flex flex-col gap-4 rounded-[16px] p-4">
            <ImageUpload
              label="Foto"
              folder="readers"
              value={row.image_url}
              onChange={(url) => patch(row.id, { image_url: url })}
            />
            <Field label="Orden">
              <NumberInput value={row.position} onChange={(v) => patch(row.id, { position: v })} />
            </Field>
            <div className="flex justify-end">
              <Button variant="danger" onClick={() => void remove(row.id)}>
                Borrar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ----------------------------------- Autor --------------------------------- */

function AuthorAdmin() {
  const [portrait, setPortrait] = useState("");
  const [texts, setTexts] = useState<TextRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { message, flash } = useSaveState();

  const authorKeys = useMemo(
    () => [
      "authorSheetRole",
      "authorSheetBio1",
      "authorSheetBio2",
      "authorSheetBio3",
      "authorBio1",
      "authorBio2",
      "authorPortraitAlt",
    ],
    [],
  );

  const load = useCallback(async () => {
    const [{ data: image }, { data: rows }] = await Promise.all([
      supabase.from("site_images").select("*").eq("key", "author_portrait").maybeSingle(),
      supabase.from("site_texts").select("key, value_es, value_en").in("key", authorKeys),
    ]);
    setPortrait(image?.image_url ?? "");
    setTexts((rows ?? []) as TextRow[]);
  }, [authorKeys]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    setError(null);
    const { error: imageError } = await supabase
      .from("site_images")
      .upsert({ key: "author_portrait", image_url: portrait }, { onConflict: "key" });
    if (imageError) {
      setError(imageError.message);
      return;
    }
    for (const row of texts) {
      const { error: textError } = await supabase
        .from("site_texts")
        .upsert(row, { onConflict: "key" });
      if (textError) {
        setError(textError.message);
        return;
      }
    }
    flash("Perfil guardado");
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="display-m">Autor</h2>
        <Button onClick={() => void save()}>Guardar</Button>
      </div>
      {error && <p className="body-s text-red-500">{error}</p>}
      {message && <p className="body-s text-text-muted">{message}</p>}

      <ImageUpload label="Foto de perfil" folder="author" value={portrait} onChange={setPortrait} />

      <div className="flex flex-col gap-5">
        {texts.map((row) => (
          <div key={row.key} className="glass grid gap-3 rounded-[16px] p-4 sm:grid-cols-2">
            <p className="label text-text-muted sm:col-span-2">{row.key}</p>
            <Field label="Español">
              <TextArea
                value={row.value_es}
                rows={3}
                onChange={(v) =>
                  setTexts((current) =>
                    current.map((item) => (item.key === row.key ? { ...item, value_es: v } : item)),
                  )
                }
              />
            </Field>
            <Field label="Inglés">
              <TextArea
                value={row.value_en}
                rows={3}
                onChange={(v) =>
                  setTexts((current) =>
                    current.map((item) => (item.key === row.key ? { ...item, value_en: v } : item)),
                  )
                }
              />
            </Field>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Textos del sitio --------------------------- */

function TextsAdmin() {
  const [rows, setRows] = useState<TextRow[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { message, flash } = useSaveState();

  const load = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from("site_texts")
      .select("key, value_es, value_en")
      .order("key", { ascending: true });
    if (loadError) setError(loadError.message);
    else setRows((data ?? []) as TextRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = rows.filter((row) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      row.key.toLowerCase().includes(needle) ||
      row.value_es.toLowerCase().includes(needle) ||
      row.value_en.toLowerCase().includes(needle)
    );
  });

  async function save() {
    setError(null);
    for (const row of rows) {
      const { error: saveError } = await supabase
        .from("site_texts")
        .upsert(row, { onConflict: "key" });
      if (saveError) {
        setError(saveError.message);
        return;
      }
    }
    flash("Textos guardados");
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="display-m">Textos del sitio</h2>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar…"
            className="body-s rounded-[12px] border border-line bg-surface-2 px-3 py-2"
          />
          <Button onClick={() => void save()}>Guardar</Button>
        </div>
      </div>
      {error && <p className="body-s text-red-500">{error}</p>}
      {message && <p className="body-s text-text-muted">{message}</p>}

      <div className="flex flex-col gap-4">
        {visible.map((row) => (
          <div key={row.key} className="glass grid gap-3 rounded-[16px] p-4 sm:grid-cols-2">
            <p className="label text-text-muted sm:col-span-2">{row.key}</p>
            <Field label="Español">
              <TextArea
                value={row.value_es}
                rows={2}
                onChange={(v) =>
                  setRows((current) =>
                    current.map((item) => (item.key === row.key ? { ...item, value_es: v } : item)),
                  )
                }
              />
            </Field>
            <Field label="Inglés">
              <TextArea
                value={row.value_en}
                rows={2}
                onChange={(v) =>
                  setRows((current) =>
                    current.map((item) => (item.key === row.key ? { ...item, value_en: v } : item)),
                  )
                }
              />
            </Field>
          </div>
        ))}
      </div>
    </section>
  );
}
