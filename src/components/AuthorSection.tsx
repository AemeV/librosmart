import { motion, useReducedMotion } from "motion/react";
import { Mic, Youtube, GraduationCap } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { SectionHeading } from "./SectionHeading";
import { childVariants, inViewProps, sectionVariants } from "@/lib/motion-config";
import type { Localized } from "@/i18n/strings";

// TODO (David): reemplazar por los proyectos reales y sus enlaces.
const projects: { title: Localized; description: Localized; Icon: typeof Mic }[] = [
  {
    title: { es: "Charlas y ferias", en: "Talks and book fairs" },
    description: {
      es: "Conferencias en colegios, universidades y ferias del libro sobre biodiversidad y espacio.",
      en: "Lectures at schools, universities and book fairs on biodiversity and space.",
    },
    Icon: Mic,
  },
  {
    title: { es: "Contenido audiovisual", en: "Audiovisual content" },
    description: {
      es: "Videos y cápsulas de divulgación que amplían los temas de la colección Sm@rt.",
      en: "Videos and short explainers expanding on the Sm@rt collection's topics.",
    },
    Icon: Youtube,
  },
  {
    title: { es: "Material educativo", en: "Educational material" },
    description: {
      es: "Guías de lectura y recursos para docentes de ciencias naturales.",
      en: "Reading guides and resources for natural science teachers.",
    },
    Icon: GraduationCap,
  },
];

export function AuthorSection() {
  const { t, tr } = useLang();
  const reduced = useReducedMotion();

  return (
    <>
      <motion.section
        id="autor"
        aria-labelledby="autor-title"
        variants={sectionVariants(reduced)}
        {...inViewProps}
        className="py-20 sm:py-28"
      >
        <div className="mx-auto max-w-[1100px] px-5 sm:px-6">
          <div id="autor-title">
            <SectionHeading title={t("authorTitle")} />
          </div>
          <motion.div variants={childVariants} className="prose-measure mt-10 space-y-5">
            <p className="text-lg leading-relaxed">{t("authorBio1")}</p>
            <p className="text-base leading-relaxed text-text-muted">{t("authorBio2")}</p>
          </motion.div>
          <motion.p variants={childVariants} className="label mt-10 text-center">
            David Mauricio Guerrero Vélez · Bogotá, Colombia
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        id="proyectos"
        aria-labelledby="proyectos-title"
        variants={sectionVariants(reduced)}
        {...inViewProps}
        className="py-20 sm:py-28"
      >
        <div className="mx-auto max-w-[1100px] px-5 sm:px-6">
          <div id="proyectos-title">
            <SectionHeading title={t("projectsTitle")} subtitle={t("projectsSubtitle")} />
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {projects.map(({ title, description, Icon }) => (
              <motion.article
                key={title.es}
                variants={childVariants}
                className="rounded-[14px] border border-line bg-surface p-6 text-center"
              >
                <Icon className="mx-auto h-5 w-5 text-text-muted" aria-hidden="true" />
                <h3 className="tight mt-4 text-xl font-semibold">{tr(title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{tr(description)}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  );
}
