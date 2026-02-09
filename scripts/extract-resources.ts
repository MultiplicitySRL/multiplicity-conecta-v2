/**
 * Script para extraer todos los recursos del portal de clientes
 * y generar el seed inicial para el mini-CMS en Google Sheets
 */

interface Resource {
  id: string
  step_number: number | string
  step_title: string
  section_title: string
  subsection_title: string
  card_title: string
  card_description: string
  cta_label: string
  cta_type: "tutorial" | "download" | "external" | "internal" | "none"
  cta_url: string
  thumbnail_url: string
  media_type: "video" | "pdf" | "link" | "page" | "none"
  media_url: string
  layout_type: string
  order_index: number
  is_active: boolean
  tags: string
}

const resources: Resource[] = []
let orderIndex = 0

// ============================================================================
// CASO DE USO - Tour General
// ============================================================================
resources.push({
  id: "tour-general",
  step_number: "",
  step_title: "",
  section_title: "Caso de uso multiplicity",
  subsection_title: "",
  card_title: "Tour general de la plataforma",
  card_description: "Una orientación sobre los contenidos y tutoriales que te permitirán un uso efectivo de la herramienta de evaluación.",
  cta_label: "Ver Video",
  cta_type: "tutorial",
  cta_url: "https://www.youtube.com/embed/pfDyegdtG2E",
  thumbnail_url: "",
  media_type: "video",
  media_url: "https://www.youtube.com/embed/pfDyegdtG2E",
  layout_type: "hero_video",
  order_index: orderIndex++,
  is_active: true,
  tags: "tour,introduccion,plataforma",
})

// ============================================================================
// PASO 1: Creación de los perfiles
// ============================================================================
resources.push({
  id: "paso-1-guia-perfiles",
  step_number: 1,
  step_title: "Creación de los perfiles",
  section_title: "Primer Paso",
  subsection_title: "",
  card_title: "Guía para definir perfiles",
  card_description: "",
  cta_label: "Descargar Guía",
  cta_type: "download",
  cta_url: "/documentos/Guia-Definir-Perfiles.pdf",
  thumbnail_url: "/clientes/guia de perfiles.jpeg",
  media_type: "pdf",
  media_url: "/documentos/Guia-Definir-Perfiles.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "perfiles,guia,paso-1",
})

resources.push({
  id: "paso-1-perfiles-oit",
  step_number: 1,
  step_title: "Creación de los perfiles",
  section_title: "Primer Paso",
  subsection_title: "",
  card_title: "Perfiles predeterminados OIT",
  card_description: "",
  cta_label: "Descargar Guía",
  cta_type: "download",
  cta_url: "/documentos/Perfiles-OIT.pdf",
  thumbnail_url: "/clientes/perfiles oit.jpeg",
  media_type: "pdf",
  media_url: "/documentos/Perfiles-OIT.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "perfiles,oit,paso-1",
})

resources.push({
  id: "tutorial-creacion-perfiles",
  step_number: 1,
  step_title: "Creación de los perfiles",
  section_title: "Primer Paso",
  subsection_title: "",
  card_title: "Creación de Perfiles",
  card_description: "",
  cta_label: "Ver Tutorial",
  cta_type: "tutorial",
  cta_url: "https://www.youtube.com/embed/SPbDhWks5k0",
  thumbnail_url: "/profile-comparison-dashboard.jpg",
  media_type: "video",
  media_url: "https://www.youtube.com/embed/SPbDhWks5k0",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "perfiles,tutorial,video,paso-1",
})

// ============================================================================
// PASO 2: Creación de Procesos de Evaluación
// ============================================================================
resources.push({
  id: "tutorial-gestion-usuarios",
  step_number: 2,
  step_title: "Creación de Procesos de Evaluación",
  section_title: "Segundo Paso",
  subsection_title: "",
  card_title: "Gestión de Usuarios",
  card_description: "",
  cta_label: "Ver Tutorial",
  cta_type: "tutorial",
  cta_url: "https://www.youtube.com/embed/lTX96_VH7nY",
  thumbnail_url: "/clean-user-management-dashboard.jpg",
  media_type: "video",
  media_url: "https://www.youtube.com/embed/lTX96_VH7nY",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "usuarios,gestion,tutorial,paso-2",
})

resources.push({
  id: "tutorial-comparativo",
  step_number: 2,
  step_title: "Creación de Procesos de Evaluación",
  section_title: "Segundo Paso",
  subsection_title: "",
  card_title: "Comparativo",
  card_description: "",
  cta_label: "Ver Tutorial",
  cta_type: "tutorial",
  cta_url: "https://www.youtube.com/embed/pVzVMefVTJU",
  thumbnail_url: "/profile-comparison-dashboard.jpg",
  media_type: "video",
  media_url: "https://www.youtube.com/embed/pVzVMefVTJU",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "comparativo,tutorial,paso-2",
})

resources.push({
  id: "tutorial-indice-tendencias",
  step_number: 2,
  step_title: "Creación de Procesos de Evaluación",
  section_title: "Segundo Paso",
  subsection_title: "",
  card_title: "Índice y Tendencias",
  card_description: "",
  cta_label: "Ver Tutorial",
  cta_type: "tutorial",
  cta_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  thumbnail_url: "/evaluation-workflow-builder.jpg",
  media_type: "video",
  media_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "indice,tendencias,tutorial,paso-2",
})

resources.push({
  id: "tutorial-creacion-procesos",
  step_number: 2,
  step_title: "Creación de Procesos de Evaluación",
  section_title: "Segundo Paso",
  subsection_title: "",
  card_title: "Creación de Procesos de Evaluación y Configuración de Pruebas",
  card_description: "",
  cta_label: "Ver Tutorial",
  cta_type: "tutorial",
  cta_url: "https://www.youtube.com/embed/tO1sRoO8Arc",
  thumbnail_url: "/evaluation-workflow-builder.jpg",
  media_type: "video",
  media_url: "https://www.youtube.com/embed/tO1sRoO8Arc",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "procesos,evaluacion,configuracion,tutorial,paso-2",
})

resources.push({
  id: "tutorial-gestion-participantes",
  step_number: 2,
  step_title: "Creación de Procesos de Evaluación",
  section_title: "Segundo Paso",
  subsection_title: "",
  card_title: "Gestión de Participantes",
  card_description: "",
  cta_label: "Ver Tutorial",
  cta_type: "tutorial",
  cta_url: "https://www.youtube.com/embed/oTV_B7H1kD8",
  thumbnail_url: "/participant-management-interface.jpg",
  media_type: "video",
  media_url: "https://www.youtube.com/embed/oTV_B7H1kD8",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "participantes,gestion,tutorial,paso-2",
})

resources.push({
  id: "tutorial-duplicar-procesos",
  step_number: 2,
  step_title: "Creación de Procesos de Evaluación",
  section_title: "Segundo Paso",
  subsection_title: "",
  card_title: "Duplicar Procesos",
  card_description: "",
  cta_label: "Ver Tutorial",
  cta_type: "tutorial",
  cta_url: "https://www.youtube.com/embed/WGBNbEdzGlI",
  thumbnail_url: "/process-duplication-workflow.jpg",
  media_type: "video",
  media_url: "https://www.youtube.com/embed/WGBNbEdzGlI",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "duplicar,procesos,tutorial,paso-2",
})

// ============================================================================
// PASO 3: Envío de Invitaciones a candidatos
// ============================================================================
resources.push({
  id: "tutorial-invitaciones-correo",
  step_number: 3,
  step_title: "Envío de Invitaciones a candidatos",
  section_title: "Tercer Paso",
  subsection_title: "",
  card_title: "Envío de Invitaciones por Correo Electrónico",
  card_description: "",
  cta_label: "Ver Tutorial",
  cta_type: "tutorial",
  cta_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  thumbnail_url: "/email-invitation-workflow-dashboard.jpg",
  media_type: "video",
  media_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "invitaciones,correo,email,tutorial,paso-3",
})

resources.push({
  id: "tutorial-invitaciones-credenciales",
  step_number: 3,
  step_title: "Envío de Invitaciones a candidatos",
  section_title: "Tercer Paso",
  subsection_title: "",
  card_title: "Envío de Invitaciones por Credenciales de Acceso",
  card_description: "",
  cta_label: "Ver Tutorial",
  cta_type: "tutorial",
  cta_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  thumbnail_url: "/credential-invitation-interface.jpg",
  media_type: "video",
  media_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "invitaciones,credenciales,tutorial,paso-3",
})

resources.push({
  id: "tutorial-estado-pruebas",
  step_number: 3,
  step_title: "Envío de Invitaciones a candidatos",
  section_title: "Tercer Paso",
  subsection_title: "",
  card_title: "Estado de las Pruebas y Reinicio",
  card_description: "",
  cta_label: "Ver Tutorial",
  cta_type: "tutorial",
  cta_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  thumbnail_url: "/evaluation-progress-status-dashboard.jpg",
  media_type: "video",
  media_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "estado,pruebas,reinicio,tutorial,paso-3",
})

// ============================================================================
// PASO 4: Generación de Reportes
// ============================================================================
resources.push({
  id: "tutorial-reportes-individuales",
  step_number: 4,
  step_title: "Generación de Reportes",
  section_title: "Cuarto Paso",
  subsection_title: "",
  card_title: "Descarga Reportes Individuales",
  card_description: "",
  cta_label: "Descargar Guía",
  cta_type: "download",
  cta_url: "/documentos/tutorial-reportes-individuales.pdf",
  thumbnail_url: "/individual-assessment-report-dashboard.jpg",
  media_type: "pdf",
  media_url: "/documentos/tutorial-reportes-individuales.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "reportes,individuales,descarga,paso-4",
})

resources.push({
  id: "tutorial-reportes-grupales",
  step_number: 4,
  step_title: "Generación de Reportes",
  section_title: "Cuarto Paso",
  subsection_title: "",
  card_title: "Descarga Reportes Grupales",
  card_description: "",
  cta_label: "Descargar Guía",
  cta_type: "download",
  cta_url: "/documentos/tutorial-reportes-grupales.pdf",
  thumbnail_url: "/group-performance-analytics-dashboard.jpg",
  media_type: "pdf",
  media_url: "/documentos/tutorial-reportes-grupales.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "reportes,grupales,descarga,paso-4",
})

resources.push({
  id: "tutorial-utilidad-reportes",
  step_number: 4,
  step_title: "Generación de Reportes",
  section_title: "Cuarto Paso",
  subsection_title: "",
  card_title: "Video de Utilidad de los Reportes",
  card_description: "",
  cta_label: "Ver Video",
  cta_type: "tutorial",
  cta_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  thumbnail_url: "/individual-assessment-report-dashboard.jpg",
  media_type: "video",
  media_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "reportes,utilidad,video,paso-4",
})

// ============================================================================
// INTERPRETACIÓN DE RESULTADOS
// ============================================================================
resources.push({
  id: "tutorial-guia-interpretacion-individual",
  step_number: "",
  step_title: "",
  section_title: "Interpretación de Resultados",
  subsection_title: "",
  card_title: "Guía de Interpretación Individual de Resultados Empresa y Candidato",
  card_description: "Guías y videos para interpretar los resultados de las evaluaciones de manera efectiva.",
  cta_label: "Descargar Guía",
  cta_type: "download",
  cta_url: "/documentos/tutorial-guia-interpretacion-individual.pdf",
  thumbnail_url: "/individual-assessment-report-dashboard.jpg",
  media_type: "pdf",
  media_url: "/documentos/tutorial-guia-interpretacion-individual.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "interpretacion,individual,resultados,guia",
})

resources.push({
  id: "tutorial-guia-interpretacion-grupal",
  step_number: "",
  step_title: "",
  section_title: "Interpretación de Resultados",
  subsection_title: "",
  card_title: "Guía de Interpretación de Resultados Grupales Empresa",
  card_description: "",
  cta_label: "Descargar Guía",
  cta_type: "download",
  cta_url: "/documentos/tutorial-guia-interpretacion-grupal.pdf",
  thumbnail_url: "/group-performance-analytics-dashboard.jpg",
  media_type: "pdf",
  media_url: "/documentos/tutorial-guia-interpretacion-grupal.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "interpretacion,grupal,resultados,guia",
})

// ============================================================================
// AGENDAR CITA
// ============================================================================
resources.push({
  id: "agendar-cita",
  step_number: "",
  step_title: "",
  section_title: "Agendar Cita",
  subsection_title: "",
  card_title: "¿Deseas que te acompañemos en algunos de estos pasos?",
  card_description: "Agenda una cita con nosotros",
  cta_label: "Agendar Cita",
  cta_type: "external",
  cta_url: "https://cal.com/carlos-santos/30min",
  thumbnail_url: "",
  media_type: "link",
  media_url: "",
  layout_type: "cta_card",
  order_index: orderIndex++,
  is_active: true,
  tags: "cita,agendar,soporte",
})

// ============================================================================
// MANUALES
// ============================================================================
resources.push({
  id: "platform-requerimientos-tecnicos",
  step_number: "",
  step_title: "",
  section_title: "Manuales",
  subsection_title: "",
  card_title: "Requerimientos Técnicos",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Requerimientos Tecnicos Plataforma Multiplicity.pdf",
  thumbnail_url: "/images/Requerimientos Tecnico de la plataforma.png",
  media_type: "pdf",
  media_url: "/documentos/Requerimientos Tecnicos Plataforma Multiplicity.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "manuales,requerimientos,tecnicos,plataforma",
})

resources.push({
  id: "platform-manual-funcional",
  step_number: "",
  step_title: "",
  section_title: "Manuales",
  subsection_title: "",
  card_title: "Manual Funcional de la Plataforma",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Manual Funcional de la Plataforma.pdf",
  thumbnail_url: "/images/Manual Funcional de la plataforma.png",
  media_type: "pdf",
  media_url: "/documentos/Manual Funcional de la Plataforma.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "manuales,funcional,plataforma",
})

resources.push({
  id: "platform-recomendaciones-basico",
  step_number: "",
  step_title: "",
  section_title: "Manuales",
  subsection_title: "Orientaciones para la aplicación de los Test",
  card_title: "Recomendaciones antes de completar Multiplicity - Participante Básico",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Recomendaciones antes de completar Multiplicity - Participante Basico.pdf",
  thumbnail_url: "/clientes/2.png",
  media_type: "pdf",
  media_url: "/documentos/Recomendaciones antes de completar Multiplicity - Participante Basico.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "manuales,recomendaciones,basico,test",
})

resources.push({
  id: "platform-facilitadores-basico",
  step_number: "",
  step_title: "",
  section_title: "Manuales",
  subsection_title: "Orientaciones para la aplicación de los Test",
  card_title: "Aplicación Presencial de Facilitadores – Proceso Básico",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Aplicacion Presencial de Facilitadores - Proceso Basico.pdf",
  thumbnail_url: "/clientes/3.png",
  media_type: "pdf",
  media_url: "/documentos/Aplicacion Presencial de Facilitadores - Proceso Basico.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "manuales,facilitadores,basico,presencial",
})

resources.push({
  id: "platform-recomendaciones-plus",
  step_number: "",
  step_title: "",
  section_title: "Manuales",
  subsection_title: "Orientaciones para la aplicación de los Test",
  card_title: "Recomendaciones antes de completar Multiplicity – Participante Plus",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Recomendaciones antes de completar Multiplicity - Participante Plus.pdf",
  thumbnail_url: "/clientes/4.png",
  media_type: "pdf",
  media_url: "/documentos/Recomendaciones antes de completar Multiplicity - Participante Plus.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "manuales,recomendaciones,plus,test",
})

resources.push({
  id: "platform-facilitadores-plus",
  step_number: "",
  step_title: "",
  section_title: "Manuales",
  subsection_title: "Orientaciones para la aplicación de los Test",
  card_title: "Tutorial Aplicación Presencial de Facilitadores – Proceso Plus",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Tutorial Aplicacion Presencial de Facilitadores - Proceso Plus.pdf",
  thumbnail_url: "/clientes/5.png",
  media_type: "pdf",
  media_url: "/documentos/Tutorial Aplicacion Presencial de Facilitadores - Proceso Plus.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "manuales,facilitadores,plus,presencial",
})

// ============================================================================
// BASES CONCEPTUALES
// ============================================================================
resources.push({
  id: "conceptual-diccionario",
  step_number: "",
  step_title: "",
  section_title: "Nuestras bases conceptuales",
  subsection_title: "",
  card_title: "Diccionario de Comportamientos",
  card_description: "Fundamentos teóricos que sustentan las evaluaciones y metodologías aplicadas en la plataforma.",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Diccionario de Comportamientos.pdf",
  thumbnail_url: "/nuevo-clientes/Diccionario de Comportamientos portada.png",
  media_type: "pdf",
  media_url: "/documentos/Diccionario de Comportamientos.pdf",
  layout_type: "hero_download",
  order_index: orderIndex++,
  is_active: true,
  tags: "conceptual,diccionario,comportamientos",
})

resources.push({
  id: "conceptual-competencias",
  step_number: "",
  step_title: "",
  section_title: "Nuestras bases conceptuales",
  subsection_title: "",
  card_title: "Competencias",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Competencias.pdf",
  thumbnail_url: "/clientes/Diccionario de Competencias Multiplicity 1.png",
  media_type: "pdf",
  media_url: "/documentos/Competencias.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "conceptual,competencias",
})

resources.push({
  id: "conceptual-pensamiento",
  step_number: "",
  step_title: "",
  section_title: "Nuestras bases conceptuales",
  subsection_title: "",
  card_title: "Pensamiento Analítico y Sistémico",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Pensamiento Analitico y Sistemico.pdf",
  thumbnail_url: "/clientes/Diccionario de pensamiento anaco y sistémico - Multiplicity 1.png",
  media_type: "pdf",
  media_url: "/documentos/Pensamiento Analitico y Sistemico.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "conceptual,pensamiento,analitico,sistemico",
})

resources.push({
  id: "conceptual-motivadores",
  step_number: "",
  step_title: "",
  section_title: "Nuestras bases conceptuales",
  subsection_title: "",
  card_title: "Motivadores",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Motivadores.pdf",
  thumbnail_url: "/clientes/Diccionario-de-motivadores-Multiplicity 1.png",
  media_type: "pdf",
  media_url: "/documentos/Motivadores.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "conceptual,motivadores",
})

resources.push({
  id: "conceptual-fichas-tecnicas",
  step_number: "",
  step_title: "",
  section_title: "Nuestras bases conceptuales",
  subsection_title: "",
  card_title: "Fichas Técnicas de las Pruebas",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Fichas Tecnicas de las Pruebas.pdf",
  thumbnail_url: "/clientes/6.png",
  media_type: "pdf",
  media_url: "/documentos/Fichas Tecnicas de las Pruebas.pdf",
  layout_type: "hero_download",
  order_index: orderIndex++,
  is_active: true,
  tags: "conceptual,fichas,tecnicas,pruebas",
})

// ============================================================================
// APOYÁNDOTE EN LA VALORACIÓN INTEGRAL
// ============================================================================
resources.push({
  id: "assessment-guia-entrevista",
  step_number: "",
  step_title: "",
  section_title: "Apoyándote En La Valoración integral",
  subsection_title: "La Evaluación Contraste: La Entrevista",
  card_title: "Guía de Entrevista por Competencias",
  card_description: "Herramientas y guías para maximizar el valor de tus procesos de evaluación y desarrollo de talento.",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Guia de Entrevista por Competencias.pdf",
  thumbnail_url: "/clientes/6.png",
  media_type: "pdf",
  media_url: "/documentos/Guia de Entrevista por Competencias.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "valoracion,entrevista,competencias,guia",
})

resources.push({
  id: "assessment-metodologia",
  step_number: "",
  step_title: "",
  section_title: "Apoyándote En La Valoración integral",
  subsection_title: "La Evaluación Contraste: La Entrevista",
  card_title: "Metodología de Aplicación de la Entrevista",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Metodologia de Aplicacion.xlsx",
  thumbnail_url: "/clientes/8.png",
  media_type: "link",
  media_url: "/documentos/Metodologia de Aplicacion.xlsx",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "valoracion,metodologia,entrevista",
})

resources.push({
  id: "assessment-retroalimentacion",
  step_number: "",
  step_title: "",
  section_title: "Apoyándote En La Valoración integral",
  subsection_title: "Compartiendo los Resultados",
  card_title: "Guía de Retroalimentación por Competencias",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Guia de Retroalimentacion por Competencias.pdf",
  thumbnail_url: "/clientes/10.png",
  media_type: "pdf",
  media_url: "/documentos/Guia de Retroalimentacion por Competencias.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "valoracion,retroalimentacion,competencias",
})

resources.push({
  id: "assessment-plan-sucesion",
  step_number: "",
  step_title: "",
  section_title: "Apoyándote En La Valoración integral",
  subsection_title: "Convirtiendo los Datos de Evaluación en Entendimiento",
  card_title: "Ideas para un Plan de Sucesión",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Ideas para un Plan de Sucesion.pdf",
  thumbnail_url: "/clientes/11.png",
  media_type: "pdf",
  media_url: "/documentos/Ideas para un Plan de Sucesion.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "valoracion,plan,sucesion",
})

resources.push({
  id: "assessment-pautas-autodesarrollo",
  step_number: "",
  step_title: "",
  section_title: "Apoyándote En La Valoración integral",
  subsection_title: "El Desarrollo de Competencias",
  card_title: "Pautas para el autodesarrollo por Competencias – Evaluados",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Pautas para el autodesarrollo por Competencias.pdf",
  thumbnail_url: "/clientes/12.png",
  media_type: "pdf",
  media_url: "/documentos/Pautas para el autodesarrollo por Competencias.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "valoracion,autodesarrollo,competencias",
})

resources.push({
  id: "assessment-plan-accion",
  step_number: "",
  step_title: "",
  section_title: "Apoyándote En La Valoración integral",
  subsection_title: "El Desarrollo de Competencias",
  card_title: "Plan de Acción por Competencias/Evaluados",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Plan de Accion por Competencias.pdf",
  thumbnail_url: "/clientes/13.png",
  media_type: "pdf",
  media_url: "/documentos/Plan de Accion por Competencias.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "valoracion,plan,accion,competencias",
})

resources.push({
  id: "assessment-taller-ppt",
  step_number: "",
  step_title: "",
  section_title: "Apoyándote En La Valoración integral",
  subsection_title: "El Desarrollo de Competencias",
  card_title: "PPT Taller de Autodesarrollo por Competencias/Evaluados",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/PPT Taller de Autodesarrollo por Competencias.pptx",
  thumbnail_url: "/clientes/2.png",
  media_type: "link",
  media_url: "/documentos/PPT Taller de Autodesarrollo por Competencias.pptx",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "valoracion,taller,autodesarrollo,ppt",
})

resources.push({
  id: "assessment-manual-autodesarrollo",
  step_number: "",
  step_title: "",
  section_title: "Apoyándote En La Valoración integral",
  subsection_title: "El Desarrollo de Competencias",
  card_title: "Manual de Autodesarrollo por Competencias",
  card_description: "",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Manual de Autodesarrollo por Competencias.pdf",
  thumbnail_url: "/clientes/9.png",
  media_type: "pdf",
  media_url: "/documentos/Manual de Autodesarrollo por Competencias.pdf",
  layout_type: "card_grid",
  order_index: orderIndex++,
  is_active: true,
  tags: "valoracion,manual,autodesarrollo,competencias",
})

// ============================================================================
// ESTUDIOS E INVESTIGACIONES
// ============================================================================
resources.push({
  id: "research-trends",
  step_number: "",
  step_title: "",
  section_title: "Estudios e Investigaciones",
  subsection_title: "",
  card_title: "Trends by Multiplicity",
  card_description: "Descubre hallazgos y tendencias en gestión de talento, competencias profesionales y desarrollo organizacional.",
  cta_label: "Ver Documento",
  cta_type: "download",
  cta_url: "/documentos/Trends by Multiplicity.pdf",
  thumbnail_url: "/clientes/Trends.png",
  media_type: "pdf",
  media_url: "/documentos/Trends by Multiplicity.pdf",
  layout_type: "hero_download",
  order_index: orderIndex++,
  is_active: true,
  tags: "investigacion,trends,tendencias",
})

// ============================================================================
// FUNCIONES DE EXPORTACIÓN
// ============================================================================

function escapeCSV(value: string | number | boolean): string {
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  // Escape double quotes and wrap in quotes if contains comma, newline, or quote
  const stringValue = String(value)
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function generateCSV(): string {
  const headers = [
    "id",
    "step_number",
    "step_title",
    "section_title",
    "subsection_title",
    "card_title",
    "card_description",
    "cta_label",
    "cta_type",
    "cta_url",
    "thumbnail_url",
    "media_type",
    "media_url",
    "layout_type",
    "order_index",
    "is_active",
    "tags",
  ]

  const rows = resources.map((resource) =>
    headers.map((header) => escapeCSV(resource[header as keyof Resource])).join(","),
  )

  return [headers.join(","), ...rows].join("\n")
}

function generateJSON(): string {
  return JSON.stringify(resources, null, 2)
}

// ============================================================================
// EXPORTAR DATOS
// ============================================================================

if (typeof window === "undefined") {
  // Node.js environment
  const fs = require("fs")
  const path = require("path")

  const outputDir = path.join(__dirname, "..")
  const csvPath = path.join(outputDir, "resources_seed.csv")
  const jsonPath = path.join(outputDir, "resources_seed.json")

  fs.writeFileSync(csvPath, generateCSV(), "utf8")
  fs.writeFileSync(jsonPath, generateJSON(), "utf8")

  console.log("✅ Archivos generados exitosamente:")
  console.log(`   - ${csvPath}`)
  console.log(`   - ${jsonPath}`)
  console.log(`\n📊 Resumen:`)
  console.log(`   - Total de recursos: ${resources.length}`)
  console.log(`   - Pasos detectados: 4`)
  console.log(`   - Secciones adicionales: 6`)
  console.log(`\n🎯 Desglose por paso:`)
  console.log(`   - Paso 1 (Creación de perfiles): 3 recursos`)
  console.log(`   - Paso 2 (Creación de Procesos): 6 recursos`)
  console.log(`   - Paso 3 (Envío de Invitaciones): 3 recursos`)
  console.log(`   - Paso 4 (Generación de Reportes): 3 recursos`)
  console.log(`   - Interpretación de Resultados: 2 recursos`)
  console.log(`   - Manuales: 6 recursos`)
  console.log(`   - Bases Conceptuales: 5 recursos`)
  console.log(`   - Valoración Integral: 8 recursos`)
  console.log(`   - Estudios e Investigaciones: 1 recurso`)
  console.log(`   - Otros: 2 recursos`)
} else {
  // Browser environment - export functions
  ;(window as any).generateCSV = generateCSV
  ;(window as any).generateJSON = generateJSON
  ;(window as any).resources = resources
}

export { resources, generateCSV, generateJSON }
