import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { uploadMedia } from "@/lib/media-upload";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label text-text-muted">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "body-s w-full rounded-[12px] border border-line bg-surface-2 px-3 py-2 outline-none focus:border-accent";

export function TextInput({
  value,
  onChange,
  type = "text",
  maxLength = 400,
}: {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  maxLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      maxLength={maxLength}
      onChange={(event) => onChange(event.target.value)}
      className={inputClass}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 4,
  maxLength = 4000,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      maxLength={maxLength}
      onChange={(event) => onChange(event.target.value)}
      className={inputClass}
    />
  );
}

export function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : 0}
      onChange={(event) => onChange(Number(event.target.value))}
      className={inputClass}
    />
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const styles =
    variant === "primary"
      ? "bg-accent text-white"
      : variant === "danger"
        ? "border border-line text-red-500"
        : "border border-line text-text";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`label rounded-full px-4 py-2 disabled:opacity-60 ${styles}`}
    >
      {children}
    </button>
  );
}

/** Subida de imágenes: guarda en el almacenamiento y devuelve la URL final. */
export function ImageUpload({
  label,
  folder,
  value,
  onChange,
}: {
  label: string;
  folder: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Máximo 8 MB por imagen.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadMedia(folder, file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="label text-text-muted">{label}</span>
      <div className="flex items-center gap-3">
        <div className="h-20 w-16 overflow-hidden rounded-[10px] border border-line bg-surface-2">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : null}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => void onFile(event.target.files?.[0])}
          />
          <Button variant="ghost" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? "Subiendo…" : "Subir imagen"}
          </Button>
          {value ? (
            <Button variant="danger" onClick={() => onChange("")}>
              Quitar
            </Button>
          ) : null}
        </div>
      </div>
      {error ? <p className="body-s text-red-500">{error}</p> : null}
    </div>
  );
}
