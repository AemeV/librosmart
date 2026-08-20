export type Lang = "es" | "en";
export type Localized = { es: string; en: string };

export const strings = {
  brand: { es: "Librosmart", en: "Librosmart" },
  brandTagline: {
    es: "Editorial de divulgación científica",
    en: "Science writing imprint",
  },

  navBooks: { es: "Libros", en: "Books" },
  navAuthor: { es: "El autor", en: "The author" },
  navReviews: { es: "Reseñas", en: "Reviews" },
  navProjects: { es: "Otros proyectos", en: "Other projects" },
  navContact: { es: "Contacto", en: "Contact" },
  menu: { es: "Menú", en: "Menu" },
  close: { es: "Cerrar", en: "Close" },

  themeLight: { es: "Tema claro", en: "Light theme" },
  themeDark: { es: "Tema oscuro", en: "Dark theme" },
  themeSystem: { es: "Tema del sistema", en: "System theme" },
  langLabel: { es: "Idioma de la interfaz", en: "Interface language" },

  heroKicker: { es: "Librosmart presenta", en: "Librosmart presents" },
  heroTitle: {
    es: "La ciencia, contada para que no se olvide",
    en: "Science, told so it stays with you",
  },
  heroSubtitle: {
    es: "Los libros de David Mauricio Guerrero Vélez: biodiversidad, espacio y los descubrimientos que están redefiniendo nuestro siglo.",
    en: "Books by David Mauricio Guerrero Vélez: biodiversity, space and the discoveries redefining our century.",
  },
  skyCityLabel: { es: "Ciudad del cielo", en: "Sky city" },
  skyVisible: { es: "visible", en: "visible" },

  heroScroll: { es: "Desliza", en: "Scroll" },

  readersTitle: { es: "Muro de lectores", en: "Readers wall" },
  readersSubtitle: {
    es: "Lectores con los libros, en Colombia y fuera de ella.",
    en: "Readers with the books, in Colombia and beyond.",
  },

  booksTitle: { es: "Los libros", en: "The books" },
  booksSubtitle: {
    es: "Elige tu formato, tu idioma de edición y tu librería.",
    en: "Pick your format, your edition language and your store.",
  },
  featured: { es: "Novedad", en: "New" },
  openBook: { es: "Abrir el libro", en: "Open the book" },
  closeBook: { es: "Cerrar el libro", en: "Close the book" },
  newBook: { es: "Nuevo libro", en: "New book" },
  keyPoints: { es: "Qué vas a encontrar", en: "What you'll find" },
  viewIndex: { es: "Ver índice y contraportada", en: "Index and back cover" },
  indexTitle: { es: "Índice", en: "Table of contents" },
  backCoverTitle: { es: "Contraportada", en: "Back cover" },
  buyTitle: { es: "Dónde comprarlo", en: "Where to buy" },
  physical: { es: "Físico", en: "Print" },
  digital: { es: "Digital", en: "Digital" },
  editionLabel: { es: "Edición", en: "Edition" },
  editionEs: { es: "Español", en: "Spanish" },
  editionEn: { es: "Inglés", en: "English" },
  soonRetailers: {
    es: "Links de compra en camino.",
    en: "Purchase links coming soon.",
  },
  metaYear: { es: "Año", en: "Year" },
  metaLangs: { es: "Idiomas", en: "Languages" },
  metaFormats: { es: "Formatos", en: "Formats" },
  coverAlt: { es: "Portada de", en: "Cover of" },

  reviewsTitle: { es: "Lo que dicen los lectores", en: "What readers say" },
  reviewsSubtitle: {
    es: "Reseñas de lectores, prensa e instituciones.",
    en: "Reviews from readers, press and institutions.",
  },
  goodreadsCta: { es: "Perfil en Goodreads", en: "Goodreads profile" },

  authorTitle: { es: "El autor", en: "The author" },
  authorBio1: {
    es: "David Mauricio Guerrero Vélez es divulgador científico colombiano. Escribe sobre biodiversidad, exploración espacial y los descubrimientos que cambian la forma en que entendemos el mundo, con un principio fijo: rigor sin jerga.",
    en: "David Mauricio Guerrero Vélez is a Colombian science writer. He writes about biodiversity, space exploration and the discoveries reshaping how we understand the world, with one fixed principle: rigor without jargon.",
  },
  authorBio2: {
    es: "Librosmart es su editorial personal, desde donde publica la colección Sm@rt y los títulos monográficos.",
    en: "Librosmart is his personal imprint, home to the Sm@rt collection and his monographic titles.",
  },

  projectsTitle: { es: "Otros proyectos", en: "Other projects" },
  projectsSubtitle: {
    es: "Charlas, contenidos y colaboraciones alrededor de los libros.",
    en: "Talks, content and collaborations around the books.",
  },

  contactTitle: { es: "Contacto", en: "Contact" },
  contactSubtitle: {
    es: "Prensa, ferias, charlas o pedidos al por mayor.",
    en: "Press, book fairs, talks or wholesale orders.",
  },
  formName: { es: "Nombre", en: "Name" },
  formEmail: { es: "Correo", en: "Email" },
  formMessage: { es: "Mensaje", en: "Message" },
  formSend: { es: "Enviar mensaje", en: "Send message" },
  formSuccess: {
    es: "Gracias, tu mensaje quedó registrado. Te responderemos pronto.",
    en: "Thank you, your message was recorded. We'll reply soon.",
  },
  errName: { es: "Escribe tu nombre.", en: "Please enter your name." },
  errEmail: { es: "Escribe un correo válido.", en: "Enter a valid email." },
  errMessage: {
    es: "Cuéntanos algo más (mínimo 10 caracteres).",
    en: "Tell us a bit more (10 characters minimum).",
  },
  rights: { es: "Todos los derechos reservados.", en: "All rights reserved." },
  follow: { es: "Redes", en: "Social" },
} satisfies Record<string, Localized>;

export type StringKey = keyof typeof strings;
