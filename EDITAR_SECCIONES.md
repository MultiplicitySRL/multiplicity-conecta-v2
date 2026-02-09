# ✏️ Cómo Editar Títulos y Descripciones de Secciones

## ✅ Actualización Implementada

Ahora **todos los títulos y descripciones de las secciones** se leen directamente desde Google Sheets. Ya no están hardcodeados en el código.

---

## 📝 Cómo Funciona

### Sistema Dinámico

El portal lee el **primer recurso de cada sección** y usa sus campos:
- **SECCIÓN** → Título de la sección
- **Descripción** → Subtítulo/descripción de la sección

---

## 🎯 Cómo Editar Títulos de Secciones

### Paso 1: Identificar la Sección

En Google Sheets, busca el **primer recurso** de la sección que quieres editar.

**Ejemplo: Manuales**
```
Fila 20 (primer recurso de Manuales):
- SECCIÓN: 📚 Manuales
- Descripción: (vacío o con texto)
```

### Paso 2: Editar el Campo SECCIÓN

1. **Ubicar la columna:** `SECCIÓN` (columna F)
2. **Editar el texto:**
   ```
   Antes: 📚 Manuales
   Después: 📚 Guías y Manuales
   ```
3. **Guardar** (auto-save)

### Paso 3: Ver Cambios

- **Desarrollo:** Reiniciar servidor
- **Producción:** Esperar 1 hora (revalidación)

---

## 📄 Cómo Editar Descripciones de Secciones

### Paso 1: Encontrar el Primer Recurso

Busca el primer recurso de la sección (menor número de ORDEN dentro de esa sección).

**Ejemplo: Bases Conceptuales**
```
Fila 26 (conceptual-diccionario):
- SECCIÓN: 🧠 Nuestras bases conceptuales
- Descripción: Fundamentos teóricos que sustentan las evaluaciones...
```

### Paso 2: Editar el Campo Descripción

1. **Ubicar la columna:** `Descripción` (columna I)
2. **Editar el texto:**
   ```
   Antes: Fundamentos teóricos que sustentan las evaluaciones y metodologías aplicadas en la plataforma.
   
   Después: Conoce los fundamentos teóricos y metodologías que usamos en nuestras evaluaciones.
   ```
3. **Guardar**

### Paso 3: Verificar

El nuevo texto aparecerá como subtítulo de la sección.

---

## 🎨 Estructura de Cada Sección

### Secciones Principales

| Sección | Primer Recurso | Campo SECCIÓN | Campo Descripción |
|---------|----------------|---------------|-------------------|
| **Caso de Uso** | tour-general (fila 2) | 🎯 Caso de uso multiplicity | Una orientación sobre... |
| **Interpretación** | tutorial-guia-interpretacion-individual (fila 18) | 📊 Interpretación de Resultados | Guías y videos para... |
| **Agendar Cita** | agendar-cita (fila 20) | 📅 Agendar Cita | Agenda una cita con nosotros |
| **Manuales** | platform-requerimientos-tecnicos (fila 21) | 📚 Manuales | (vacío o texto) |
| **Bases Conceptuales** | conceptual-diccionario (fila 27) | 🧠 Nuestras bases conceptuales | Fundamentos teóricos... |
| **Valoración Integral** | assessment-guia-entrevista (fila 32) | 💼 Apoyándote En La Valoración integral | Herramientas y guías... |
| **Investigaciones** | research-trends (fila 40) | 🔬 Estudios e Investigaciones | Descubre hallazgos... |

---

## 📋 Ejemplos Prácticos

### Ejemplo 1: Cambiar Título de "Manuales"

**Google Sheets (Fila 21):**
```
Columna F (SECCIÓN):
Antes: 📚 Manuales
Después: 📚 Documentación Técnica
```

**Resultado en el Portal:**
```
Antes: "Manuales"
Después: "Documentación Técnica"
```

---

### Ejemplo 2: Agregar Descripción a "Manuales"

**Google Sheets (Fila 21):**
```
Columna I (Descripción):
Antes: (vacío)
Después: Accede a toda la documentación técnica y guías de uso de la plataforma.
```

**Resultado en el Portal:**
```
Título: Documentación Técnica
Subtítulo: Accede a toda la documentación técnica y guías de uso de la plataforma.
```

---

### Ejemplo 3: Cambiar Descripción de "Interpretación"

**Google Sheets (Fila 18):**
```
Columna I (Descripción):
Antes: Guías y videos para interpretar los resultados de las evaluaciones de manera efectiva.
Después: Aprende a interpretar y comunicar los resultados de evaluación con nuestras guías especializadas.
```

**Resultado:** El subtítulo cambia en el portal.

---

## 🎯 Reglas Importantes

### 1. Solo el Primer Recurso Cuenta

El sistema lee **solo el primer recurso** (menor ORDEN) de cada sección para obtener:
- Título de la sección
- Descripción de la sección

**Ejemplo:**
```
Manuales tiene 6 recursos (filas 21-26)
Solo la fila 21 define el título y descripción de toda la sección
```

### 2. Mantén Consistencia

Todos los recursos de una misma sección deben tener:
- **Mismo valor en SECCIÓN**
- Solo el primero necesita descripción

**Ejemplo:**
```
✅ Correcto:
Fila 21: SECCIÓN = "📚 Manuales", Descripción = "Texto..."
Fila 22: SECCIÓN = "📚 Manuales", Descripción = ""
Fila 23: SECCIÓN = "📚 Manuales", Descripción = ""

❌ Incorrecto:
Fila 21: SECCIÓN = "📚 Manuales"
Fila 22: SECCIÓN = "📚 Guías"  ← Diferente, creará nueva sección
```

### 3. Emojis son Opcionales

Los emojis (🎯📊📚) se usan para identificación visual pero se eliminan automáticamente del título mostrado.

**Ejemplo:**
```
Google Sheets: 📚 Manuales
Portal muestra: "Manuales"
```

---

## 🔄 Flujo de Trabajo

### Para Cambiar Título de Sección

```
1. Identificar primer recurso de la sección
   ↓
2. Editar columna SECCIÓN (F)
   ↓
3. Guardar (auto-save)
   ↓
4. Esperar revalidación (1h) o reiniciar servidor
   ↓
5. Verificar en el portal
```

### Para Cambiar Descripción de Sección

```
1. Identificar primer recurso de la sección
   ↓
2. Editar columna Descripción (I)
   ↓
3. Guardar (auto-save)
   ↓
4. Esperar revalidación (1h) o reiniciar servidor
   ↓
5. Verificar en el portal
```

---

## 🎨 Formato de Texto

### División de Colores

El sistema divide automáticamente el texto en dos colores:

**Para Títulos:**
- Primeras 2 palabras: Rosa (#E11383)
- Resto: Blanco

**Para Descripciones:**
- Primeras 3 palabras: Rosa (#E11383)
- Resto: Blanco

**Ejemplo:**
```
Título: "Nuestras bases conceptuales"
Resultado:
- "Nuestras bases" (rosa)
- "conceptuales" (blanco)

Descripción: "Fundamentos teóricos que sustentan las evaluaciones"
Resultado:
- "Fundamentos teóricos que" (rosa)
- "sustentan las evaluaciones" (blanco)
```

---

## 🐛 Troubleshooting

### Problema: El título no cambia

**Verificar:**
1. ¿Editaste el **primer recurso** de la sección?
2. ¿Guardaste los cambios?
3. ¿Pasó 1 hora o reiniciaste el servidor?
4. ¿El campo SECCIÓN no está vacío?

**Solución:**
- Verifica el número de ORDEN
- Asegúrate de editar el recurso con menor ORDEN de esa sección

### Problema: La descripción no aparece

**Verificar:**
1. ¿El campo Descripción tiene texto?
2. ¿Es el primer recurso de la sección?

**Solución:**
- Agrega texto en la columna Descripción
- Solo el primer recurso muestra descripción

### Problema: Se creó una sección nueva por error

**Causa:** Cambiaste el nombre de SECCIÓN en un recurso

**Solución:**
1. Busca todos los recursos de esa sección
2. Asegúrate que todos tengan el mismo valor en SECCIÓN
3. Usa "Buscar y reemplazar" en Google Sheets

---

## 📊 Tabla de Referencia Rápida

### Campos que Afectan las Secciones

| Campo | Columna | Afecta | Quién lo Lee |
|-------|---------|--------|--------------|
| **SECCIÓN** | F | Título de la sección | Primer recurso |
| **Descripción** | I | Subtítulo de la sección | Primer recurso |
| **ORDEN** | B | Determina cuál es el "primero" | Sistema |

### Secciones Especiales

| Sección | Layout | Ubicación en Sheet |
|---------|--------|-------------------|
| Caso de Uso | Hero grande | Fila 2 |
| Tour General | Video embebido | Fila 2 |
| Pasos 1-4 | Grid con número | Filas 3-17 |
| Interpretación | Grid 2 columnas | Filas 18-19 |
| Agendar Cita | CTA card | Fila 20 |
| Otras Secciones | Grid adaptativo | Filas 21+ |

---

## ✅ Checklist de Edición

Antes de editar títulos/descripciones:

- [ ] Identifiqué el primer recurso de la sección
- [ ] Verifiqué el número de ORDEN (debe ser el menor)
- [ ] Edité el campo correcto (SECCIÓN o Descripción)
- [ ] Guardé los cambios
- [ ] Esperé revalidación o reinicié servidor
- [ ] Verifiqué en el portal

---

## 🎓 Mejores Prácticas

### 1. Títulos Concisos

```
✅ Bueno: "Manuales"
✅ Bueno: "Guías y Documentación"
❌ Malo: "Aquí encontrarás todos los manuales y documentación técnica"
```

### 2. Descripciones Claras

```
✅ Bueno: "Accede a guías técnicas y manuales de uso de la plataforma."
❌ Malo: "Documentos"
```

### 3. Mantén Consistencia

Usa el mismo tono y estilo en todas las secciones.

### 4. Usa Emojis (Opcional)

Los emojis ayudan a identificar secciones en Google Sheets:
- 🎯 Introducción/Caso de uso
- 📊 Reportes/Análisis
- 📚 Documentación
- 🧠 Conceptual/Teórico
- 💼 Práctico/Aplicación
- 🔬 Investigación

---

## 📚 Documentos Relacionados

- [GUIA_CMS_MEJORADO.md](./GUIA_CMS_MEJORADO.md) - Guía general del CMS
- [CACHE_IMAGENES.md](./CACHE_IMAGENES.md) - Manejo de imágenes
- [INTEGRACION_COMPLETADA.md](./INTEGRACION_COMPLETADA.md) - Documentación técnica

---

**Última actualización:** Febrero 2026  
**Versión:** 1.3.0  
**Títulos dinámicos:** ✅ Implementado
