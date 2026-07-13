

// src/data/books.js

// 1. IMPORTAR CADA ARCHIVO PDF al inicio (ajusta la ruta si moviste los PDFs a otra carpeta)
// ... importa los otros PDFs

const initialBooks = [
  {
    id: 9000,
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    portadaURL: "/assets/images/cien_anios_de_soledad.jpeg", 
    genero: "Realismo Mágico",
    resumen: "Cien años de soledad es una novela escrita por el autor colombiano Gabriel García Márquez, publicada en 1967, considerada una de las obras más importantes de la literatura universal y el máximo exponente del realismo mágico.La historia narra la vida de la familia Buendía a lo largo de siete generaciones en el mítico pueblo de Macondo, fundado por José Arcadio Buendía y su esposa Úrsula Iguarán. A través de los años, la novela muestra los ciclos de amor, poder, soledad, destino y repetición que marcan la historia de la familia, al tiempo que refleja la evolución, el esplendor y la decadencia de Macondo, En sus páginas, la realidad y la fantasía se mezclan: llueven flores amarillas, los muertos regresan, y el tiempo parece girar en círculos. Cada personaje vive atrapado por su propio destino, incapaz de escapar de la soledad que caracteriza a los Buendía..",
    // 2. Usar la variable importada, que contiene la ruta correcta
    linkDescarga: "/assets/pdfs/cien_anios_de_soledad.pdf", 
    idioma: "Español",
    editorial: "Editorial Sudamericana",
    fechaPublicicacion: "1967",
    paginas: 496,
  },
  
  {
    id: 9001,
    titulo: "1984",
    autor: "George Orwell",
    portadaURL: "/assets/images/1984.jpg", 
    genero: "Distopía",
    idioma: "Español",
    editorial: "Editorial Sudamericana",
    fechaPublicicacion: "1967",
    paginas: 328,
    resumen: "1984 es una novela distópica escrita por el autor británico George Orwell y publicada en 1949. Es una de las obras más influyentes del siglo XX, reconocida por su profunda crítica a los regímenes totalitarios, la manipulación de la verdad y la pérdida de la libertad individual.La historia se desarrolla en Oceanía, uno de los tres superestados del mundo, gobernado por el Partido, una organización que controla todos los aspectos de la vida de las personas. Su líder supremo es el enigmático Gran Hermano (Big Brother), símbolo del poder absoluto y la vigilancia constante.",
    linkDescarga: "/assets/pdfs/1984.pdf", 

  },
  {
    id: 9002,
    titulo: "Leonardo da Vinci",
    autor: "Walter Isaacson",
    portadaURL: "/assets/images/dv.jpg", 
    genero: "Biografia",
    idioma: "Español",
    editorial: "Simon & Schuster",
    fechaPublicacion: "2017",
    paginas: 624,
    resumen: "Leonardo da Vinci es una biografía escrita por Walter Isaacson y publicada en 2017, que ofrece un retrato profundo, humano y fascinante del genio renacentista italiano. Basada en los miles de páginas de los cuadernos de Leonardo y en exhaustivas investigaciones históricas, la obra revela la complejidad de uno de los personajes más brillantes de la historia..",
    linkDescarga: "/assets/pdfs/Leonardo_davinci.pdf"
  },
  {
    id: 9004,
    titulo: "Harry Potter y la piedra filosofal",
    autor: "J.K. Rowling",
    portadaURL: "/assets/images/hp_1.jpg", // ¡Recuerda reemplazar esta URL!
    genero: "Fantasia",
    idioma: "Español",
    editorial: "Salamandra",
    fechaPublicacion: "1997",
    paginas: 223,
    resumen: "Harry Potter y la piedra filosofal es la primera novela de la exitosa saga escrita por la autora británica J.K. Rowling, publicada en 1997. La historia introduce al joven Harry Potter, un niño huérfano que vive con sus crueles tíos, los Dursley, hasta que descubre que es en realidad un mago.",
    // AÑADIDO: Ruta de descarga para el libro
    linkDescarga: "/assets/pdfs/Harry_Potter_y_la_piedra_filosofal.pdf"
  },
  {
    id: 9005,
    titulo: "IT",
    autor: "Stephen King",
    portadaURL: "/assets/images/it.jpeg", // ¡Recuerda reemplazar esta URL!
    genero: "Terror",
    idioma: "Español",
    editorial: "Plaza & Janés",
    fechaPublicacion: "1986",
    paginas: 1138,
    resumen: "It (título en español: Eso) es una novela de terror escrita por Stephen King y publicada en 1986. Considerada una de sus obras más emblemáticas, combina el terror sobrenatural con una profunda reflexión sobre la infancia, el miedo y el poder de la amistad.",
    // AÑADIDO: Ruta de descarga para el libro
    linkDescarga: "/assets/pdfs/it.pdf"
  },
  {
    id: 9006,
    titulo: "El Resplandor",
    autor: "Terror",
    portadaURL: "/assets/images/resplandor.jpg", // ¡Recuerda reemplazar esta URL!
    genero: "Terror",
    idioma: "Español",
    editorial: "Plaza & Janés",
    fechaPublicacion: "1977",
    paginas: 447,
    resumen: "El resplandor (The Shining) es una novela de terror psicológico escrita por Stephen King y publicada en 1977. Es una de las obras más reconocidas del autor y un clásico del género, donde el miedo surge tanto de lo sobrenatural como de la mente humana.",
    // AÑADIDO: Ruta de descarga para el libro
    linkDescarga: "/assets/pdfs/resplandor.pdf"
  },
  {
    id: 9007,
    titulo: "Un legado de Sangre",
    autor: "S.T. Gibson",
    portadaURL: "/assets/images/legado.jpeg", // ¡Recuerda reemplazar esta URL!
    genero: "Terror",
    idioma: "Español",
    editorial: "Editorial Océano",
    fechaPublicacion: "2021",
    paginas: 350,
    resumen: "Un legado de sangre (A Dowry of Blood) es una novela gótica escrita por S.T. Gibson y publicada en 2021. Es una reinterpretación moderna y poética del mito de Drácula, narrada desde la perspectiva de Constanta, una de sus esposas, quien relata su historia de amor, poder, dependencia y liberación.",
    // AÑADIDO: Ruta de descarga para el libro
    linkDescarga: "/assets/pdfs/lgs.pdf"
  },
  {
    id: 9008,
    titulo: "El señor de los anillos",
    autor: "J.R.R. Tolkien",
    portadaURL: "/assets/images/el_señor_de_los_anillos.jpg", // ¡Recuerda reemplazar esta URL!
    genero: "Fantasia",
    idioma: "Español",
    editorial: "Minotauro",
    fechaPublicacion: "1954",
    resumen: "El Señor de los Anillos: La Comunidad del Anillo es la primera parte de la célebre trilogía de fantasía épica escrita por J.R.R. Tolkien y publicada en 1954. Esta obra monumental da inicio a la travesía que definió la literatura fantástica moderna, situándose en el mundo imaginario de la Tierra Media",
    // AÑADIDO: Ruta de descarga para el libro
    linkDescarga: "/assets/pdf/sña.pdf"
  },

];

// Exportamos el array para poder usarlo en otros componentes
export default initialBooks;