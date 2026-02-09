/**
 * Generador de CMS V3 - Súper Simplificado
 * CSV optimizado para ser usado como CMS por usuarios no técnicos
 */

interface CMSResource {
  // CONTROL
  mostrar: string // "SÍ" o "NO"
  orden: number

  // ORGANIZACIÓN
  seccion: string
  paso?: string // "1", "2", "3", "4" o vacío
  subseccion?: string

  // CONTENIDO
  titulo: string
  descripcion?: string
  texto_boton: string

  // TIPO DE RECURSO
  tipo: string // "Video", "PDF", "Excel", "PowerPoint", "Link"

  // RECURSOS
  url_video_youtube?: string // Solo ID: "ABC123"
  url_archivo?: string // /documentos/archivo.pdf o https://...
  imagen?: string // /clientes/imagen.jpg o https://...

  // NOTAS
  notas?: string
}

const recursos: CMSResource[] = []

// =============================================================================
// 🎯 SECCIÓN: INTRODUCCIÓN
// =============================================================================

recursos.push({
  mostrar: "SÍ",
  orden: 1,
  seccion: "🎯 Introducción",
  titulo: "Caso de uso multiplicity",
  descripcion: "Una orientación sobre los contenidos y tutoriales que te permitirán un uso efectivo de la herramienta de evaluación.",
  texto_boton: "",
  tipo: "Sección",
  notas: "Esta es la sección hero principal. Título y descripción se muestran grandes.",
})

recursos.push({
  mostrar: "SÍ",
  orden: 2,
  seccion: "🎯 Introducción",
  titulo: "Tour general de la plataforma",
  texto_boton: "Ver Video",
  tipo: "Video",
  url_video_youtube: "pfDyegdtG2E",
  notas: "Video de introducción principal",
})

// =============================================================================
// 📝 PASO 1: CREACIÓN DE PERFILES
// =============================================================================

recursos.push({
  mostrar: "SÍ",
  orden: 10,
  seccion: "📝 Paso 1",
  paso: "1",
  titulo: "Creación de los perfiles",
  descripcion: "",
  texto_boton: "",
  tipo: "Sección",
  notas: "Título del Paso 1. Aparece con número grande.",
})

recursos.push({
  mostrar: "SÍ",
  orden: 11,
  seccion: "📝 Paso 1",
  paso: "1",
  titulo: "Guía para definir perfiles",
  texto_boton: "Descargar Guía",
  tipo: "PDF",
  url_archivo: "/documentos/Guia-Definir-Perfiles.pdf",
  imagen: "/clientes/guia de perfiles.jpeg",
})

recursos.push({
  mostrar: "SÍ",
  orden: 12,
  seccion: "📝 Paso 1",
  paso: "1",
  titulo: "Perfiles predeterminados OIT",
  texto_boton: "Descargar Guía",
  tipo: "PDF",
  url_archivo: "/documentos/Perfiles-OIT.pdf",
  imagen: "/clientes/perfiles oit.jpeg",
  notas: "Perfiles estándar de la OIT",
})

recursos.push({
  mostrar: "SÍ",
  orden: 13,
  seccion: "📝 Paso 1",
  paso: "1",
  titulo: "Creación de Perfiles",
  texto_boton: "Ver Tutorial",
  tipo: "Video",
  url_video_youtube: "SPbDhWks5k0",
  imagen: "/profile-comparison-dashboard.jpg",
})

// =============================================================================
// 📝 PASO 2: PROCESOS DE EVALUACIÓN
// =============================================================================

recursos.push({
  mostrar: "SÍ",
  orden: 20,
  seccion: "📝 Paso 2",
  paso: "2",
  titulo: "Creación de Procesos de Evaluación",
  descripcion: "",
  texto_boton: "",
  tipo: "Sección",
})

recursos.push({
  mostrar: "SÍ",
  orden: 21,
  seccion: "📝 Paso 2",
  paso: "2",
  titulo: "Gestión de Usuarios",
  texto_boton: "Ver Tutorial",
  tipo: "Video",
  url_video_youtube: "lTX96_VH7nY",
  imagen: "/clean-user-management-dashboard.jpg",
})

recursos.push({
  mostrar: "SÍ",
  orden: 22,
  seccion: "📝 Paso 2",
  paso: "2",
  titulo: "Comparativo",
  texto_boton: "Ver Tutorial",
  tipo: "Video",
  url_video_youtube: "pVzVMefVTJU",
  imagen: "/profile-comparison-dashboard.jpg",
})

recursos.push({
  mostrar: "SÍ",
  orden: 23,
  seccion: "📝 Paso 2",
  paso: "2",
  titulo: "Índice y Tendencias",
  texto_boton: "Ver Tutorial",
  tipo: "Video",
  url_video_youtube: "dQw4w9WgXcQ",
  imagen: "/evaluation-workflow-builder.jpg",
  notas: "⚠️ PENDIENTE: Reemplazar ID de YouTube real",
})

recursos.push({
  mostrar: "SÍ",
  orden: 24,
  seccion: "📝 Paso 2",
  paso: "2",
  titulo: "Creación de Procesos de Evaluación y Configuración de Pruebas",
  texto_boton: "Ver Tutorial",
  tipo: "Video",
  url_video_youtube: "tO1sRoO8Arc",
  imagen: "/evaluation-workflow-builder.jpg",
})

recursos.push({
  mostrar: "SÍ",
  orden: 25,
  seccion: "📝 Paso 2",
  paso: "2",
  titulo: "Gestión de Participantes",
  texto_boton: "Ver Tutorial",
  tipo: "Video",
  url_video_youtube: "oTV_B7H1kD8",
  imagen: "/participant-management-interface.jpg",
})

recursos.push({
  mostrar: "SÍ",
  orden: 26,
  seccion: "📝 Paso 2",
  paso: "2",
  titulo: "Duplicar Procesos",
  texto_boton: "Ver Tutorial",
  tipo: "Video",
  url_video_youtube: "WGBNbEdzGlI",
  imagen: "/process-duplication-workflow.jpg",
})

// =============================================================================
// 📝 PASO 3: ENVÍO DE INVITACIONES
// =============================================================================

recursos.push({
  mostrar: "SÍ",
  orden: 30,
  seccion: "📝 Paso 3",
  paso: "3",
  titulo: "Envío de Invitaciones a candidatos",
  descripcion: "",
  texto_boton: "",
  tipo: "Sección",
})

recursos.push({
  mostrar: "SÍ",
  orden: 31,
  seccion: "📝 Paso 3",
  paso: "3",
  titulo: "Envío de Invitaciones por Correo Electrónico",
  texto_boton: "Ver Tutorial",
  tipo: "Video",
  url_video_youtube: "dQw4w9WgXcQ",
  imagen: "/email-invitation-workflow-dashboard.jpg",
  notas: "⚠️ PENDIENTE: Reemplazar ID de YouTube real",
})

recursos.push({
  mostrar: "SÍ",
  orden: 32,
  seccion: "📝 Paso 3",
  paso: "3",
  titulo: "Envío de Invitaciones por Credenciales de Acceso",
  texto_boton: "Ver Tutorial",
  tipo: "Video",
  url_video_youtube: "dQw4w9WgXcQ",
  imagen: "/credential-invitation-interface.jpg",
  notas: "⚠️ PENDIENTE: Reemplazar ID de YouTube real",
})

recursos.push({
  mostrar: "SÍ",
  orden: 33,
  seccion: "📝 Paso 3",
  paso: "3",
  titulo: "Estado de las Pruebas y Reinicio",
  texto_boton: "Ver Tutorial",
  tipo: "Video",
  url_video_youtube: "dQw4w9WgXcQ",
  imagen: "/evaluation-progress-status-dashboard.jpg",
  notas: "⚠️ PENDIENTE: Reemplazar ID de YouTube real",
})

// =============================================================================
// 📝 PASO 4: GENERACIÓN DE REPORTES
// =============================================================================

recursos.push({
  mostrar: "SÍ",
  orden: 40,
  seccion: "📝 Paso 4",
  paso: "4",
  titulo: "Generación de Reportes",
  descripcion: "",
  texto_boton: "",
  tipo: "Sección",
})

recursos.push({
  mostrar: "SÍ",
  orden: 41,
  seccion: "📝 Paso 4",
  paso: "4",
  titulo: "Descarga Reportes Individuales",
  texto_boton: "Descargar Guía",
  tipo: "PDF",
  url_archivo: "/documentos/tutorial-reportes-individuales.pdf",
  imagen: "/individual-assessment-report-dashboard.jpg",
})

recursos.push({
  mostrar: "SÍ",
  orden: 42,
  seccion: "📝 Paso 4",
  paso: "4",
  titulo: "Descarga Reportes Grupales",
  texto_boton: "Descargar Guía",
  tipo: "PDF",
  url_archivo: "/documentos/tutorial-reportes-grupales.pdf",
  imagen: "/group-performance-analytics-dashboard.jpg",
})

recursos.push({
  mostrar: "SÍ",
  orden: 43,
  seccion: "📝 Paso 4",
  paso: "4",
  titulo: "Video de Utilidad de los Reportes",
  texto_boton: "Ver Video",
  tipo: "Video",
  url_video_youtube: "dQw4w9WgXcQ",
  imagen: "/individual-assessment-report-dashboard.jpg",
  notas: "⚠️ PENDIENTE: Reemplazar ID de YouTube real",
})

// =============================================================================
// 📊 INTERPRETACIÓN DE RESULTADOS
// =============================================================================

recursos.push({
  mostrar: "SÍ",
  orden: 50,
  seccion: "📊 Interpretación de Resultados",
  titulo: "Interpretación de Resultados",
  descripcion: "Guías y videos para interpretar los resultados de las evaluaciones de manera efectiva.",
  texto_boton: "",
  tipo: "Sección",
})

recursos.push({
  mostrar: "SÍ",
  orden: 51,
  seccion: "📊 Interpretación de Resultados",
  titulo: "Guía de Interpretación Individual de Resultados Empresa y Candidato",
  texto_boton: "Descargar Guía",
  tipo: "PDF",
  url_archivo: "/documentos/tutorial-guia-interpretacion-individual.pdf",
  imagen: "/individual-assessment-report-dashboard.jpg",
})

recursos.push({
  mostrar: "SÍ",
  orden: 52,
  seccion: "📊 Interpretación de Resultados",
  titulo: "Guía de Interpretación de Resultados Grupales Empresa",
  texto_boton: "Descargar Guía",
  tipo: "PDF",
  url_archivo: "/documentos/tutorial-guia-interpretacion-grupal.pdf",
  imagen: "/group-performance-analytics-dashboard.jpg",
})

// =============================================================================
// 📅 AGENDAR CITA
// =============================================================================

recursos.push({
  mostrar: "SÍ",
  orden: 60,
  seccion: "📅 Agendar Cita",
  titulo: "¿Deseas que te acompañemos en algunos de estos pasos?",
  descripcion: "Agenda una cita con nosotros",
  texto_boton: "Agendar Cita",
  tipo: "Link",
  url_archivo: "https://cal.com/carlos-santos/30min",
  notas: "CTA para agendar reunión",
})

// =============================================================================
// 📚 MANUALES
// =============================================================================

recursos.push({
  mostrar: "SÍ",
  orden: 70,
  seccion: "📚 Manuales",
  titulo: "Manuales",
  descripcion: "",
  texto_boton: "",
  tipo: "Sección",
})

recursos.push({
  mostrar: "SÍ",
  orden: 71,
  seccion: "📚 Manuales",
  titulo: "Requerimientos Técnicos",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Requerimientos Tecnicos Plataforma Multiplicity.pdf",
  imagen: "/images/Requerimientos Tecnico de la plataforma.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 72,
  seccion: "📚 Manuales",
  titulo: "Manual Funcional de la Plataforma",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Manual Funcional de la Plataforma.pdf",
  imagen: "/images/Manual Funcional de la plataforma.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 73,
  seccion: "📚 Manuales",
  subseccion: "Orientaciones para la aplicación de los Test",
  titulo: "Recomendaciones antes de completar Multiplicity - Participante Básico",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Recomendaciones antes de completar Multiplicity - Participante Basico.pdf",
  imagen: "/clientes/2.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 74,
  seccion: "📚 Manuales",
  subseccion: "Orientaciones para la aplicación de los Test",
  titulo: "Aplicación Presencial de Facilitadores – Proceso Básico",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Aplicacion Presencial de Facilitadores - Proceso Basico.pdf",
  imagen: "/clientes/3.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 75,
  seccion: "📚 Manuales",
  subseccion: "Orientaciones para la aplicación de los Test",
  titulo: "Recomendaciones antes de completar Multiplicity – Participante Plus",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Recomendaciones antes de completar Multiplicity - Participante Plus.pdf",
  imagen: "/clientes/4.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 76,
  seccion: "📚 Manuales",
  subseccion: "Orientaciones para la aplicación de los Test",
  titulo: "Tutorial Aplicación Presencial de Facilitadores – Proceso Plus",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Tutorial Aplicacion Presencial de Facilitadores - Proceso Plus.pdf",
  imagen: "/clientes/5.png",
})

// =============================================================================
// 🧠 BASES CONCEPTUALES
// =============================================================================

recursos.push({
  mostrar: "SÍ",
  orden: 80,
  seccion: "🧠 Bases Conceptuales",
  titulo: "Nuestras bases conceptuales",
  descripcion: "Fundamentos teóricos que sustentan las evaluaciones y metodologías aplicadas en la plataforma.",
  texto_boton: "",
  tipo: "Sección",
})

recursos.push({
  mostrar: "SÍ",
  orden: 81,
  seccion: "🧠 Bases Conceptuales",
  titulo: "Diccionario de Comportamientos",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Diccionario de Comportamientos.pdf",
  imagen: "/nuevo-clientes/Diccionario de Comportamientos portada.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 82,
  seccion: "🧠 Bases Conceptuales",
  titulo: "Competencias",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Competencias.pdf",
  imagen: "/clientes/Diccionario de Competencias Multiplicity 1.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 83,
  seccion: "🧠 Bases Conceptuales",
  titulo: "Pensamiento Analítico y Sistémico",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Pensamiento Analitico y Sistemico.pdf",
  imagen: "/clientes/Diccionario de pensamiento anaco y sistémico - Multiplicity 1.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 84,
  seccion: "🧠 Bases Conceptuales",
  titulo: "Motivadores",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Motivadores.pdf",
  imagen: "/clientes/Diccionario-de-motivadores-Multiplicity 1.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 85,
  seccion: "🧠 Bases Conceptuales",
  titulo: "Fichas Técnicas de las Pruebas",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Fichas Tecnicas de las Pruebas.pdf",
  imagen: "/clientes/6.png",
})

// =============================================================================
// 💼 VALORACIÓN INTEGRAL
// =============================================================================

recursos.push({
  mostrar: "SÍ",
  orden: 90,
  seccion: "💼 Valoración Integral",
  titulo: "Apoyándote En La Valoración integral",
  descripcion: "Herramientas y guías para maximizar el valor de tus procesos de evaluación y desarrollo de talento.",
  texto_boton: "",
  tipo: "Sección",
})

recursos.push({
  mostrar: "SÍ",
  orden: 91,
  seccion: "💼 Valoración Integral",
  subseccion: "La Evaluación Contraste: La Entrevista",
  titulo: "Guía de Entrevista por Competencias",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Guia de Entrevista por Competencias.pdf",
  imagen: "/clientes/6.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 92,
  seccion: "💼 Valoración Integral",
  subseccion: "La Evaluación Contraste: La Entrevista",
  titulo: "Metodología de Aplicación de la Entrevista",
  texto_boton: "Ver Documento",
  tipo: "Excel",
  url_archivo: "/documentos/Metodologia de Aplicacion.xlsx",
  imagen: "/clientes/8.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 93,
  seccion: "💼 Valoración Integral",
  subseccion: "Compartiendo los Resultados",
  titulo: "Guía de Retroalimentación por Competencias",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Guia de Retroalimentacion por Competencias.pdf",
  imagen: "/clientes/10.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 94,
  seccion: "💼 Valoración Integral",
  subseccion: "Convirtiendo los Datos de Evaluación en Entendimiento",
  titulo: "Ideas para un Plan de Sucesión",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Ideas para un Plan de Sucesion.pdf",
  imagen: "/clientes/11.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 95,
  seccion: "💼 Valoración Integral",
  subseccion: "El Desarrollo de Competencias",
  titulo: "Pautas para el autodesarrollo por Competencias – Evaluados",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Pautas para el autodesarrollo por Competencias.pdf",
  imagen: "/clientes/12.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 96,
  seccion: "💼 Valoración Integral",
  subseccion: "El Desarrollo de Competencias",
  titulo: "Plan de Acción por Competencias/Evaluados",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Plan de Accion por Competencias.pdf",
  imagen: "/clientes/13.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 97,
  seccion: "💼 Valoración Integral",
  subseccion: "El Desarrollo de Competencias",
  titulo: "PPT Taller de Autodesarrollo por Competencias/Evaluados",
  texto_boton: "Ver Documento",
  tipo: "PowerPoint",
  url_archivo: "/documentos/PPT Taller de Autodesarrollo por Competencias.pptx",
  imagen: "/clientes/2.png",
})

recursos.push({
  mostrar: "SÍ",
  orden: 98,
  seccion: "💼 Valoración Integral",
  subseccion: "El Desarrollo de Competencias",
  titulo: "Manual de Autodesarrollo por Competencias",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Manual de Autodesarrollo por Competencias.pdf",
  imagen: "/clientes/9.png",
})

// =============================================================================
// 🔬 INVESTIGACIONES
// =============================================================================

recursos.push({
  mostrar: "SÍ",
  orden: 100,
  seccion: "🔬 Investigaciones",
  titulo: "Estudios e Investigaciones",
  descripcion: "Descubre hallazgos y tendencias en gestión de talento, competencias profesionales y desarrollo organizacional.",
  texto_boton: "",
  tipo: "Sección",
})

recursos.push({
  mostrar: "SÍ",
  orden: 101,
  seccion: "🔬 Investigaciones",
  titulo: "Trends by Multiplicity",
  texto_boton: "Ver Documento",
  tipo: "PDF",
  url_archivo: "/documentos/Trends by Multiplicity.pdf",
  imagen: "/clientes/Trends.png",
})

// =============================================================================
// FUNCIONES DE EXPORTACIÓN
// =============================================================================

function escapeCSV(value: any): string {
  if (value === undefined || value === null) return ""
  const stringValue = String(value)
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function generateCSVv3(): string {
  // Headers con instrucciones
  const instructionRows = [
    "INSTRUCCIONES: Este archivo controla TODO el contenido del portal de recursos",
    "",
    "CÓMO USAR:",
    "1. MOSTRAR: Cambia a NO para ocultar un recurso",
    "2. ORDEN: Cambia el número para reordenar (más bajo aparece primero)",
    "3. SECCIÓN: Agrupa recursos (usa el mismo nombre para agrupar)",
    "4. PASO: Solo para pasos 1-4 (deja vacío para otras secciones)",
    "5. SUBSECCIÓN: Opcional - agrupa dentro de una sección",
    "6. TÍTULO: El texto principal que ve el usuario",
    "7. DESCRIPCIÓN: Texto adicional (solo para secciones principales)",
    "8. TEXTO BOTÓN: Qué dice el botón (ej: Ver Video, Descargar)",
    "9. TIPO: Video, PDF, Excel, PowerPoint, Link, o Sección",
    "10. URL VIDEO: Solo el ID de YouTube (ej: ABC123)",
    "11. URL ARCHIVO: Ruta del archivo o link completo",
    "12. IMAGEN: Ruta de la imagen de portada",
    "13. NOTAS: Para tu uso interno (no se muestra en el portal)",
    "",
    "PARA AGREGAR NUEVO RECURSO:",
    "1. Copia una fila similar",
    "2. Cambia el ORDEN a un número nuevo",
    "3. Completa los campos",
    "4. Guarda",
    "",
    "PARA ELIMINAR:",
    "Cambia MOSTRAR a NO (no borres la fila)",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
  ]

  const headers = [
    "MOSTRAR",
    "ORDEN",
    "SECCIÓN",
    "PASO",
    "SUBSECCIÓN",
    "TÍTULO",
    "DESCRIPCIÓN",
    "TEXTO BOTÓN",
    "TIPO",
    "URL VIDEO (ID YouTube)",
    "URL ARCHIVO",
    "IMAGEN",
    "NOTAS",
  ]

  const dataRows = recursos.map((r) => {
    return [
      r.mostrar,
      r.orden,
      r.seccion,
      r.paso || "",
      r.subseccion || "",
      r.titulo,
      r.descripcion || "",
      r.texto_boton,
      r.tipo,
      r.url_video_youtube || "",
      r.url_archivo || "",
      r.imagen || "",
      r.notas || "",
    ]
      .map(escapeCSV)
      .join(",")
  })

  return [...instructionRows, headers.join(","), ...dataRows].join("\n")
}

function generateJSONv3(): string {
  return JSON.stringify(recursos, null, 2)
}

// =============================================================================
// EXPORTAR
// =============================================================================

if (typeof window === "undefined") {
  const fs = require("fs")
  const path = require("path")

  const outputDir = path.join(__dirname, "..")
  const csvPath = path.join(outputDir, "resources_cms_v3.csv")
  const jsonPath = path.join(outputDir, "resources_cms_v3.json")

  fs.writeFileSync(csvPath, generateCSVv3(), "utf8")
  fs.writeFileSync(jsonPath, generateJSONv3(), "utf8")

  console.log("✅ CMS V3 generado exitosamente:")
  console.log(`   - ${csvPath}`)
  console.log(`   - ${jsonPath}`)
  console.log(`\n📊 Mejoras V3:`)
  console.log(`   ✓ Sin campo ID (innecesario)`)
  console.log(`   ✓ Instrucciones incluidas en el CSV`)
  console.log(`   ✓ Campos simplificados y en español`)
  console.log(`   ✓ Separación clara por secciones (ORDEN con gaps)`)
  console.log(`   ✓ Tipo de recurso más claro (Video, PDF, etc)`)
  console.log(`   ✓ URLs separadas por tipo`)
  console.log(`\n📝 Total de recursos: ${recursos.length}`)
}

export { recursos, generateCSVv3, generateJSONv3 }
