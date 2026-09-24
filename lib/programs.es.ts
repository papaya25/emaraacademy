import type { ProgramText } from "./programs";

/** Built-in Spanish text for the six original programs, keyed by slug. Shown
 *  wherever the admin panel's Spanish fields are blank; slug, numeral and chapter heading
 *  come from the English record. */
export const PROGRAMS_ES: Record<string, ProgramText> = {
  "new-muslim-education": {
    category: "Educación",
    title: "Educación para Nuevos Musulmanes",
    tagline:
      "Clases constantes y bien estructuradas — no una charla de bienvenida y ya — que acompañan al nuevo musulmán desde su primer día hasta que vive su fe con seguridad y por su cuenta.",
    whatItIs:
      "Un programa por etapas — Fundamentos, luego Práctica y después Profundización — impartido en español y portugués, cada semana en mezquitas aliadas y siempre con una comida compartida, para que la clase sea un encuentro entre amigos y no una conferencia.",
    activities: [
      {
        title: "Etapa de Fundamentos",
        desc: "La purificación, la oración, las creencias básicas, la lectura del Corán desde cero y lo esencial de lo halal y lo haram en la vida diaria en América Latina.",
      },
      {
        title: "Etapa de Práctica",
        desc: "El fiqh del ayuno y del Ramadán, el zakat, la familia y el matrimonio en el islam, y cómo llevar la relación con una familia que no es musulmana.",
      },
      {
        title: "Etapa de Profundización",
        desc: "La vida del Profeta (sira), círculos de tafsir, lectura y escritura en árabe, y un camino hacia la memorización para quien quiera ir más lejos.",
      },
      {
        title: "Material para llevar a casa",
        desc: "Material impreso y digital en español y portugués, porque la mayor parte de los libros islámicos disponibles están en árabe o en inglés.",
      },
      {
        title: "Comida en cada sesión",
        desc: "Un gesto pequeño y a propósito: aquí se te recibe y se te atiende, no solo se te enseña.",
      },
    ],
    problem:
      "Muchos nuevos musulmanes se alejan simplemente porque no hay un lugar fijo donde seguir aprendiendo cuando pasa el entusiasmo del principio. Una clase semanal, gratuita y con comida incluida convierte el «algún día debería aprender más» en una cita fija a la que sienten que pertenecen.",
  },
  "imam-teacher-formation": {
    category: "Formación",
    title: "Formación de Imames y Maestros",
    tagline:
      "Preparamos a imames y maestros locales para enseñar y acompañar a los nuevos musulmanes — una tarea muy distinta a guiar a una comunidad que nació en el islam.",
    whatItIs:
      "Un programa de certificación que abarca cómo vive el nuevo musulmán su conversión, un acompañamiento sensible a las heridas emocionales, métodos de enseñanza sencillos y material de da'wah en español y portugués adaptado a nuestra cultura, para que cada mezquita aliada cuente al menos con una persona capaz de sacar adelante estos programas.",
    activities: [
      {
        title: "Talleres sobre la experiencia del converso",
        desc: "Los retos propios del nuevo musulmán: el rechazo de la familia, la pérdida de identidad, el aislamiento, las dudas y el desgaste.",
      },
      {
        title: "Métodos de enseñanza",
        desc: "Cómo enseñar fiqh y Corán a adultos principiantes que no tienen ninguna base de árabe religioso.",
      },
      {
        title: "Biblioteca de material compartido",
        desc: "Una biblioteca de material didáctico ya traducido, para que ningún imam tenga que preparar sus clases desde cero.",
      },
      {
        title: "Encuentro anual de maestros",
        desc: "Imames y maestros formados en las distintas ciudades aliadas comparten su experiencia y mejoran juntos el programa.",
      },
    ],
    problem:
      "Un imam con la mejor intención, pero sin preparación para acompañar a conversos, puede hacer sin querer que un nuevo musulmán se sienta juzgado, presionado o fuera de lugar. Formar a los maestros es lo que permite repetir cada programa de ciudad en ciudad, sin depender de una sola persona especialmente talentosa.",
  },
  "community-events": {
    category: "Comunidad",
    title: "Encuentros Comunitarios",
    tagline:
      "Reuniones frecuentes y de verdad divertidas cuyo verdadero propósito es sentirse parte: comida, juegos y la oportunidad de contar tu historia y escuchar la de los demás.",
    whatItIs:
      "Noches comunitarias cada mes y encuentros más grandes según la temporada — iftares de Ramadán, celebraciones de Eid, fiestas de bienvenida para los recién convertidos — en las mezquitas aliadas o cerca de ellas, siempre alrededor de la comida, los juegos y las historias.",
    activities: [
      {
        title: "Noches de historias de conversión",
        desc: "Una noche al mes en la que los miembros cuentan su camino, y así los recién llegados encuentran palabras para su propia experiencia.",
      },
      {
        title: "Celebraciones de Eid y Ramadán",
        desc: "Pensadas para quienes no tienen una familia musulmana con quien celebrar.",
      },
      {
        title: "Juegos y dinámicas para romper el hielo",
        desc: "Actividades sociales organizadas para formar amistades de verdad, no solo conocidos.",
      },
      {
        title: "Noches de bienvenida para los primeros 90 días",
        desc: "Una bienvenida especial para los más recientes, junto con la presentación de su mentor.",
      },
    ],
    problem:
      "Muchos conversos cuentan que, de un día para otro, ganaron una religión y perdieron su mundo social. Los encuentros reconstruyen ese mundo perdido, y eso es lo que más influye en que alguien siga comprometido a largo plazo.",
  },
  "mutual-aid-fund": {
    category: "Apoyo",
    title: "Fondo de Ayuda Mutua y Emergencias",
    tagline:
      "Una red de apoyo digna, basada en la necesidad real, para que las dificultades económicas nunca sean el motivo por el que alguien se aleja.",
    whatItIs:
      "Un fondo de apoyo confidencial, administrado a través de las mezquitas aliadas, que da ayuda directa y por un tiempo definido — comida, ropa, dinero para emergencias y contactos para conseguir trabajo — a nuevos musulmanes que de verdad la necesitan; muchos perdieron el apoyo económico de su familia por haberse convertido.",
    activities: [
      {
        title: "Solicitudes confidenciales",
        desc: "Pedir ayuda nunca se convierte en chisme de mezquita.",
      },
      {
        title: "Lo básico en una emergencia",
        desc: "Despensas, ropa — incluidos paquetes de ropa modesta para empezar — y apoyo económico a corto plazo.",
      },
      {
        title: "Apoyo para salir adelante",
        desc: "Pequeños apoyos económicos y préstamos sin intereses (qard hasan) para que quienes perdieron su ingreso vuelvan a ponerse de pie.",
      },
      {
        title: "Red de profesionales",
        desc: "Abogados, médicos y terapeutas dispuestos a atender a nuevos musulmanes gratis o con descuento.",
      },
    ],
    problem:
      "Los conversos — sobre todo las mujeres que empiezan a usar el hiyab — pueden enfrentar consecuencias económicas y familiares reales por convertirse. Sin una red de apoyo, la falta de dinero se vuelve la razón práctica, no de fe, por la que la gente deja de practicar en silencio.",
  },
  "outdoor-retreats": {
    category: "Retiros",
    title: "Retiros al Aire Libre",
    tagline:
      "Retiros de fin de semana que combinan naturaleza, deporte y aprendizaje islámico, pensados para quienes no se enganchan con un salón de clases.",
    whatItIs:
      "Retiros de fin de semana cada tres meses — campamentos, salidas a la playa y a la selva, como corresponde a nuestra casa en la Riviera Maya, y excursiones de un día — que mezclan actividades al aire libre con sesiones de enseñanza breves y profundas, y tiempo libre para convivir.",
    activities: [
      {
        title: "Campamentos de fin de semana",
        desc: "Círculos de estudio alrededor de la fogata, junto con caminatas, kayak y actividades en la playa.",
      },
      {
        title: "Torneos entre mezquitas",
        desc: "Torneos de fútbol y voleibol: una forma sencilla y relajada de conocer musulmanes de otras comunidades.",
      },
      {
        title: "Paseos de un día",
        desc: "Descubrir juntos esta nueva vida, no solo sentarse juntos a aprender.",
      },
    ],
    problem:
      "Los retiros llegan a conversos que no irían a otra plática pero sí a un campamento; y una vez ahí, se llevan más comunidad y más conocimiento que en un salón de clases, mientras forman las amistades que los mantienen firmes.",
  },
  "inter-community-exchange": {
    category: "Intercambio",
    title: "Intercambio entre Comunidades",
    tagline:
      "Viajes organizados que unen a las comunidades de nuevos musulmanes de toda América Latina, para que ningún programa tenga que empezar de cero y en soledad.",
    whatItIs:
      "Un programa de intercambio que envía pequeñas delegaciones de conversos, maestros y organizadores a visitar comunidades aliadas en otros países de América Latina: comparten modelos de trabajo, forman amistades más allá de las fronteras y dejan que los conversos vean lo grande que es la umma a la que se unieron.",
    activities: [
      {
        title: "Congreso regional anual",
        desc: "Cada año una ciudad anfitriona distinta reúne a las comunidades y organizaciones aliadas de toda la región.",
      },
      {
        title: "Intercambio de delegaciones",
        desc: "Conversos de México visitan comunidades en Colombia, Brasil o Argentina, y ellos nos visitan a nosotros.",
      },
      {
        title: "Directorio regional compartido",
        desc: "Un directorio digital de organizaciones para nuevos musulmanes en América Latina, para coordinar recursos y no duplicar esfuerzos.",
      },
    ],
    problem:
      "El aislamiento no es solo personal: comunidades enteras de conversos en un país pueden sentirse pequeñas y desconectadas. Mostrarle a un nuevo musulmán que hay miles como él en todo el continente cambia la conversión de una experiencia solitaria a formar parte de una comunidad real, grande y unida.",
  },
};
