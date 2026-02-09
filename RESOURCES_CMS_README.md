# Mini-CMS de Recursos - Google Sheets

Este documento describe el proceso de extracción y gestión del contenido del portal de recursos de clientes mediante Google Sheets.

## 📊 Resumen de Extracción

### Archivos Generados

- **`resources_seed.csv`** - Archivo CSV listo para importar a Google Sheets (39 recursos)
- **`resources_seed.json`** - Backup en formato JSON con la misma información
- **`scripts/extract-resources.ts`** - Script TypeScript para regenerar los datos

### Estadísticas del Portal

- **Total de recursos extraídos:** 39
- **Pasos principales:** 4
- **Secciones adicionales:** 6

### Desglose por Sección

#### Caso de Uso
- 1 recurso (Tour general de la plataforma)

#### Paso 1: Creación de los perfiles
- 3 recursos (2 guías PDF + 1 video tutorial)

#### Paso 2: Creación de Procesos de Evaluación
- 6 recursos (6 videos tutoriales)
  - Gestión de Usuarios
  - Comparativo
  - Índice y Tendencias
  - Creación de Procesos y Configuración
  - Gestión de Participantes
  - Duplicar Procesos

#### Paso 3: Envío de Invitaciones a candidatos
- 3 recursos (3 videos tutoriales)
  - Invitaciones por Correo
  - Invitaciones por Credenciales
  - Estado de Pruebas y Reinicio

#### Paso 4: Generación de Reportes
- 3 recursos (2 guías PDF + 1 video)

#### Interpretación de Resultados
- 2 recursos (2 guías PDF con opción de video)

#### Agendar Cita
- 1 recurso (CTA a Cal.com)

#### Manuales
- 6 recursos (6 documentos PDF)
  - Requerimientos Técnicos
  - Manual Funcional
  - 4 guías de orientación para aplicación de tests

#### Nuestras bases conceptuales
- 5 recursos (5 documentos PDF)
  - Diccionario de Comportamientos
  - Competencias
  - Pensamiento Analítico y Sistémico
  - Motivadores
  - Fichas Técnicas

#### Apoyándote En La Valoración integral
- 8 recursos (7 PDF + 1 Excel)
  - Guías de entrevista
  - Metodología de aplicación
  - Retroalimentación
  - Plan de sucesión
  - Autodesarrollo y planes de acción

#### Estudios e Investigaciones
- 1 recurso (Trends by Multiplicity PDF)

## 📋 Estructura del Google Sheet

### Headers (Columnas)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | string | Identificador único estable (slug) |
| `step_number` | number/string | Número del paso (1-4) o vacío |
| `step_title` | string | Título del paso |
| `section_title` | string | Título de la sección |
| `subsection_title` | string | Título de subsección (opcional) |
| `card_title` | string | Título de la tarjeta/recurso |
| `card_description` | string | Descripción adicional (opcional) |
| `cta_label` | string | Texto del botón (ej: "Ver Tutorial") |
| `cta_type` | enum | Tipo: tutorial, download, external, internal, none |
| `cta_url` | string | URL absoluta o ruta interna |
| `thumbnail_url` | string | URL de imagen de preview |
| `media_type` | enum | Tipo: video, pdf, link, page, none |
| `media_url` | string | URL del recurso multimedia |
| `layout_type` | string | Tipo de layout (card_grid, hero_video, etc.) |
| `order_index` | number | Índice de orden (0-38) |
| `is_active` | boolean | TRUE/FALSE para activar/desactivar |
| `tags` | string | Tags separados por comas |

## 🚀 Cómo Importar a Google Sheets

### Opción 1: Importación Manual (Recomendada)

1. **Crear nuevo Google Sheet**
   - Ve a [sheets.google.com](https://sheets.google.com)
   - Crea una nueva hoja de cálculo
   - Nómbrala "Multiplicity - Portal de Recursos"

2. **Importar el CSV**
   - En el menú: `Archivo` → `Importar`
   - Sube el archivo `resources_seed.csv`
   - Configuración de importación:
     - **Ubicación de importación:** Reemplazar hoja de cálculo actual
     - **Tipo de separador:** Detectar automáticamente (debería ser coma)
     - **Convertir texto a números, fechas y fórmulas:** ✅ Activado
   - Haz clic en `Importar datos`

3. **Formatear la hoja (opcional pero recomendado)**
   - Congela la fila 1 (headers): `Ver` → `Congelar` → `1 fila`
   - Aplica formato a los headers:
     - Fondo: Color oscuro (ej: #1B1733)
     - Texto: Blanco
     - Negrita
   - Ajusta el ancho de las columnas automáticamente
   - Aplica filtros: Selecciona fila 1 → `Datos` → `Crear un filtro`

4. **Validación de datos (opcional)**
   - Para `cta_type`: Crear lista desplegable con valores: tutorial, download, external, internal, none
   - Para `media_type`: Crear lista desplegable con valores: video, pdf, link, page, none
   - Para `is_active`: Usar checkbox (TRUE/FALSE)

### Opción 2: Google Apps Script (Avanzado)

Si prefieres automatizar la creación del Sheet con formato:

```javascript
function createResourcesSheet() {
  const ss = SpreadsheetApp.create('Multiplicity - Portal de Recursos');
  const sheet = ss.getActiveSheet();
  
  // Headers
  const headers = [
    'id', 'step_number', 'step_title', 'section_title', 'subsection_title',
    'card_title', 'card_description', 'cta_label', 'cta_type', 'cta_url',
    'thumbnail_url', 'media_type', 'media_url', 'layout_type', 'order_index',
    'is_active', 'tags'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formato de headers
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground('#1B1733')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold');
  
  // Congelar primera fila
  sheet.setFrozenRows(1);
  
  // Ajustar columnas
  sheet.autoResizeColumns(1, headers.length);
  
  Logger.log('Sheet creado: ' + ss.getUrl());
}
```

## 🔄 Cómo Regenerar los Datos

Si necesitas actualizar el seed con nuevos recursos o cambios:

1. **Editar el script**
   ```bash
   # Abre el archivo
   code scripts/extract-resources.ts
   ```

2. **Modificar los recursos**
   - Agrega nuevos recursos al array `resources`
   - Actualiza recursos existentes
   - Mantén el formato de la interfaz `Resource`

3. **Ejecutar el script**
   ```bash
   # Desde la raíz del proyecto
   npx tsx scripts/extract-resources.ts
   
   # O con Node.js directamente
   node scripts/extract-resources.ts
   ```

4. **Verificar los archivos generados**
   - `resources_seed.csv` - Actualizado
   - `resources_seed.json` - Actualizado

5. **Re-importar a Google Sheets**
   - Sigue los pasos de importación manual
   - Selecciona "Reemplazar datos actuales"

## 🎯 Uso del CMS

### Gestión de Contenido

Una vez importado a Google Sheets, puedes:

1. **Agregar nuevos recursos**
   - Agrega una nueva fila
   - Completa todos los campos obligatorios
   - Asigna un `order_index` único
   - Marca `is_active` como TRUE

2. **Editar recursos existentes**
   - Modifica cualquier campo directamente
   - Los cambios se reflejarán cuando el portal consuma el Sheet

3. **Desactivar recursos temporalmente**
   - Cambia `is_active` a FALSE
   - El recurso no se mostrará en el portal

4. **Reordenar recursos**
   - Modifica el valor de `order_index`
   - Números menores aparecen primero

### Filtros Útiles

- **Por paso:** Filtrar columna `step_number` (1, 2, 3, 4)
- **Por tipo de CTA:** Filtrar columna `cta_type`
- **Por tipo de media:** Filtrar columna `media_type`
- **Activos solamente:** Filtrar `is_active` = TRUE
- **Por tags:** Buscar en columna `tags`

## 🔗 Integración con el Portal

### Próximos Pasos (Implementación)

Para conectar el portal con Google Sheets:

1. **Publicar el Sheet como CSV**
   - `Archivo` → `Compartir` → `Publicar en la web`
   - Selecciona la pestaña y formato CSV
   - Copia la URL pública

2. **Crear función de fetch en el portal**
   ```typescript
   // lib/google-sheets.ts
   export async function fetchResources() {
     const SHEET_URL = 'TU_URL_PUBLICA_CSV';
     const response = await fetch(SHEET_URL);
     const csv = await response.text();
     return parseCSV(csv);
   }
   ```

3. **Actualizar componentes para consumir los datos**
   - Reemplazar arrays hardcodeados con llamadas a `fetchResources()`
   - Implementar caché para optimizar performance
   - Agregar revalidación periódica (ISR en Next.js)

## 📝 Notas Importantes

### Campos No Encontrados

Todos los campos están completos. No hay campos faltantes en la extracción actual.

### URLs de Videos

Algunos videos usan el ID placeholder `dQw4w9WgXcQ`. Estos deben ser reemplazados con los IDs reales de YouTube cuando estén disponibles.

### Rutas de Documentos

Todas las rutas de documentos siguen el patrón `/documentos/[nombre].pdf`. Verifica que estos archivos existan en la carpeta `public/documentos/`.

### Imágenes Thumbnail

Las rutas de imágenes están en:
- `/clientes/` - Imágenes de recursos
- `/images/` - Imágenes de manuales
- `/nuevo-clientes/` - Imágenes nuevas
- Raíz `/` - Imágenes de dashboards

## ✅ Validación

### Checklist de Verificación

- [x] 39 recursos extraídos
- [x] Orden visual mantenido (order_index 0-38)
- [x] IDs únicos y estables (formato slug)
- [x] Todos los campos requeridos completos
- [x] No hay duplicados de ID
- [x] CSV válido y listo para importar
- [x] JSON de backup generado
- [x] Script de regeneración funcional

## 🆘 Soporte

Si encuentras problemas:

1. Verifica que el CSV se importó correctamente
2. Revisa que no haya caracteres especiales mal codificados
3. Asegúrate de que las URLs sean válidas
4. Confirma que los archivos referenciados existan

Para regenerar desde cero:
```bash
rm resources_seed.csv resources_seed.json
npx tsx scripts/extract-resources.ts
```

---

**Última actualización:** Febrero 2026  
**Versión del seed:** 1.0.0  
**Total de recursos:** 39
