import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/ContactSection";
import { SectionHeading } from "@/components/SectionHeading";
import { useLang } from "@/context/LanguageContext";
import { projects } from "@/data/projects";
import { childVariants, springSoft, tap } from "@/lib/motion-config";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const title = "Otros proyectos — Sm@rt";
const description =
  "Proyectos paralelos de Sm@rt: la cerveza artesanal Sexta Extinción, el podcast, las expediciones de divulgación y los talleres en colegios.";

export const Route = createFileRoute("/_site/proyectos/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { t, tr } = useLang();

  return (
    <>
      <main className="px-5 pt-16 pb-24 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-[1100px]">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="flex flex-col items-center"
          >
            <h1 className="sr-only">{t("projectsTitle")}</h1>
            <SectionHeading
              eyebrow={t("projectsEyebrow")}
              title={t("projectsTitle")}
              subtitle={t("projectsIntro")}
              size="xl"
            />


            <div className="mt-16 flex w-full flex-col gap-20 sm:gap-28">
              {projects.map((project) => (
                <motion.article
                  key={project.slug}
                  variants={childVariants}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={springSoft}
                    className="w-full overflow-hidden rounded-3xl border border-line bg-surface-alt"
                  >
                    <img
                      src={project.image}
                      alt={tr(project.title)}
                      loading="lazy"
                      width={1200}
                      height={900}
                      className="aspect-[4/3] w-full object-cover grayscale"
                    />
                  </motion.div>

                  <p className="label mt-8">{tr(project.kicker)}</p>
                  <h2 className="display-m mt-4 text-center">
                    {tr(project.title)}
                  </h2>
                  <p className="body mt-6 max-w-[62ch] text-left text-text-muted">
                    {tr(project.description)}
                  </p>

                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={tap}
                    className="glass label mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 transition-colors hover:text-text"
                  >
                    {t("projectsVisit")}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </motion.a>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
