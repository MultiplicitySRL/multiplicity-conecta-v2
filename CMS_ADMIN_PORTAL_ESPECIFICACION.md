# Especificación del CMS para Admin Portal (v0) + Supabase

Documento con todos los detalles de la implementación actual del CMS y requisitos para un admin portal que persista en Supabase (crear, editar, eliminar recursos, manejar imágenes y contenido).

---

## 1. Estado actual del CMS (sin Supabase)

- **Fuente de datos:** Google Sheets publicado como CSV.
- **URL del CSV:** definida en `lib/resources-cms-v3.ts` (constante `GOOGLE_SHEET_CSV_URL`).
- **Flujo:** La app llama a `fetchResourcesV3()` (o la API). Se hace fetch al CSV, se parsea con `parseCSVv3()` y se devuelve un array de objetos.
- **API pública:** `GET /api/resources` → devuelve JSON array de recursos (sin caché).
- **No hay Supabase** en el proyecto actualmente; todo es lectura desde Google Sheets.

---

## 2. Modelo de datos (recurso = 1 fila de contenido)

Cada ítem del CMS es un **recurso** con esta forma (TypeScript):

```ts
interface ResourceV3 {
  // Control
  mostrar: boolean        // SÍ/NO en CSV → true/false
  orden: number           // 1, 2, 3... define orden de aparición

  // Organización
  seccion: string         // ej: "🎯 Introducción", "📝 Paso 1", "📊 Interpretación..."
  paso: string           // "1" | "2" | "3" | "4" | "" (vacío si no es paso)
  subseccion: string     // opcional, agrupa dentro de una sección

  // Contenido visible
  titulo: string
  descripcion: string
  texto_boton: string    // ej: "Ver Video", "Descargar Guía"

  // Tipo de recurso
  tipo: string           // "Video" | "PDF" | "Excel" | "PowerPoint" | "Link" | "Sección"

  // URLs / medios
  url_video_youtube: string   // solo ID de YouTube (ej: "pfDyegdtG2E"), no URL completa
  url_archivo: string         // ruta o URL: "/documentos/xxx.pdf" o "https://cal.com/..."
  imagen: string             // ruta imagen: "/clientes/guia.jpeg" o URL externa

  // Interno
  notas: string          // no se muestra en el portal
}
```

**Nota:** En el front actual, `components/dynamic-section.tsx` usa por error `resource.url_documento`; el campo correcto es **`url_archivo`**. En Supabase y en el admin debe usarse siempre `url_archivo`.

---

## 3. Columnas del CSV actual (orden exacto)

El CSV tiene una fila de cabecera (y a veces líneas de instrucciones antes). La fila de headers es la que contiene "MOSTRAR" y "ORDEN". Columnas en orden:

| # | Columna CSV              | Campo en código   |
|---|--------------------------|-------------------|
| 1 | MOSTRAR                  | `mostrar` (SÍ/NO) |
| 2 | ORDEN                    | `orden` (número)  |
| 3 | SECCIÓN                  | `seccion`         |
| 4 | PASO                     | `paso`            |
| 5 | SUBSECCIÓN               | `subseccion`      |
| 6 | TÍTULO                   | `titulo`          |
| 7 | DESCRIPCIÓN              | `descripcion`     |
| 8 | TEXTO BOTÓN              | `texto_boton`     |
| 9 | TIPO                     | `tipo`            |
| 10| URL VIDEO (ID YouTube)   | `url_video_youtube`|
| 11| URL ARCHIVO              | `url_archivo`     |
| 12| IMAGEN                   | `imagen`          |
| 13| NOTAS                    | `notas`           |

---

## 4. Cómo se usa en el front (portal de clientes)

- **Página:** `app/clientes/page-dynamic.tsx` (client component).
- **Carga:** `useEffect` hace `fetch('/api/resources?...')` y guarda el array en estado.
- **Agrupación:**
  - Por `seccion` (ej. Introducción, Interpretación, Manuales, etc.).
  - Por `paso` ("1","2","3","4") para los 4 pasos del tutorial.
  - Los que tienen `tipo === "Sección"` o `"Seccion"` son **headers** de bloque (título/descripción del bloque), no tarjetas.
- **Componentes:**
  - **DynamicStepSection:** lista de recursos de un paso (grid de `DynamicResourceCard`).
  - **DynamicSection:** secciones con subsecciones; muestra cards con imagen, título y click que abre `url_archivo` (en código actual está mal como `url_documento`).
  - **DynamicResourceCard:**
    - Si es Video: muestra imagen/thumbnail, al click reproduce YouTube con `url_video_youtube` (ID).
    - Si es PDF/Excel/PowerPoint/Link: al click abre `url_archivo`.
- **Imágenes:**
  - `imagen` puede ser ruta local (ej. `/clientes/guia de perfiles.jpeg`) o URL externa (http...).
  - Se usa cache-busting con `?v=${resource.orden}` en URLs externas.
  - Fallback: `/placeholder.svg` si falla la carga.

---

## 5. Dónde está cada cosa en el código

| Qué                          | Dónde |
|-----------------------------|--------|
| Interface y fetch desde CSV | `lib/resources-cms-v3.ts` |
| API GET recursos            | `app/api/resources/route.ts` |
| Página que muestra todo    | `app/clientes/page-dynamic.tsx` |
| Card de recurso (video/descarga/link) | `components/dynamic-resource-card.tsx` |
| Sección por pasos (1–4)    | `components/dynamic-step-section.tsx` |
| Sección genérica (manuales, conceptual, etc.) | `components/dynamic-section.tsx` |
| Documentos estáticos       | `public/documentos/` (PDFs, etc.) |
| Imágenes (ej. clientes)    | `public/clientes/`, `public/images/`, etc. |

---

## 6. Qué debe hacer el Admin Portal (v0) y cómo guardar en Supabase

Objetivo: que el usuario pueda **crear, editar, eliminar y reordenar** recursos, **gestionar imágenes y archivos**, y que todo persista en **Supabase**.

### 6.1 Supabase

- **Tabla `resources`** (o `cms_resources`), con:
  - Todos los campos de `ResourceV3` (nombres en snake_case si se prefiere: `url_video_youtube`, `url_archivo`, etc.).
  - `id`: UUID, PK, auto.
  - `created_at`, `updated_at`: timestamptz.
- **Storage:**
  - Bucket **`cms-images`** (o similar): imágenes de portada (`imagen`).
  - Bucket **`cms-documents`** (o similar): PDFs, Excel, PowerPoint; en `url_archivo` guardar la URL pública de Supabase (o path que el front resuelva como URL).

Políticas RLS: solo usuarios autenticados (admin) pueden INSERT/UPDATE/DELETE; para el portal público solo SELECT (o leer vía API que haga SELECT).

### 6.2 Admin: CRUD de recursos

- **Listar:** tabla o lista con filtros por sección, paso, tipo. Ordenar por `orden`.
- **Crear:** formulario con todos los campos de `ResourceV3`. Al guardar → `INSERT` en `resources`.
- **Editar:** mismo formulario cargado con el recurso; al guardar → `UPDATE` por `id`.
- **Eliminar:** borrar por `id` (DELETE). Opcional: “ocultar” poniendo `mostrar = false` en lugar de borrar.
- **Reordenar:** actualizar campo `orden` de los recursos afectados (arrastrar/soltar o inputs numéricos).

### 6.3 Imágenes

- **Subir:** en el formulario de recurso, input de tipo file (imagen) → subir a Supabase Storage (`cms-images`), obtener URL pública.
- **Guardar:** el valor que se persiste en `imagen` debe ser la URL pública del Storage (o la ruta que tu API/Next devuelva como URL). En el portal de clientes ya se soporta `imagen` como URL externa.
- **Eliminar/reemplazar:** opción de borrar archivo del Storage y/o cambiar por otra imagen (nueva subida).

### 6.4 Archivos (PDF, Excel, PowerPoint)

- **Subir:** input file → subir a bucket `cms-documents`, obtener URL pública.
- **Guardar:** ese valor va en `url_archivo`.
- **Tipos:** mantener `tipo` como "PDF" | "Excel" | "PowerPoint" | "Link" | "Video" | "Sección". Para "Link", `url_archivo` puede ser una URL externa (ej. Cal.com) sin subir archivo.

### 6.5 Contenido y organización

- Todos los campos de texto editables: `titulo`, `descripcion`, `texto_boton`, `notas`.
- **Sección / Paso / Subsección:** dropdowns o inputs que rellenen `seccion`, `paso`, `subseccion` (valores que ya usa el front: ver `page-dynamic.tsx`).
- **Tipo:** dropdown con: Video, PDF, Excel, PowerPoint, Link, Sección.
- **Video:** campo para “ID de YouTube” → guardar en `url_video_youtube` (solo el ID, no la URL completa).
- **Mostrar:** checkbox o toggle → `mostrar` (boolean).

---

## 7. Integración del portal actual con Supabase

Para que el portal de clientes deje de usar Google Sheets y use Supabase:

1. **Crear** en Supabase la tabla `resources` y los buckets de Storage.
2. **Migrar** datos: exportar el CSV (o el JSON que ya tienes) e importar a `resources` (script o SQL). Para imágenes/archivos que hoy están en `public/`, decidir si se migran a Storage y se actualizan las URLs en `url_archivo` e `imagen`.
3. **API:** Cambiar `app/api/resources/route.ts` para que en lugar de `fetchResourcesV3()` haga un `SELECT * FROM resources WHERE mostrar = true ORDER BY orden` con el cliente de Supabase y devuelva el mismo JSON (array de objetos con los nombres de `ResourceV3`). Opcional: crear `app/api/admin/resources/route.ts` (o similar) para CRUD con auth.
4. **Cliente Supabase:** instalar `@supabase/supabase-js`, configurar con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (o key con más permisos en server para admin).
5. **Corrección en front:** en `components/dynamic-section.tsx`, reemplazar `resource.url_documento` por `resource.url_archivo` para que los links de las cards funcionen.

---

## 8. Resumen para el prompt de v0

Puedes dar a v0 un prompt como este (ajusta nombres de tabla/buckets si los cambias):

- "Crea un **admin portal** para gestionar recursos de un CMS con este modelo: …" (pega el `ResourceV3` y la tabla `resources` en Supabase).
- "CRUD completo: listar, crear, editar, eliminar y reordenar por campo `orden`."
- "Subida de **imágenes** a Supabase Storage (bucket `cms-images`), guardar la URL en el campo `imagen`."
- "Subida de **documentos** (PDF, Excel, PowerPoint) a Supabase Storage (bucket `cms-documents`), guardar la URL en `url_archivo`. Para tipo 'Link', `url_archivo` es URL externa sin subir archivo."
- "Campo **url_video_youtube**: solo ID de YouTube (11 caracteres), no URL completa."
- "Tipos de recurso: Video, PDF, Excel, PowerPoint, Link, Sección. Todos los campos de texto editables; sección, paso y subsección como en el portal de clientes (Introducción, Paso 1–4, Interpretación, Manuales, etc.)."
- "Persistencia en **Supabase**: tabla `resources` + Storage para imágenes y documentos; el portal público seguirá consumiendo los mismos datos vía API que devuelve este array."

---

**Versión:** 1.0  
**Fecha:** Febrero 2026
