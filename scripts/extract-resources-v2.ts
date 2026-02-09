/**
 * Script MEJORADO para extraer recursos del portal
 * Versión 2.0 - Optimizado para facilidad de uso del usuario final
 */

interface ResourceSimplified {
  // IDENTIFICACIÓN (campos técnicos - no editar frecuentemente)
  id: string
  orden: number
  activo: string // "SÍ" o "NO"
  
  // ORGANIZACIÓN (estructura del portal)
  paso: string // "1", "2", "3", "4" o vacío
  titulo_paso: string
  seccion: string
  subseccion: string
  
  // CONTENIDO (lo que ve el usuario)
  titulo: string
  descripcion: string
  
  // BOTÓN/ACCIÓN
  texto_boton: string
  tipo_accion: string // "Video Tutorial", "Descargar PDF", "Link Externo", "Agendar"
  
  // RECURSOS (URLs y archivos)
  url_documento: string
  url_video_youtube: string
  imagen_miniatura: string
  
  // METADATOS
  etiquetas: string
  notas_internas: string
}

const resourcesV2: ResourceSimplified[] = []

// ============================================================================
// TOUR GENERAL
// ============================================================================
resourcesV2.push({
  id: "tour-general",
  orden: 1,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "🎯 Caso de uso multiplicity",
  subseccion: "",
  titulo: "Tour general de la plataforma",
  descripcion: "Una orientación sobre los contenidos y tutoriales que te permitirán un uso efectivo de la herramienta de evaluación.",
  texto_boton: "Ver Video",
  tipo_accion: "Video Tutorial",
  url_documento: "",
  url_video_youtube: "pfDyegdtG2E",
  imagen_miniatura: "",
  etiquetas: "tour, introduccion, plataforma",
  notas_internas: "Video introductorio principal del portal",
})

// ============================================================================
// PASO 1: CREACIÓN DE PERFILES
// ============================================================================
resourcesV2.push({
  id: "paso-1-guia-perfiles",
  orden: 2,
  activo: "SÍ",
  paso: "1",
  titulo_paso: "Creación de los perfiles",
  seccion: "Primer Paso",
  subseccion: "",
  titulo: "Guía para definir perfiles",
  descripcion: "",
  texto_boton: "Descargar Guía",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Guia-Definir-Perfiles.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/guia de perfiles.jpeg",
  etiquetas: "perfiles, guia, paso-1",
  notas_internas: "",
})

resourcesV2.push({
  id: "paso-1-perfiles-oit",
  orden: 3,
  activo: "SÍ",
  paso: "1",
  titulo_paso: "Creación de los perfiles",
  seccion: "Primer Paso",
  subseccion: "",
  titulo: "Perfiles predeterminados OIT",
  descripcion: "",
  texto_boton: "Descargar Guía",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Perfiles-OIT.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/perfiles oit.jpeg",
  etiquetas: "perfiles, oit, paso-1",
  notas_internas: "Perfiles estándar de la OIT",
})

resourcesV2.push({
  id: "tutorial-creacion-perfiles",
  orden: 4,
  activo: "SÍ",
  paso: "1",
  titulo_paso: "Creación de los perfiles",
  seccion: "Primer Paso",
  subseccion: "",
  titulo: "Creación de Perfiles",
  descripcion: "",
  texto_boton: "Ver Tutorial",
  tipo_accion: "Video Tutorial",
  url_documento: "",
  url_video_youtube: "SPbDhWks5k0",
  imagen_miniatura: "/profile-comparison-dashboard.jpg",
  etiquetas: "perfiles, tutorial, video, paso-1",
  notas_internas: "",
})

// ============================================================================
// PASO 2: CREACIÓN DE PROCESOS
// ============================================================================
resourcesV2.push({
  id: "tutorial-gestion-usuarios",
  orden: 5,
  activo: "SÍ",
  paso: "2",
  titulo_paso: "Creación de Procesos de Evaluación",
  seccion: "Segundo Paso",
  subseccion: "",
  titulo: "Gestión de Usuarios",
  descripcion: "",
  texto_boton: "Ver Tutorial",
  tipo_accion: "Video Tutorial",
  url_documento: "",
  url_video_youtube: "lTX96_VH7nY",
  imagen_miniatura: "/clean-user-management-dashboard.jpg",
  etiquetas: "usuarios, gestion, tutorial, paso-2",
  notas_internas: "",
})

resourcesV2.push({
  id: "tutorial-comparativo",
  orden: 6,
  activo: "SÍ",
  paso: "2",
  titulo_paso: "Creación de Procesos de Evaluación",
  seccion: "Segundo Paso",
  subseccion: "",
  titulo: "Comparativo",
  descripcion: "",
  texto_boton: "Ver Tutorial",
  tipo_accion: "Video Tutorial",
  url_documento: "",
  url_video_youtube: "pVzVMefVTJU",
  imagen_miniatura: "/profile-comparison-dashboard.jpg",
  etiquetas: "comparativo, tutorial, paso-2",
  notas_internas: "",
})

resourcesV2.push({
  id: "tutorial-indice-tendencias",
  orden: 7,
  activo: "SÍ",
  paso: "2",
  titulo_paso: "Creación de Procesos de Evaluación",
  seccion: "Segundo Paso",
  subseccion: "",
  titulo: "Índice y Tendencias",
  descripcion: "",
  texto_boton: "Ver Tutorial",
  tipo_accion: "Video Tutorial",
  url_documento: "",
  url_video_youtube: "dQw4w9WgXcQ",
  imagen_miniatura: "/evaluation-workflow-builder.jpg",
  etiquetas: "indice, tendencias, tutorial, paso-2",
  notas_internas: "⚠️ PENDIENTE: Reemplazar ID de YouTube real",
})

resourcesV2.push({
  id: "tutorial-creacion-procesos",
  orden: 8,
  activo: "SÍ",
  paso: "2",
  titulo_paso: "Creación de Procesos de Evaluación",
  seccion: "Segundo Paso",
  subseccion: "",
  titulo: "Creación de Procesos de Evaluación y Configuración de Pruebas",
  descripcion: "",
  texto_boton: "Ver Tutorial",
  tipo_accion: "Video Tutorial",
  url_documento: "",
  url_video_youtube: "tO1sRoO8Arc",
  imagen_miniatura: "/evaluation-workflow-builder.jpg",
  etiquetas: "procesos, evaluacion, configuracion, tutorial, paso-2",
  notas_internas: "",
})

resourcesV2.push({
  id: "tutorial-gestion-participantes",
  orden: 9,
  activo: "SÍ",
  paso: "2",
  titulo_paso: "Creación de Procesos de Evaluación",
  seccion: "Segundo Paso",
  subseccion: "",
  titulo: "Gestión de Participantes",
  descripcion: "",
  texto_boton: "Ver Tutorial",
  tipo_accion: "Video Tutorial",
  url_documento: "",
  url_video_youtube: "oTV_B7H1kD8",
  imagen_miniatura: "/participant-management-interface.jpg",
  etiquetas: "participantes, gestion, tutorial, paso-2",
  notas_internas: "",
})

resourcesV2.push({
  id: "tutorial-duplicar-procesos",
  orden: 10,
  activo: "SÍ",
  paso: "2",
  titulo_paso: "Creación de Procesos de Evaluación",
  seccion: "Segundo Paso",
  subseccion: "",
  titulo: "Duplicar Procesos",
  descripcion: "",
  texto_boton: "Ver Tutorial",
  tipo_accion: "Video Tutorial",
  url_documento: "",
  url_video_youtube: "WGBNbEdzGlI",
  imagen_miniatura: "/process-duplication-workflow.jpg",
  etiquetas: "duplicar, procesos, tutorial, paso-2",
  notas_internas: "",
})

// ============================================================================
// PASO 3: ENVÍO DE INVITACIONES
// ============================================================================
resourcesV2.push({
  id: "tutorial-invitaciones-correo",
  orden: 11,
  activo: "SÍ",
  paso: "3",
  titulo_paso: "Envío de Invitaciones a candidatos",
  seccion: "Tercer Paso",
  subseccion: "",
  titulo: "Envío de Invitaciones por Correo Electrónico",
  descripcion: "",
  texto_boton: "Ver Tutorial",
  tipo_accion: "Video Tutorial",
  url_documento: "",
  url_video_youtube: "dQw4w9WgXcQ",
  imagen_miniatura: "/email-invitation-workflow-dashboard.jpg",
  etiquetas: "invitaciones, correo, email, tutorial, paso-3",
  notas_internas: "⚠️ PENDIENTE: Reemplazar ID de YouTube real",
})

resourcesV2.push({
  id: "tutorial-invitaciones-credenciales",
  orden: 12,
  activo: "SÍ",
  paso: "3",
  titulo_paso: "Envío de Invitaciones a candidatos",
  seccion: "Tercer Paso",
  subseccion: "",
  titulo: "Envío de Invitaciones por Credenciales de Acceso",
  descripcion: "",
  texto_boton: "Ver Tutorial",
  tipo_accion: "Video Tutorial",
  url_documento: "",
  url_video_youtube: "dQw4w9WgXcQ",
  imagen_miniatura: "/credential-invitation-interface.jpg",
  etiquetas: "invitaciones, credenciales, tutorial, paso-3",
  notas_internas: "⚠️ PENDIENTE: Reemplazar ID de YouTube real",
})

resourcesV2.push({
  id: "tutorial-estado-pruebas",
  orden: 13,
  activo: "SÍ",
  paso: "3",
  titulo_paso: "Envío de Invitaciones a candidatos",
  seccion: "Tercer Paso",
  subseccion: "",
  titulo: "Estado de las Pruebas y Reinicio",
  descripcion: "",
  texto_boton: "Ver Tutorial",
  tipo_accion: "Video Tutorial",
  url_documento: "",
  url_video_youtube: "dQw4w9WgXcQ",
  imagen_miniatura: "/evaluation-progress-status-dashboard.jpg",
  etiquetas: "estado, pruebas, reinicio, tutorial, paso-3",
  notas_internas: "⚠️ PENDIENTE: Reemplazar ID de YouTube real",
})

// ============================================================================
// PASO 4: GENERACIÓN DE REPORTES
// ============================================================================
resourcesV2.push({
  id: "tutorial-reportes-individuales",
  orden: 14,
  activo: "SÍ",
  paso: "4",
  titulo_paso: "Generación de Reportes",
  seccion: "Cuarto Paso",
  subseccion: "",
  titulo: "Descarga Reportes Individuales",
  descripcion: "",
  texto_boton: "Descargar Guía",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/tutorial-reportes-individuales.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/individual-assessment-report-dashboard.jpg",
  etiquetas: "reportes, individuales, descarga, paso-4",
  notas_internas: "",
})

resourcesV2.push({
  id: "tutorial-reportes-grupales",
  orden: 15,
  activo: "SÍ",
  paso: "4",
  titulo_paso: "Generación de Reportes",
  seccion: "Cuarto Paso",
  subseccion: "",
  titulo: "Descarga Reportes Grupales",
  descripcion: "",
  texto_boton: "Descargar Guía",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/tutorial-reportes-grupales.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/group-performance-analytics-dashboard.jpg",
  etiquetas: "reportes, grupales, descarga, paso-4",
  notas_internas: "",
})

resourcesV2.push({
  id: "tutorial-utilidad-reportes",
  orden: 16,
  activo: "SÍ",
  paso: "4",
  titulo_paso: "Generación de Reportes",
  seccion: "Cuarto Paso",
  subseccion: "",
  titulo: "Video de Utilidad de los Reportes",
  descripcion: "",
  texto_boton: "Ver Video",
  tipo_accion: "Video Tutorial",
  url_documento: "",
  url_video_youtube: "dQw4w9WgXcQ",
  imagen_miniatura: "/individual-assessment-report-dashboard.jpg",
  etiquetas: "reportes, utilidad, video, paso-4",
  notas_internas: "⚠️ PENDIENTE: Reemplazar ID de YouTube real",
})

// ============================================================================
// INTERPRETACIÓN DE RESULTADOS
// ============================================================================
resourcesV2.push({
  id: "tutorial-guia-interpretacion-individual",
  orden: 17,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "📊 Interpretación de Resultados",
  subseccion: "",
  titulo: "Guía de Interpretación Individual de Resultados Empresa y Candidato",
  descripcion: "Guías y videos para interpretar los resultados de las evaluaciones de manera efectiva.",
  texto_boton: "Descargar Guía",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/tutorial-guia-interpretacion-individual.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/individual-assessment-report-dashboard.jpg",
  etiquetas: "interpretacion, individual, resultados, guia",
  notas_internas: "",
})

resourcesV2.push({
  id: "tutorial-guia-interpretacion-grupal",
  orden: 18,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "📊 Interpretación de Resultados",
  subseccion: "",
  titulo: "Guía de Interpretación de Resultados Grupales Empresa",
  descripcion: "",
  texto_boton: "Descargar Guía",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/tutorial-guia-interpretacion-grupal.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/group-performance-analytics-dashboard.jpg",
  etiquetas: "interpretacion, grupal, resultados, guia",
  notas_internas: "",
})

// ============================================================================
// AGENDAR CITA
// ============================================================================
resourcesV2.push({
  id: "agendar-cita",
  orden: 19,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "📅 Agendar Cita",
  subseccion: "",
  titulo: "¿Deseas que te acompañemos en algunos de estos pasos?",
  descripcion: "Agenda una cita con nosotros",
  texto_boton: "Agendar Cita",
  tipo_accion: "Link Externo",
  url_documento: "https://cal.com/carlos-santos/30min",
  url_video_youtube: "",
  imagen_miniatura: "",
  etiquetas: "cita, agendar, soporte",
  notas_internas: "CTA para agendar reunión con el equipo",
})

// ============================================================================
// MANUALES
// ============================================================================
resourcesV2.push({
  id: "platform-requerimientos-tecnicos",
  orden: 20,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "📚 Manuales",
  subseccion: "",
  titulo: "Requerimientos Técnicos",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Requerimientos Tecnicos Plataforma Multiplicity.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/images/Requerimientos Tecnico de la plataforma.png",
  etiquetas: "manuales, requerimientos, tecnicos, plataforma",
  notas_internas: "",
})

resourcesV2.push({
  id: "platform-manual-funcional",
  orden: 21,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "📚 Manuales",
  subseccion: "",
  titulo: "Manual Funcional de la Plataforma",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Manual Funcional de la Plataforma.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/images/Manual Funcional de la plataforma.png",
  etiquetas: "manuales, funcional, plataforma",
  notas_internas: "",
})

resourcesV2.push({
  id: "platform-recomendaciones-basico",
  orden: 22,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "📚 Manuales",
  subseccion: "Orientaciones para la aplicación de los Test",
  titulo: "Recomendaciones antes de completar Multiplicity - Participante Básico",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Recomendaciones antes de completar Multiplicity - Participante Basico.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/2.png",
  etiquetas: "manuales, recomendaciones, basico, test",
  notas_internas: "",
})

resourcesV2.push({
  id: "platform-facilitadores-basico",
  orden: 23,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "📚 Manuales",
  subseccion: "Orientaciones para la aplicación de los Test",
  titulo: "Aplicación Presencial de Facilitadores – Proceso Básico",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Aplicacion Presencial de Facilitadores - Proceso Basico.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/3.png",
  etiquetas: "manuales, facilitadores, basico, presencial",
  notas_internas: "",
})

resourcesV2.push({
  id: "platform-recomendaciones-plus",
  orden: 24,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "📚 Manuales",
  subseccion: "Orientaciones para la aplicación de los Test",
  titulo: "Recomendaciones antes de completar Multiplicity – Participante Plus",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Recomendaciones antes de completar Multiplicity - Participante Plus.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/4.png",
  etiquetas: "manuales, recomendaciones, plus, test",
  notas_internas: "",
})

resourcesV2.push({
  id: "platform-facilitadores-plus",
  orden: 25,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "📚 Manuales",
  subseccion: "Orientaciones para la aplicación de los Test",
  titulo: "Tutorial Aplicación Presencial de Facilitadores – Proceso Plus",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Tutorial Aplicacion Presencial de Facilitadores - Proceso Plus.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/5.png",
  etiquetas: "manuales, facilitadores, plus, presencial",
  notas_internas: "",
})

// ============================================================================
// BASES CONCEPTUALES
// ============================================================================
resourcesV2.push({
  id: "conceptual-diccionario",
  orden: 26,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "🧠 Nuestras bases conceptuales",
  subseccion: "",
  titulo: "Diccionario de Comportamientos",
  descripcion: "Fundamentos teóricos que sustentan las evaluaciones y metodologías aplicadas en la plataforma.",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Diccionario de Comportamientos.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/nuevo-clientes/Diccionario de Comportamientos portada.png",
  etiquetas: "conceptual, diccionario, comportamientos",
  notas_internas: "Documento destacado - hero layout",
})

resourcesV2.push({
  id: "conceptual-competencias",
  orden: 27,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "🧠 Nuestras bases conceptuales",
  subseccion: "",
  titulo: "Competencias",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Competencias.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/Diccionario de Competencias Multiplicity 1.png",
  etiquetas: "conceptual, competencias",
  notas_internas: "",
})

resourcesV2.push({
  id: "conceptual-pensamiento",
  orden: 28,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "🧠 Nuestras bases conceptuales",
  subseccion: "",
  titulo: "Pensamiento Analítico y Sistémico",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Pensamiento Analitico y Sistemico.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/Diccionario de pensamiento anaco y sistémico - Multiplicity 1.png",
  etiquetas: "conceptual, pensamiento, analitico, sistemico",
  notas_internas: "",
})

resourcesV2.push({
  id: "conceptual-motivadores",
  orden: 29,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "🧠 Nuestras bases conceptuales",
  subseccion: "",
  titulo: "Motivadores",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Motivadores.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/Diccionario-de-motivadores-Multiplicity 1.png",
  etiquetas: "conceptual, motivadores",
  notas_internas: "",
})

resourcesV2.push({
  id: "conceptual-fichas-tecnicas",
  orden: 30,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "🧠 Nuestras bases conceptuales",
  subseccion: "",
  titulo: "Fichas Técnicas de las Pruebas",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Fichas Tecnicas de las Pruebas.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/6.png",
  etiquetas: "conceptual, fichas, tecnicas, pruebas",
  notas_internas: "Documento destacado - hero layout",
})

// ============================================================================
// VALORACIÓN INTEGRAL
// ============================================================================
resourcesV2.push({
  id: "assessment-guia-entrevista",
  orden: 31,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "💼 Apoyándote En La Valoración integral",
  subseccion: "La Evaluación Contraste: La Entrevista",
  titulo: "Guía de Entrevista por Competencias",
  descripcion: "Herramientas y guías para maximizar el valor de tus procesos de evaluación y desarrollo de talento.",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Guia de Entrevista por Competencias.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/6.png",
  etiquetas: "valoracion, entrevista, competencias, guia",
  notas_internas: "",
})

resourcesV2.push({
  id: "assessment-metodologia",
  orden: 32,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "💼 Apoyándote En La Valoración integral",
  subseccion: "La Evaluación Contraste: La Entrevista",
  titulo: "Metodología de Aplicación de la Entrevista",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar Excel",
  url_documento: "/documentos/Metodologia de Aplicacion.xlsx",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/8.png",
  etiquetas: "valoracion, metodologia, entrevista",
  notas_internas: "Archivo Excel",
})

resourcesV2.push({
  id: "assessment-retroalimentacion",
  orden: 33,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "💼 Apoyándote En La Valoración integral",
  subseccion: "Compartiendo los Resultados",
  titulo: "Guía de Retroalimentación por Competencias",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Guia de Retroalimentacion por Competencias.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/10.png",
  etiquetas: "valoracion, retroalimentacion, competencias",
  notas_internas: "",
})

resourcesV2.push({
  id: "assessment-plan-sucesion",
  orden: 34,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "💼 Apoyándote En La Valoración integral",
  subseccion: "Convirtiendo los Datos de Evaluación en Entendimiento",
  titulo: "Ideas para un Plan de Sucesión",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Ideas para un Plan de Sucesion.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/11.png",
  etiquetas: "valoracion, plan, sucesion",
  notas_internas: "",
})

resourcesV2.push({
  id: "assessment-pautas-autodesarrollo",
  orden: 35,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "💼 Apoyándote En La Valoración integral",
  subseccion: "El Desarrollo de Competencias",
  titulo: "Pautas para el autodesarrollo por Competencias – Evaluados",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Pautas para el autodesarrollo por Competencias.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/12.png",
  etiquetas: "valoracion, autodesarrollo, competencias",
  notas_internas: "",
})

resourcesV2.push({
  id: "assessment-plan-accion",
  orden: 36,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "💼 Apoyándote En La Valoración integral",
  subseccion: "El Desarrollo de Competencias",
  titulo: "Plan de Acción por Competencias/Evaluados",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Plan de Accion por Competencias.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/13.png",
  etiquetas: "valoracion, plan, accion, competencias",
  notas_internas: "",
})

resourcesV2.push({
  id: "assessment-taller-ppt",
  orden: 37,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "💼 Apoyándote En La Valoración integral",
  subseccion: "El Desarrollo de Competencias",
  titulo: "PPT Taller de Autodesarrollo por Competencias/Evaluados",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PowerPoint",
  url_documento: "/documentos/PPT Taller de Autodesarrollo por Competencias.pptx",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/2.png",
  etiquetas: "valoracion, taller, autodesarrollo, ppt",
  notas_internas: "Archivo PowerPoint",
})

resourcesV2.push({
  id: "assessment-manual-autodesarrollo",
  orden: 38,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "💼 Apoyándote En La Valoración integral",
  subseccion: "El Desarrollo de Competencias",
  titulo: "Manual de Autodesarrollo por Competencias",
  descripcion: "",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Manual de Autodesarrollo por Competencias.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/9.png",
  etiquetas: "valoracion, manual, autodesarrollo, competencias",
  notas_internas: "",
})

// ============================================================================
// ESTUDIOS E INVESTIGACIONES
// ============================================================================
resourcesV2.push({
  id: "research-trends",
  orden: 39,
  activo: "SÍ",
  paso: "",
  titulo_paso: "",
  seccion: "🔬 Estudios e Investigaciones",
  subseccion: "",
  titulo: "Trends by Multiplicity",
  descripcion: "Descubre hallazgos y tendencias en gestión de talento, competencias profesionales y desarrollo organizacional.",
  texto_boton: "Ver Documento",
  tipo_accion: "Descargar PDF",
  url_documento: "/documentos/Trends by Multiplicity.pdf",
  url_video_youtube: "",
  imagen_miniatura: "/clientes/Trends.png",
  etiquetas: "investigacion, trends, tendencias",
  notas_internas: "Documento destacado - hero layout",
})

// ============================================================================
// FUNCIONES DE EXPORTACIÓN
// ============================================================================

function escapeCSV(value: string | number): string {
  if (typeof value === "number") {
    return String(value)
  }
  const stringValue = String(value)
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function generateCSVv2(): string {
  const headers = [
    "ID (no editar)",
    "ORDEN",
    "ACTIVO",
    "PASO",
    "Título del Paso",
    "SECCIÓN",
    "Subsección",
    "TÍTULO DEL RECURSO",
    "Descripción",
    "Texto del Botón",
    "Tipo de Acción",
    "URL Documento/Link",
    "ID Video YouTube",
    "Imagen Miniatura",
    "Etiquetas",
    "Notas Internas",
  ]

  const rows = resourcesV2.map((resource) => {
    return [
      resource.id,
      resource.orden,
      resource.activo,
      resource.paso,
      resource.titulo_paso,
      resource.seccion,
      resource.subseccion,
      resource.titulo,
      resource.descripcion,
      resource.texto_boton,
      resource.tipo_accion,
      resource.url_documento,
      resource.url_video_youtube,
      resource.imagen_miniatura,
      resource.etiquetas,
      resource.notas_internas,
    ]
      .map(escapeCSV)
      .join(",")
  })

  return [headers.join(","), ...rows].join("\n")
}

function generateJSONv2(): string {
  return JSON.stringify(resourcesV2, null, 2)
}

// ============================================================================
// EXPORTAR DATOS
// ============================================================================

if (typeof window === "undefined") {
  const fs = require("fs")
  const path = require("path")

  const outputDir = path.join(__dirname, "..")
  const csvPath = path.join(outputDir, "resources_seed_v2.csv")
  const jsonPath = path.join(outputDir, "resources_seed_v2.json")

  fs.writeFileSync(csvPath, generateCSVv2(), "utf8")
  fs.writeFileSync(jsonPath, generateJSONv2(), "utf8")

  console.log("✅ Archivos V2 generados exitosamente:")
  console.log(`   - ${csvPath}`)
  console.log(`   - ${jsonPath}`)
  console.log(`\n📊 Mejoras implementadas:`)
  console.log(`   ✓ Nombres de columnas en español y más descriptivos`)
  console.log(`   ✓ Campo "ACTIVO" con valores SÍ/NO (más intuitivo que true/false)`)
  console.log(`   ✓ Campo "ORDEN" simple (números del 1-39)`)
  console.log(`   ✓ Separación clara entre URL documento y ID de YouTube`)
  console.log(`   ✓ Campo "Tipo de Acción" con valores descriptivos`)
  console.log(`   ✓ Campo "Notas Internas" para comentarios del equipo`)
  console.log(`   ✓ Emojis en nombres de secciones para mejor visualización`)
  console.log(`\n📝 Total de recursos: ${resourcesV2.length}`)
} else {
  ;(window as any).generateCSVv2 = generateCSVv2
  ;(window as any).generateJSONv2 = generateJSONv2
  ;(window as any).resourcesV2 = resourcesV2
}

export { resourcesV2, generateCSVv2, generateJSONv2 }
