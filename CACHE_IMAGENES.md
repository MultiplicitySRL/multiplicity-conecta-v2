# 🔄 Solución de Caché de Imágenes

## ✅ Problema Solucionado

Las imágenes externas ahora se actualizan automáticamente cuando cambias la URL en Google Sheets, sin necesidad de limpiar el caché del navegador.

---

## 🔧 Cómo Funciona

### Cache-Busting Automático

Se implementó un sistema de **versionado automático** que agrega un parámetro `v=` a las URLs de imágenes externas:

```
URL Original:
https://i.imgur.com/ABC123.jpg

URL con Versión:
https://i.imgur.com/ABC123.jpg?v=5
```

El número de versión (`v=5`) corresponde al campo **ORDEN** del recurso en Google Sheets.

---

## 📝 Cómo Usar

### Opción 1: Cambiar la URL de la Imagen (Recomendado)

Si cambias la imagen por una completamente nueva:

1. **Editar en Google Sheets:**
   - Columna: `Imagen Miniatura`
   - Cambiar de: `https://i.imgur.com/OLD123.jpg`
   - A: `https://i.imgur.com/NEW456.jpg`

2. **Guardar** (auto-save)

3. **Esperar revalidación** (1 hora) o forzar:
   ```bash
   # En desarrollo
   Ctrl+C
   npm run dev
   ```

4. **Resultado:** ✅ La nueva imagen se muestra inmediatamente

### Opción 2: Cambiar el Número de ORDEN

Si actualizaste la imagen en el mismo URL (ej: reemplazaste en Imgur):

1. **Editar en Google Sheets:**
   - Columna: `ORDEN`
   - Cambiar de: `5`
   - A: `6` (o cualquier otro número)

2. **Guardar**

3. **Esperar revalidación** (1 hora) o forzar

4. **Resultado:** ✅ El navegador descarga la imagen nuevamente

### Opción 3: Forzar Actualización Inmediata

En desarrollo, para ver cambios inmediatamente:

```bash
# Terminal
Ctrl+C  # Detener servidor
npm run dev  # Reiniciar
```

Luego en el navegador:
```
Ctrl+Shift+R  # Windows/Linux (hard refresh)
Cmd+Shift+R   # Mac (hard refresh)
```

---

## 🎯 Casos de Uso

### Caso 1: Cambiar Imagen Completamente

**Escenario:** Quieres usar una imagen diferente

**Solución:**
1. Sube la nueva imagen a Imgur
2. Copia la nueva URL
3. Pega en Google Sheets (columna `Imagen Miniatura`)
4. Guarda

**Resultado:** ✅ Funciona automáticamente

---

### Caso 2: Actualizar Imagen en el Mismo URL

**Escenario:** Reemplazaste la imagen en Imgur/Cloudinary pero la URL es la misma

**Problema:** El navegador usa la versión cacheada

**Solución A - Cambiar ORDEN:**
1. En Google Sheets, cambia el número de `ORDEN`
2. Ejemplo: de `5` a `6`
3. Guarda

**Solución B - Agregar Parámetro Manual:**
1. En Google Sheets, edita la URL
2. Agrega `?v=2` al final
3. Ejemplo: `https://i.imgur.com/ABC.jpg?v=2`
4. Cada vez que actualices la imagen, cambia el número

**Resultado:** ✅ El navegador descarga la nueva versión

---

### Caso 3: Imagen No Se Actualiza en Producción

**Escenario:** Cambiaste la imagen pero en producción sigue mostrando la vieja

**Causa:** Revalidación de Next.js (cada 1 hora)

**Solución:**
1. **Esperar 1 hora** (automático)
2. **O forzar revalidación** (ver abajo)

---

## ⚡ Forzar Revalidación

### En Desarrollo (localhost)

```bash
# Opción 1: Reiniciar servidor
Ctrl+C
npm run dev

# Opción 2: Limpiar caché de Next.js
rm -rf .next
npm run dev
```

### En Producción (Vercel)

**Opción 1: Esperar (Recomendado)**
- Espera 1 hora
- La revalidación es automática

**Opción 2: Redeploy**
```bash
git commit --allow-empty -m "Force revalidation"
git push
```

**Opción 3: On-Demand Revalidation (Avanzado)**

Crear ruta API para revalidación manual:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 })
  }

  revalidatePath('/clientes')
  
  return Response.json({ revalidated: true, now: Date.now() })
}
```

Luego llamar:
```bash
curl -X POST "https://tu-sitio.com/api/revalidate?secret=TU_SECRET"
```

---

## 🧪 Testing

### Verificar que el Cache-Busting Funciona

1. **Abrir DevTools** (F12)
2. **Ir a Network**
3. **Filtrar por "img"**
4. **Recargar la página**
5. **Buscar tu imagen**
6. **Verificar la URL:**
   ```
   ✅ Correcto: https://i.imgur.com/ABC.jpg?v=5
   ❌ Incorrecto: https://i.imgur.com/ABC.jpg
   ```

### Verificar Versión

1. **Inspeccionar elemento** (click derecho en imagen)
2. **Ver atributo src:**
   ```html
   <img src="https://i.imgur.com/ABC.jpg?v=5" />
   ```
3. **El número después de v= debe coincidir con ORDEN**

---

## 📊 Comparación de Estrategias

| Estrategia | Ventajas | Desventajas | Cuándo Usar |
|------------|----------|-------------|-------------|
| **Cambiar URL** | Simple, automático | Requiere nueva imagen | Imagen nueva |
| **Cambiar ORDEN** | No requiere nueva URL | Cambia el orden visual | Misma URL actualizada |
| **Parámetro Manual** | Control total | Requiere edición manual | Casos especiales |
| **Reiniciar Servidor** | Inmediato (dev) | Solo desarrollo | Testing rápido |

---

## 🐛 Troubleshooting

### Problema: La imagen sigue sin actualizarse

**Verificar:**

1. **¿Cambió la URL o el ORDEN?**
   - Si no, el navegador usa caché
   - Solución: Cambiar uno de los dos

2. **¿Pasó 1 hora desde el cambio?**
   - En producción, espera la revalidación
   - O fuerza con redeploy

3. **¿El navegador tiene caché fuerte?**
   - Prueba en modo incógnito
   - O limpia caché: Ctrl+Shift+Del

4. **¿La URL tiene el parámetro v=?**
   - Inspecciona el src de la imagen
   - Debe tener `?v=NUMERO`

### Problema: El parámetro v= no aparece

**Causa:** La imagen es local (no externa)

**Verificación:**
```
✅ Externa: https://i.imgur.com/ABC.jpg
❌ Local: /clientes/imagen.jpg
```

**Solución:** 
- Las imágenes locales no necesitan cache-busting
- Para actualizarlas, reemplaza el archivo en `/public/`

### Problema: Todas las imágenes se recargan en cada render

**Causa:** Implementación incorrecta

**Verificación:**
- El parámetro `v=` debe ser estable
- Debe usar `resource.orden`, no `Date.now()`

**Solución:** Ya está implementado correctamente

---

## 💡 Mejores Prácticas

### 1. Usa URLs Nuevas Cuando Sea Posible

```
✅ Mejor:
- Sube nueva imagen a Imgur
- Usa nueva URL
- Cambio automático

❌ Evitar:
- Reemplazar imagen en mismo URL
- Requiere cambiar ORDEN o parámetro
```

### 2. Nombra Imágenes con Versión

```
✅ Bueno:
- guia-perfiles-v1.jpg
- guia-perfiles-v2.jpg
- guia-perfiles-v3.jpg

❌ Malo:
- guia-perfiles.jpg (siempre mismo nombre)
```

### 3. Documenta Cambios

En la columna **"Notas Internas"**:
```
Imagen actualizada - v2 - 2026-02-03
```

### 4. Usa Servicios con Versionado

**Cloudinary** tiene versionado automático:
```
https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
                                                 ^^^^^^^^^^
                                                 versión automática
```

---

## 🔄 Flujo de Trabajo Recomendado

### Para Actualizar Imagen

```
1. ¿Es imagen nueva o actualización?
   │
   ├─ Nueva → Subir a Imgur → Nueva URL → Pegar en Sheet → ✅ Listo
   │
   └─ Actualización → ¿Puedo cambiar URL?
                      │
                      ├─ Sí → Nueva URL → ✅ Listo
                      │
                      └─ No → Cambiar ORDEN en Sheet → ✅ Listo
```

---

## 📚 Referencias

### Archivos Modificados

- ✅ `components/dynamic-resource-card.tsx`
- ✅ `components/dynamic-section.tsx`

### Estrategia Implementada

```typescript
// Cache-busting automático
const imageSrc = (() => {
  const baseUrl = resource.imagen_miniatura || "/placeholder.svg"
  const isExternal = baseUrl.startsWith("http")
  
  if (!isExternal) return baseUrl
  
  // Usar ORDEN como versión
  const separator = baseUrl.includes("?") ? "&" : "?"
  return `${baseUrl}${separator}v=${resource.orden}`
})()
```

---

## ✅ Checklist

Antes de reportar problema de caché:

- [ ] Cambié la URL o el ORDEN en Google Sheets
- [ ] Guardé los cambios (auto-save)
- [ ] Esperé 1 hora O reinicié servidor (dev)
- [ ] Probé en modo incógnito
- [ ] Verifiqué que la URL tiene `?v=NUMERO`
- [ ] La imagen es externa (empieza con http)
- [ ] El recurso está activo (ACTIVO = SÍ)

---

## 🎓 Resumen

### ✅ Lo que se implementó:

1. **Cache-busting automático** para imágenes externas
2. **Versionado basado en ORDEN** del recurso
3. **Sin cambios manuales** en URLs (opcional)
4. **Compatible con imágenes locales** (sin afectar)

### 🚀 Resultado:

- ✅ Cambias URL → Actualización automática
- ✅ Cambias ORDEN → Actualización automática
- ✅ Sin limpiar caché manualmente
- ✅ Funciona en desarrollo y producción

---

**Última actualización:** Febrero 2026  
**Versión:** 1.2.0  
**Cache-busting:** ✅ Implementado
