import type { Localized } from "@/i18n/strings";
import cerveza from "@/assets/proyecto-cerveza.jpg";
import podcast from "@/assets/proyecto-podcast.jpg";
import expediciones from "@/assets/proyecto-expediciones.jpg";
import taller from "@/assets/proyecto-taller.jpg";

export type Project = {
  /** slug estable: sirve para rutas anidadas futuras (/proyectos/$slug) */
  slug: string;
  image: string;
  title: Localized;
  kicker: Localized;
  description: Localized;
  /** enlace externo del proyecto */
  link: string;
};

export const projects: Project[] = [
  {
    slug: "cerveza-sexta-extincion",
    image: cerveza,
    kicker: { es: "Cerveza artesanal", en: "Craft beer" },
    title: { es: "Cerveza Sexta Extinción", en: "Sixth Extinction Beer" },
    description: {
      es: "Una cerveza artesanal hecha en colaboración con cerveceros colombianos: cada lote lleva el nombre de una especie amenazada y parte de las ventas apoya proyectos de conservación. La etiqueta funciona como ficha de campo: ilustración, distribución y estado de conservación.",
      en: "A craft beer brewed with Colombian brewers: every batch is named after a threatened species and part of the sales support conservation projects. The label works as a field card, with illustration, range and conservation status.",
    },
    link: "https://www.instagram.com/librosmart/",
  },
  {
    slug: "podcast",
    image: podcast,
    kicker: { es: "Audio", en: "Audio" },
    title: { es: "Conversaciones Sm@rt", en: "Sm@rt Conversations" },
    description: {
      es: "Un podcast de charlas largas con biólogos, astrónomos, ilustradores y editores. Sin prisa y sin tecnicismos innecesarios: cómo se hace la ciencia y cómo se cuenta.",
      en: "A long-form podcast with biologists, astronomers, illustrators and editors. Unhurried and free of unnecessary jargon: how science is made, and how it gets told.",
    },
    link: "https://youtube.com/",
  },
  {
    slug: "expediciones",
    image: expediciones,
    kicker: { es: "Campo", en: "Fieldwork" },
    title: { es: "Expediciones de divulgación", en: "Storytelling expeditions" },
    description: {
      es: "Salidas de campo documentadas en video y cuaderno por páramos, selvas y arrecifes de Colombia. El material recogido alimenta los libros y los cortos de la editorial.",
      en: "Field trips documented on video and notebook across Colombian páramos, rainforests and reefs. The material gathered feeds the imprint's books and short films.",
    },
    link: "https://www.instagram.com/librosmart/",
  },
  {
    slug: "talleres",
    image: taller,
    kicker: { es: "Educación", en: "Education" },
    title: { es: "Talleres en colegios", en: "School workshops" },
    description: {
      es: "Programa itinerante de talleres de astronomía y biodiversidad para colegios públicos, con telescopios, guías impresas y actividades para docentes.",
      en: "A travelling programme of astronomy and biodiversity workshops for public schools, with telescopes, printed guides and activities for teachers.",
    },
    link: "https://www.instagram.com/librosmart/",
  },
];
