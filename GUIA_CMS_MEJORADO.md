# 🎯 Guía del CMS Mejorado - Versión 2.0

## ✅ ¿Qué se mejoró?

### Versión 1 (resources_seed.csv) → Versión 2 (resources_seed_v2.csv)

| Aspecto | ❌ Versión 1 | ✅ Versión 2 (MEJORADA) |
|---------|--------------|-------------------------|
| **Nombres de columnas** | En inglés técnico | En ESPAÑOL claro y descriptivo |
| **Campo activo** | `true/false` | `SÍ/NO` (más natural) |
| **Orden** | `order_index: 0-38` | `ORDEN: 1-39` (empieza en 1) |
| **Videos** | URL completa mezclada | Solo **ID de YouTube** separado |
| **Tipo de acción** | Códigos: `tutorial`, `download` | Descriptivo: `Video Tutorial`, `Descargar PDF` |
| **Secciones** | Texto plano | Con **emojis** para identificación rápida |
| **Notas** | No existía | Campo `Notas Internas` para el equipo |
| **Campos técnicos** | Mezclados | Separados y marcados como "no editar" |

---

## 📋 Estructura del CSV V2 (RECOMENDADO)

### Columnas y Cómo Usarlas

#### 🔒 **No Editar Frecuentemente**

1. **ID (no editar)** - Identificador único técnico
   - Ejemplo: `paso-1-guia-perfiles`
   - ⚠️ Solo cambiar si sabes lo que haces

2. **ORDEN** - Número de 1 a 39
   - Define el orden de aparición en el portal
   - Más bajo = aparece primero
   - ✏️ Editable: Cambia para reordenar recursos

3. **ACTIVO** - `SÍ` o `NO`
   - `SÍ` = Se muestra en el portal
   - `NO` = Oculto (pero no eliminado)
   - ✏️ Editable: Cambia para activar/desactivar

---

#### 📁 **Organización del Portal**

4. **PASO** - Número del paso o vacío
   - `1` = Primer Paso (Creación de perfiles)
   - `2` = Segundo Paso (Procesos de evaluación)
   - `3` = Tercer Paso (Envío de invitaciones)
   - `4` = Cuarto Paso (Generación de reportes)
   - *(vacío)* = No pertenece a ningún paso
   - ✏️ Editable

5. **Título del Paso** - Nombre completo del paso
   - Ejemplo: `Creación de los perfiles`
   - Solo se usa si el campo PASO tiene valor
   - ✏️ Editable

6. **SECCIÓN** - Sección principal con emoji
   - `🎯 Caso de uso multiplicity`
   - `📊 Interpretación de Resultados`
   - `📚 Manuales`
   - `🧠 Nuestras bases conceptuales`
   - `💼 Apoyándote En La Valoración integral`
   - `🔬 Estudios e Investigaciones`
   - ✏️ Editable

7. **Subsección** - Subsección opcional
   - Ejemplo: `Orientaciones para la aplicación de los Test`
   - Dejar vacío si no aplica
   - ✏️ Editable

---

#### 📝 **Contenido Visible**

8. **TÍTULO DEL RECURSO** - Lo que ve el usuario
   - Ejemplo: `Guía para definir perfiles`
   - ✏️ **MUY EDITABLE** - Cambia libremente

9. **Descripción** - Texto adicional (opcional)
   - Aparece debajo del título en algunos layouts
   - Puede estar vacío
   - ✏️ **MUY EDITABLE**

10. **Texto del Botón** - Texto del CTA
    - `Ver Tutorial`
    - `Descargar Guía`
    - `Ver Documento`
    - `Agendar Cita`
    - ✏️ **MUY EDITABLE**

11. **Tipo de Acción** - Qué hace el botón
    - `Video Tutorial` - Abre video de YouTube
    - `Descargar PDF` - Descarga un PDF
    - `Descargar Excel` - Descarga un Excel
    - `Descargar PowerPoint` - Descarga un PPT
    - `Link Externo` - Abre link externo (ej: Cal.com)
    - ✏️ Editable (usar valores de la lista)

---

#### 🔗 **Recursos y Archivos**

12. **URL Documento/Link** - Ruta del archivo o link
    - Para PDFs: `/documentos/nombre-archivo.pdf`
    - Para Excel: `/documentos/nombre-archivo.xlsx`
    - Para links externos: `https://cal.com/...`
    - Dejar vacío si es solo video
    - ✏️ Editable

13. **ID Video YouTube** - Solo el ID del video
    - ✅ Correcto: `pfDyegdtG2E`
    - ❌ Incorrecto: `https://www.youtube.com/embed/pfDyegdtG2E`
    - Dejar vacío si no es video
    - ✏️ Editable

14. **Imagen Miniatura** - Ruta de la imagen
    - Ejemplo: `/clientes/guia de perfiles.jpeg`
    - Puede estar vacía
    - ✏️ Editable

---

#### 🏷️ **Metadatos**

15. **Etiquetas** - Tags separados por comas
    - Ejemplo: `perfiles, guia, paso-1`
    - Para búsquedas y filtros futuros
    - ✏️ Editable

16. **Notas Internas** - Comentarios para el equipo
    - No se muestran en el portal
    - Útil para recordatorios
    - Ejemplo: `⚠️ PENDIENTE: Reemplazar ID de YouTube real`
    - ✏️ **MUY EDITABLE** - Usa libremente

---

## 🚀 Cómo Usar el CSV en Google Sheets

### Paso 1: Importar

1. Crea un nuevo Google Sheet
2. `Archivo` → `Importar` → Sube `resources_seed_v2.csv`
3. Configuración:
   - Separador: Coma
   - Convertir texto: ✅ Activado

### Paso 2: Formatear (Recomendado)

```
1. Congela la fila 1 (headers)
2. Aplica colores a las columnas:
   - Columnas 1-3 (ID, ORDEN, ACTIVO): Gris claro - "No editar mucho"
   - Columnas 4-7 (Organización): Azul claro
   - Columnas 8-11 (Contenido): Verde claro - "Edita aquí"
   - Columnas 12-14 (Recursos): Amarillo claro
   - Columnas 15-16 (Metadatos): Naranja claro
3. Crea filtros en la fila 1
4. Ajusta anchos de columna
```

### Paso 3: Validaciones (Opcional pero Recomendado)

**Columna C (ACTIVO):**
- Datos → Validación de datos
- Criterio: Lista de elementos
- Valores: `SÍ,NO`

**Columna D (PASO):**
- Lista de elementos: `1,2,3,4`
- Permitir vacío: ✅

**Columna K (Tipo de Acción):**
- Lista de elementos:
  ```
  Video Tutorial
  Descargar PDF
  Descargar Excel
  Descargar PowerPoint
  Link Externo
  ```

---

## 📖 Casos de Uso Comunes

### ✅ Agregar un Nuevo Recurso

1. Ve a la última fila (actualmente fila 40)
2. Agrega una nueva fila
3. Completa:
   - **ID**: Crea un slug único (ej: `nuevo-recurso-2026`)
   - **ORDEN**: 40 (o el siguiente número)
   - **ACTIVO**: `SÍ`
   - **PASO**: Si aplica (1-4) o vacío
   - **SECCIÓN**: Elige una existente o crea nueva
   - **TÍTULO DEL RECURSO**: El nombre que verán los usuarios
   - **Texto del Botón**: Ej: `Ver Tutorial`
   - **Tipo de Acción**: Elige de la lista
   - **URL o ID YouTube**: Según corresponda
   - **Etiquetas**: Palabras clave separadas por comas

### ✅ Desactivar un Recurso Temporalmente

1. Encuentra la fila del recurso
2. Cambia columna **ACTIVO** de `SÍ` a `NO`
3. (Opcional) Agrega nota en **Notas Internas**: "Desactivado temporalmente - pendiente actualización"

### ✅ Reordenar Recursos

1. Identifica los recursos que quieres reordenar
2. Cambia los números en la columna **ORDEN**
3. Ejemplo:
   - Si quieres que el recurso #15 aparezca antes que el #10
   - Cambia ORDEN de 15 a 9
   - Y ajusta los demás en consecuencia

### ✅ Cambiar el Texto de un Botón

1. Encuentra la fila del recurso
2. Edita la columna **Texto del Botón**
3. Ejemplos:
   - `Ver Tutorial` → `Ver Video`
   - `Descargar Guía` → `Descargar PDF`
   - `Ver Documento` → `Descargar Documento`

### ✅ Actualizar un Video de YouTube

1. Encuentra la fila del recurso
2. Reemplaza el valor en **ID Video YouTube**
3. Solo pon el ID, no la URL completa
4. Ejemplo: Si la URL es `https://youtube.com/watch?v=ABC123`
   - Solo pon: `ABC123`

### ✅ Agregar Notas para el Equipo

1. Usa la columna **Notas Internas** libremente
2. Ejemplos útiles:
   - `⚠️ PENDIENTE: Actualizar con nuevo PDF`
   - `✅ Revisado por María - 2026-02-03`
   - `📌 Este recurso es muy popular`
   - `🔄 Actualizar cada trimestre`

---

## 🎨 Tips de Organización

### Usa Emojis en Secciones

Los emojis ayudan a identificar rápidamente las secciones:

- 🎯 Caso de uso / Introducción
- 📊 Reportes / Análisis
- 📚 Documentación / Manuales
- 🧠 Conceptual / Teórico
- 💼 Práctico / Aplicación
- 🔬 Investigación / Estudios
- 📅 Acciones / CTAs
- ⚙️ Técnico / Configuración

### Filtros Útiles

**Ver solo recursos activos:**
- Filtrar columna C (ACTIVO) = `SÍ`

**Ver recursos por paso:**
- Filtrar columna D (PASO) = `1`, `2`, `3` o `4`

**Ver solo videos:**
- Filtrar columna K (Tipo de Acción) = `Video Tutorial`

**Ver recursos pendientes:**
- Filtrar columna P (Notas Internas) contiene `PENDIENTE`

### Código de Colores (Sugerido)

En Google Sheets, aplica colores de fondo a las filas:

- 🟢 Verde claro: Recursos completos y activos
- 🟡 Amarillo: Recursos con notas pendientes
- 🔴 Rojo claro: Recursos desactivados
- 🔵 Azul claro: Recursos nuevos (últimos 30 días)

---

## ⚠️ Cosas Importantes a Recordar

### ✅ SÍ Puedes Editar Libremente:

- ✏️ Títulos y descripciones
- ✏️ Texto de botones
- ✏️ Orden de recursos
- ✏️ Activar/desactivar recursos
- ✏️ Notas internas
- ✏️ Etiquetas

### ⚠️ Ten Cuidado al Editar:

- 🔸 IDs (solo si sabes lo que haces)
- 🔸 Rutas de archivos (verifica que existan)
- 🔸 IDs de YouTube (verifica que sean correctos)
- 🔸 Tipo de Acción (usa valores de la lista)

### ❌ NO Hagas:

- ❌ Eliminar la fila de headers
- ❌ Cambiar el orden de las columnas
- ❌ Usar caracteres especiales en IDs
- ❌ Dejar campos obligatorios vacíos (ID, ORDEN, ACTIVO, TÍTULO)

---

## 📊 Comparación de Archivos

### Archivos Generados

| Archivo | Descripción | Uso Recomendado |
|---------|-------------|-----------------|
| `resources_seed.csv` | Versión 1 - Técnica | ❌ No usar - Solo referencia |
| `resources_seed.json` | Versión 1 - JSON | ❌ No usar - Solo referencia |
| **`resources_seed_v2.csv`** | **Versión 2 - Mejorada** | ✅ **USAR ESTE** |
| **`resources_seed_v2.json`** | **Versión 2 - JSON** | ✅ Backup técnico |

---

## 🔄 Cómo Regenerar los Datos

Si necesitas actualizar el seed después de cambios en el código:

```bash
# Desde la raíz del proyecto
npx tsx scripts/extract-resources-v2.ts
```

Esto regenerará:
- `resources_seed_v2.csv`
- `resources_seed_v2.json`

---

## 🎯 Próximos Pasos

### 1. Importar a Google Sheets
- Usa `resources_seed_v2.csv`
- Aplica formato y validaciones
- Comparte con el equipo

### 2. Configurar Permisos
- **Edición**: Solo equipo de contenido
- **Visualización**: Todos los interesados
- **Comentarios**: Todos

### 3. Publicar como CSV
- `Archivo` → `Compartir` → `Publicar en la web`
- Formato: CSV
- Copia la URL pública

### 4. Integrar con el Portal
- Crear función para leer el CSV publicado
- Parsear y renderizar dinámicamente
- Implementar caché (revalidar cada hora)

---

## 📞 Soporte

### Preguntas Frecuentes

**P: ¿Puedo agregar más columnas?**
R: Sí, pero agrégalas al final. No insertes entre las existentes.

**P: ¿Qué pasa si pongo un ID de YouTube incorrecto?**
R: El video no se cargará. Verifica siempre el ID.

**P: ¿Puedo tener dos recursos con el mismo ORDEN?**
R: Técnicamente sí, pero no es recomendable. Usa números únicos.

**P: ¿Cómo sé qué archivos existen en `/documentos/`?**
R: Revisa la carpeta `public/documentos/` en el repositorio.

**P: ¿Puedo usar HTML en las descripciones?**
R: No, usa solo texto plano. El HTML se escapará automáticamente.

---

## ✅ Checklist de Calidad

Antes de publicar cambios, verifica:

- [ ] Todos los recursos activos tienen TÍTULO
- [ ] Los IDs de YouTube son correctos (11 caracteres)
- [ ] Las rutas de documentos existen
- [ ] No hay filas duplicadas
- [ ] El campo ACTIVO es `SÍ` o `NO` (no true/false)
- [ ] Los números de ORDEN son únicos
- [ ] Las imágenes miniatura existen
- [ ] Los recursos pendientes tienen notas explicativas

---

**Versión:** 2.0  
**Fecha:** Febrero 2026  
**Total de recursos:** 39  
**Formato recomendado:** `resources_seed_v2.csv`

¡Listo para usar! 🚀
