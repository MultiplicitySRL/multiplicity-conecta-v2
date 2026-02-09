# 🎯 CMS V3 - Guía Completa (VERSIÓN FINAL)

## ✅ Nueva Versión Simplificada

El CMS V3 es la versión **definitiva y más fácil de usar**. Eliminamos todo lo innecesario y optimizamos para usuarios no técnicos.

---

## 🎉 Mejoras de V3

### ✅ Lo que Cambió

| Aspecto | V2 | V3 (NUEVA) |
|---------|----|-----------| 
| **Campo ID** | ✅ Tenía | ❌ **Eliminado** (innecesario) |
| **Instrucciones** | En archivo aparte | ✅ **Incluidas en el CSV** |
| **Columnas** | 16 columnas | ✅ **13 columnas** (más simple) |
| **Nombres** | Técnicos | ✅ **Súper claros** |
| **Separación** | Sin gaps | ✅ **ORDEN con gaps** (10, 20, 30...) |
| **Tipo de recurso** | Códigos | ✅ **Descriptivo** (Video, PDF, etc) |
| **URLs** | Mezcladas | ✅ **Separadas** por tipo |

---

## 📋 Estructura del CSV V3

### Columnas (13 en total)

| # | Columna | Descripción | Ejemplo | Editable |
|---|---------|-------------|---------|----------|
| 1 | **MOSTRAR** | Mostrar u ocultar | `SÍ` o `NO` | ✏️ SÍ |
| 2 | **ORDEN** | Orden de aparición | `1`, `2`, `10`, `20` | ✏️ SÍ |
| 3 | **SECCIÓN** | Nombre de la sección | `🎯 Introducción` | ✏️ SÍ |
| 4 | **PASO** | Número del paso | `1`, `2`, `3`, `4` o vacío | ✏️ SÍ |
| 5 | **SUBSECCIÓN** | Subsección opcional | `Orientaciones para...` | ✏️ SÍ |
| 6 | **TÍTULO** | Título del recurso | `Guía para definir perfiles` | ✏️ SÍ |
| 7 | **DESCRIPCIÓN** | Descripción (opcional) | `Fundamentos teóricos...` | ✏️ SÍ |
| 8 | **TEXTO BOTÓN** | Texto del botón | `Ver Video`, `Descargar` | ✏️ SÍ |
| 9 | **TIPO** | Tipo de recurso | `Video`, `PDF`, `Sección` | ✏️ SÍ |
| 10 | **URL VIDEO** | ID de YouTube | `pfDyegdtG2E` | ✏️ SÍ |
| 11 | **URL ARCHIVO** | Ruta o link | `/documentos/guia.pdf` | ✏️ SÍ |
| 12 | **IMAGEN** | Imagen de portada | `/clientes/imagen.jpg` | ✏️ SÍ |
| 13 | **NOTAS** | Notas internas | `Pendiente actualizar` | ✏️ SÍ |

---

## 🎯 Tipos de Recursos

### Tipo: `Sección`

Define el título y descripción de una sección completa.

**Campos importantes:**
- TÍTULO: Nombre de la sección
- DESCRIPCIÓN: Subtítulo de la sección
- TIPO: `Sección`
- Resto: Vacío

**Ejemplo:**
```csv
SÍ,10,📝 Paso 1,1,,Creación de los perfiles,,,,Sección,,,,
```

---

### Tipo: `Video`

Recurso con video de YouTube.

**Campos importantes:**
- TÍTULO: Nombre del video
- TEXTO BOTÓN: `Ver Tutorial`, `Ver Video`
- TIPO: `Video`
- URL VIDEO: Solo el ID (ej: `ABC123`)
- IMAGEN: Miniatura

**Ejemplo:**
```csv
SÍ,11,📝 Paso 1,1,,Gestión de Usuarios,,Ver Tutorial,Video,lTX96_VH7nY,,/imagen.jpg,
```

---

### Tipo: `PDF`

Documento PDF para descargar.

**Campos importantes:**
- TÍTULO: Nombre del documento
- TEXTO BOTÓN: `Descargar Guía`, `Ver Documento`
- TIPO: `PDF`
- URL ARCHIVO: Ruta del PDF
- IMAGEN: Miniatura

**Ejemplo:**
```csv
SÍ,12,📚 Manuales,,,Manual Funcional,,Ver Documento,PDF,,/documentos/manual.pdf,/imagen.png,
```

---

### Tipo: `Excel` / `PowerPoint`

Archivos de Office para descargar.

**Igual que PDF pero con TIPO diferente:**
- `Excel` para archivos .xlsx
- `PowerPoint` para archivos .pptx

---

### Tipo: `Link`

Link externo (ej: Cal.com).

**Campos importantes:**
- TÍTULO: Texto principal
- DESCRIPCIÓN: Texto secundario
- TEXTO BOTÓN: Texto del botón
- TIPO: `Link`
- URL ARCHIVO: URL completa

**Ejemplo:**
```csv
SÍ,60,📅 Agendar Cita,,,¿Deseas que te acompañemos?,Agenda una cita,Agendar Cita,Link,,https://cal.com/...,
```

---

## 🚀 Cómo Usar el CMS

### ✅ Agregar Nuevo Recurso

1. **Ir a la última fila** del CSV en Google Sheets
2. **Copiar una fila similar** al tipo que quieres agregar
3. **Pegar en nueva fila**
4. **Editar:**
   - ORDEN: Número nuevo (ej: si el último es 101, usa 102)
   - SECCIÓN: Misma sección o nueva
   - TÍTULO: Tu título
   - TIPO: Video, PDF, Excel, PowerPoint, o Link
   - URL VIDEO o URL ARCHIVO: Según el tipo
   - IMAGEN: Ruta de la imagen
5. **Guardar**
6. **Refrescar navegador** (F5)

---

### ✅ Desactivar Recurso

1. **Encontrar la fila**
2. **Cambiar MOSTRAR** de `SÍ` a `NO`
3. **Guardar**
4. **Refrescar navegador**

**Resultado:** El recurso desaparece del portal (pero no se elimina del Sheet)

---

### ✅ Reordenar Recursos

1. **Cambiar números en ORDEN**
2. Más bajo = aparece primero
3. **Ejemplo:**
   - Recurso A: ORDEN = 25
   - Recurso B: ORDEN = 26
   - Para que B aparezca antes: Cambiar B a 24

**Tip:** Usa gaps (10, 20, 30) para poder insertar recursos entre medio fácilmente.

---

### ✅ Cambiar Título de Sección

1. **Encontrar la fila con TIPO = `Sección`**
2. **Editar columna TÍTULO**
3. **Ejemplo:**
   ```
   Antes: Creación de los perfiles
   Después: Configuración de Perfiles
   ```
4. **Guardar**

---

### ✅ Cambiar Descripción de Sección

1. **Encontrar la fila con TIPO = `Sección`**
2. **Editar columna DESCRIPCIÓN**
3. **Guardar**

---

### ✅ Crear Nueva Sección

1. **Agregar fila con TIPO = `Sección`**
2. **Completar:**
   - MOSTRAR: `SÍ`
   - ORDEN: Número donde quieres que aparezca (ej: 110)
   - SECCIÓN: Nombre con emoji (ej: `🎓 Capacitación`)
   - TÍTULO: Título de la sección
   - DESCRIPCIÓN: Subtítulo
   - TIPO: `Sección`
3. **Agregar recursos de esa sección:**
   - Usa el mismo nombre en SECCIÓN
   - ORDEN: 111, 112, 113...
   - TIPO: Video, PDF, etc.

---

## 📊 Sistema de ORDEN

### Estructura Recomendada

```
1-9     → Introducción
10-19   → Paso 1
20-29   → Paso 2
30-39   → Paso 3
40-49   → Paso 4
50-59   → Interpretación
60-69   → Agendar Cita
70-79   → Manuales
80-89   → Bases Conceptuales
90-99   → Valoración Integral
100-109 → Investigaciones
110+    → Nuevas secciones
```

**Ventaja:** Puedes insertar recursos entre medio sin reorganizar todo.

**Ejemplo:**
- Tienes recursos en 10, 20, 30
- Quieres agregar uno entre 10 y 20
- Usa 15 (no necesitas cambiar los demás)

---

## 🎨 Emojis Recomendados

Usa emojis en la columna SECCIÓN para identificación visual:

| Emoji | Uso | Ejemplo |
|-------|-----|---------|
| 🎯 | Introducción | `🎯 Introducción` |
| 📝 | Pasos del proceso | `📝 Paso 1` |
| 📊 | Reportes/Análisis | `📊 Interpretación` |
| 📅 | Acciones/CTAs | `📅 Agendar Cita` |
| 📚 | Documentación | `📚 Manuales` |
| 🧠 | Conceptual | `🧠 Bases Conceptuales` |
| 💼 | Práctico | `💼 Valoración Integral` |
| 🔬 | Investigación | `🔬 Investigaciones` |
| 🎓 | Capacitación | `🎓 Capacitación` |
| ⚙️ | Configuración | `⚙️ Configuración` |

---

## 📝 Ejemplos Completos

### Ejemplo 1: Agregar Video Tutorial

```csv
MOSTRAR: SÍ
ORDEN: 27
SECCIÓN: 📝 Paso 2
PASO: 2
SUBSECCIÓN: (vacío)
TÍTULO: Nuevo Tutorial de Configuración
DESCRIPCIÓN: (vacío)
TEXTO BOTÓN: Ver Tutorial
TIPO: Video
URL VIDEO: ABC123XYZ
URL ARCHIVO: (vacío)
IMAGEN: /clientes/nuevo-tutorial.jpg
NOTAS: Agregado 2026-02-03
```

---

### Ejemplo 2: Agregar PDF Descargable

```csv
MOSTRAR: SÍ
ORDEN: 77
SECCIÓN: 📚 Manuales
PASO: (vacío)
SUBSECCIÓN: Orientaciones para la aplicación de los Test
TÍTULO: Guía de Mejores Prácticas
DESCRIPCIÓN: (vacío)
TEXTO BOTÓN: Descargar Guía
TIPO: PDF
URL VIDEO: (vacío)
URL ARCHIVO: /documentos/mejores-practicas.pdf
IMAGEN: /clientes/guia-practicas.jpg
NOTAS: (vacío)
```

---

### Ejemplo 3: Crear Nueva Sección

**Paso 1: Agregar header de sección**
```csv
MOSTRAR: SÍ
ORDEN: 110
SECCIÓN: 🎓 Capacitación
PASO: (vacío)
SUBSECCIÓN: (vacío)
TÍTULO: Programas de Capacitación
DESCRIPCIÓN: Cursos y talleres para desarrollar competencias en tu equipo.
TEXTO BOTÓN: (vacío)
TIPO: Sección
URL VIDEO: (vacío)
URL ARCHIVO: (vacío)
IMAGEN: (vacío)
NOTAS: Nueva sección agregada
```

**Paso 2: Agregar recursos**
```csv
MOSTRAR: SÍ
ORDEN: 111
SECCIÓN: 🎓 Capacitación
PASO: (vacío)
SUBSECCIÓN: (vacío)
TÍTULO: Curso de Evaluación por Competencias
DESCRIPCIÓN: (vacío)
TEXTO BOTÓN: Ver Curso
TIPO: Video
URL VIDEO: XYZ789
URL ARCHIVO: (vacío)
IMAGEN: /clientes/curso.jpg
NOTAS: (vacío)
```

---

## 🔄 Flujos de Trabajo Comunes

### Workflow 1: Actualizar Contenido Existente

```
1. Abrir Google Sheets
2. Buscar recurso (por título o número de ORDEN)
3. Editar campos necesarios
4. Guardar (auto-save)
5. Refrescar navegador (F5)
6. ✅ Ver cambios
```

**Tiempo:** ~30 segundos

---

### Workflow 2: Agregar Nuevo Video

```
1. Subir video a YouTube
2. Copiar ID del video (11 caracteres)
3. Subir miniatura a Imgur (opcional)
4. Ir a Google Sheets
5. Copiar fila similar (otro video)
6. Pegar en nueva fila
7. Editar:
   - ORDEN: Siguiente número
   - TÍTULO: Nombre del video
   - URL VIDEO: ID de YouTube
   - IMAGEN: URL de miniatura
8. Guardar
9. Refrescar navegador
```

**Tiempo:** ~2 minutos

---

### Workflow 3: Reorganizar Sección

```
1. Identificar recursos a mover
2. Cambiar sus números de ORDEN
3. Ejemplo:
   - Recurso A (ORDEN 25) → Cambiar a 21
   - Recurso B (ORDEN 21) → Cambiar a 25
4. Guardar
5. Refrescar navegador
```

**Tiempo:** ~1 minuto

---

## 🎓 Conceptos Clave

### Secciones

Una **sección** es un grupo de recursos que se muestran juntos.

**Componentes:**
1. **Header de sección** (fila con TIPO = `Sección`)
   - Define título y descripción
   - Aparece grande con fondo de color

2. **Recursos de la sección** (filas con mismo nombre en SECCIÓN)
   - Cards individuales
   - Se agrupan bajo el header

**Ejemplo:**
```
Fila 70: TIPO=Sección, TÍTULO="Manuales", DESCRIPCIÓN="..."
Fila 71: TIPO=PDF, TÍTULO="Manual 1", SECCIÓN="📚 Manuales"
Fila 72: TIPO=PDF, TÍTULO="Manual 2", SECCIÓN="📚 Manuales"
```

---

### Pasos (1-4)

Los **pasos** son secciones especiales que se muestran con un número grande.

**Características:**
- Aparecen en orden (1, 2, 3, 4)
- Tienen número visual grande
- Se muestran con borde lateral rosa

**Para crear un paso:**
1. Agregar header: TIPO=`Sección`, PASO=`1`
2. Agregar recursos: PASO=`1`, TIPO=Video/PDF/etc

---

### Subsecciones

Las **subsecciones** agrupan recursos dentro de una sección.

**Ejemplo:**
```
Sección: 📚 Manuales
  ├─ (sin subsección)
  │   ├─ Requerimientos Técnicos
  │   └─ Manual Funcional
  └─ Subsección: "Orientaciones para la aplicación"
      ├─ Recomendaciones Básico
      ├─ Facilitadores Básico
      └─ Recomendaciones Plus
```

**En el CSV:**
```csv
SECCIÓN="📚 Manuales", SUBSECCIÓN="" → Sin subsección
SECCIÓN="📚 Manuales", SUBSECCIÓN="Orientaciones..." → Con subsección
```

---

## 🎨 Personalización Visual

### Colores de Footer

El sistema asigna colores automáticamente:

| Sección/Paso | Color Footer | Color Botón |
|--------------|--------------|-------------|
| Paso 1 | Rosa (#E11383) | Blanco con texto rosa |
| Interpretación | Rosa (#E11383) | Blanco con texto rosa |
| Otros | Navy (#1B1733) | Blanco con texto navy |

**No necesitas configurar colores** - son automáticos según la sección.

---

### División de Texto en Colores

**Para Títulos de Sección:**
- Primeras 2 palabras: Rosa
- Resto: Blanco

**Para Descripciones:**
- Primeras 3 palabras: Rosa
- Resto: Blanco

**Ejemplo:**
```
TÍTULO: "Nuestras bases conceptuales"
Resultado:
  "Nuestras bases" (rosa) + "conceptuales" (blanco)
```

---

## 🐛 Troubleshooting

### Problema: Recurso no aparece

**Verificar:**
- [ ] MOSTRAR = `SÍ`
- [ ] TÍTULO no está vacío
- [ ] SECCIÓN no está vacía
- [ ] TIPO es válido
- [ ] Guardaste los cambios

---

### Problema: Video no carga

**Verificar:**
- [ ] TIPO = `Video`
- [ ] URL VIDEO tiene el ID correcto (11 caracteres)
- [ ] No pusiste la URL completa, solo el ID

**Correcto:**
```
URL VIDEO: pfDyegdtG2E
```

**Incorrecto:**
```
URL VIDEO: https://youtube.com/watch?v=pfDyegdtG2E
```

---

### Problema: PDF no descarga

**Verificar:**
- [ ] TIPO = `PDF`
- [ ] URL ARCHIVO tiene la ruta correcta
- [ ] El archivo existe en `public/documentos/`

---

### Problema: Imagen no se muestra

**Verificar:**
- [ ] IMAGEN tiene una URL
- [ ] La URL es correcta (local o externa)
- [ ] Si es externa, funciona en el navegador
- [ ] Reiniciaste el servidor (desarrollo)

---

### Problema: Orden incorrecto

**Solución:**
- Verifica los números en ORDEN
- Ordena la hoja por ORDEN (Datos → Ordenar rango)
- Ajusta los números según necesites

---

## 📚 Archivos del Sistema

### Archivos de Datos

| Archivo | Uso |
|---------|-----|
| `resources_cms_v3.csv` | ✅ **CSV PRINCIPAL** - Importar a Google Sheets |
| `resources_cms_v3.json` | Backup en JSON |

### Archivos de Código

| Archivo | Descripción |
|---------|-------------|
| `lib/resources-cms-v3.ts` | Cliente para leer Google Sheets V3 |
| `components/dynamic-resource-card.tsx` | Card de recurso |
| `components/dynamic-step-section.tsx` | Sección de paso |
| `components/dynamic-section.tsx` | Sección genérica |
| `app/clientes/page.tsx` | Server component |
| `app/clientes/page-dynamic.tsx` | Client component |

### Archivos de Documentación

| Archivo | Contenido |
|---------|-----------|
| `CMS_V3_GUIA_COMPLETA.md` | ✅ **Esta guía** |
| `GUIA_CMS_MEJORADO.md` | Guía V2 (obsoleta) |
| `CACHE_IMAGENES.md` | Guía de imágenes |
| `SIN_CACHE.md` | Configuración sin caché |

---

## ✅ Checklist de Importación

Para importar el CSV V3 a Google Sheets:

- [ ] Crear nuevo Google Sheet
- [ ] Nombrar: "Multiplicity - Portal de Recursos V3"
- [ ] Archivo → Importar → Subir `resources_cms_v3.csv`
- [ ] Configuración: Separador = Coma
- [ ] Importar datos
- [ ] Congelar fila 29 (la de headers, después de instrucciones)
- [ ] Aplicar colores a headers
- [ ] Crear filtros
- [ ] Ajustar anchos de columna
- [ ] Publicar: Archivo → Compartir → Publicar en la web → CSV
- [ ] Copiar URL pública
- [ ] Actualizar URL en `lib/resources-cms-v3.ts`
- [ ] Reiniciar servidor

---

## 🎯 Validaciones Recomendadas

### En Google Sheets

**Columna A (MOSTRAR):**
- Datos → Validación
- Lista: `SÍ,NO`

**Columna I (TIPO):**
- Datos → Validación
- Lista: `Sección,Video,PDF,Excel,PowerPoint,Link`

**Formato Condicional:**
- Fila verde si MOSTRAR = `SÍ`
- Fila roja si MOSTRAR = `NO`
- Fila amarilla si TIPO = `Sección`

---

## 📞 Soporte Rápido

### Preguntas Frecuentes

**P: ¿Puedo cambiar el orden de las columnas?**
R: ❌ No, el código espera ese orden específico.

**P: ¿Puedo eliminar filas?**
R: ✅ Sí, pero mejor cambia MOSTRAR a `NO`.

**P: ¿Puedo agregar más columnas?**
R: ✅ Sí, al final. No insertes entre las existentes.

**P: ¿Necesito el campo ID?**
R: ❌ No, fue eliminado en V3.

**P: ¿Cómo sé si mis cambios funcionaron?**
R: Refresca el navegador (F5) y verifica.

---

## 🚀 Próximos Pasos

1. ✅ Importar `resources_cms_v3.csv` a Google Sheets
2. ✅ Aplicar formato y validaciones
3. ✅ Publicar como CSV
4. ✅ Actualizar URL en código (si es necesaria)
5. ✅ Probar agregando/editando recursos
6. ✅ Capacitar al equipo
7. ✅ ¡Empezar a usar!

---

**Versión:** 3.0.0 (FINAL)  
**Fecha:** Febrero 2026  
**Estado:** ✅ Listo para producción  
**Archivo principal:** `resources_cms_v3.csv`
