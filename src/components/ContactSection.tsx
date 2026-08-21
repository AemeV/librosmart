import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { Mail, Phone, Instagram, Youtube, Facebook, Music2, Check } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { LogoSmart } from "./LogoSmart";
import { SectionHeading } from "./SectionHeading";
import { childVariants, inViewProps, sectionVariants, springFast, tap } from "@/lib/motion-config";

const socials = [
  { name: "Instagram", href: "https://instagram.com/", Icon: Instagram },
  { name: "YouTube", href: "https://youtube.com/", Icon: Youtube },
  { name: "TikTok", href: "https://tiktok.com/", Icon: Music2 },
  { name: "Facebook", href: "https://facebook.com/", Icon: Facebook },
];

type Errors = { name?: string; email?: string; message?: string };

export function ContactSection() {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = t("errName");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t("errEmail");
    if (values.message.trim().length < 10) next.message = t("errMessage");
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSent(true);
      setValues({ name: "", email: "", message: "" });
    }
  };

  const field =
    "mt-2 w-full rounded-[14px] border border-line bg-surface px-4 py-3 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text";

  return (
    <motion.section
      id="contacto"
      aria-labelledby="contacto-title"
      variants={sectionVariants(reduced)}
      {...inViewProps}
      className="py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1100px] px-5 sm:px-6">
        <div id="contacto-title">
          <SectionHeading title={t("contactTitle")} subtitle={t("contactSubtitle")} />
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-10">
          <motion.div variants={childVariants} className="flex flex-col items-center gap-3 text-center">
            <a
              href="tel:+573174042430"
              className="body flex min-h-11 items-center gap-3"
            >
              <Phone className="h-4 w-4 text-text-muted" aria-hidden="true" />
              +57 317 404 2430
            </a>
            <a
              href="mailto:coleccionsmart@gmail.com"
              className="body flex min-h-11 items-center gap-3 break-all"
            >
              <Mail className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
              coleccionsmart@gmail.com
            </a>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {socials.map(({ name, href, Icon }) => (
                <motion.a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={tap}
                  transition={springFast}
                  aria-label={name}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-text-muted transition-colors hover:text-text"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.form
            variants={childVariants}
            onSubmit={onSubmit}
            noValidate
            className="rounded-[20px] border border-line bg-surface p-5 sm:p-7"
          >
            <div>
              <label htmlFor="name" className="label">
                {t("formName")}
              </label>
              <input
                id="name"
                name="name"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                className={field}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name ? <p className="body-s mt-2">{errors.name}</p> : null}
            </div>

            <div className="mt-6">
              <label htmlFor="email" className="label">
                {t("formEmail")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                className={field}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email ? <p className="body-s mt-2">{errors.email}</p> : null}
            </div>

            <div className="mt-6">
              <label htmlFor="message" className="label">
                {t("formMessage")}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={values.message}
                onChange={(e) => setValues({ ...values, message: e.target.value })}
                className={field}
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message ? (
                <p className="body-s mt-2">{errors.message}</p>
              ) : null}
            </div>

            <motion.button
              type="submit"
              whileTap={tap}
              transition={springFast}
              className="label mt-6 flex min-h-11 w-full items-center justify-center rounded-full bg-text px-6 py-3 text-bg"
            >
              {t("formSend")}
            </motion.button>

            <AnimatePresence>
              {sent && (
                <motion.p
                  role="status"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={springFast}
                  className="body-s mt-4 flex items-start gap-2"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {t("formSuccess")}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>
    </motion.section>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-3 px-5 text-center sm:px-6">
        <span className="flex items-center gap-3">
          <LogoSmart className="h-5 w-auto text-text" />
        </span>
        <span className="label">
          © {new Date().getFullYear()} · {t("rights")}
        </span>
      </div>
    </footer>
  );
}
