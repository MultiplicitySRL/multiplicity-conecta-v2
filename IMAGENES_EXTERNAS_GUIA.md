# 🖼️ Guía de Imágenes Externas

## ✅ Cambios Implementados

Se ha actualizado el sistema para soportar **imágenes externas** (URLs de internet) en el campo `Imagen Miniatura` del Google Sheet.

---

## 🔧 Configuración

### Archivos Actualizados

1. ✅ **`components/dynamic-resource-card.tsx`**
   - Agregado manejo de errores de carga
   - Agregado `crossOrigin` para imágenes externas
   - Fallback automático a placeholder si falla

2. ✅ **`components/dynamic-section.tsx`**
   - Agregado manejo de errores en ambas secciones
   - Soporte para imágenes externas

3. ✅ **`next.config.mjs`**
   - Configurado `remotePatterns` para permitir cualquier dominio
   - Soporta HTTP y HTTPS

---

## 📝 Cómo Usar Imágenes Externas

### En Google Sheets

En la columna **"Imagen Miniatura"**, puedes usar:

#### ✅ Imágenes Locales (como antes)
```
/clientes/guia de perfiles.jpeg
/images/Manual Funcional de la plataforma.png
```

#### ✅ Imágenes Externas (nuevo)
```
https://ejemplo.com/imagen.jpg
https://cdn.ejemplo.com/recursos/imagen.png
http://otro-sitio.com/foto.jpg
```

### Ejemplos Válidos

| Tipo | URL | Estado |
|------|-----|--------|
| Local | `/clientes/foto.jpg` | ✅ Funciona |
| HTTPS | `https://ejemplo.com/imagen.png` | ✅ Funciona |
| HTTP | `http://ejemplo.com/imagen.jpg` | ✅ Funciona |
| Google Drive | `https://drive.google.com/uc?id=...` | ✅ Funciona* |
| Dropbox | `https://www.dropbox.com/s/.../imagen.jpg?dl=1` | ✅ Funciona* |
| Imgur | `https://i.imgur.com/abc123.jpg` | ✅ Funciona |
| Unsplash | `https://images.unsplash.com/photo-...` | ✅ Funciona |

*Nota: Asegúrate de usar URLs directas de imagen, no páginas de vista previa.

---

## 🔍 Troubleshooting

### Problema: La imagen no se muestra

#### Solución 1: Verificar la URL

1. **Copia la URL** del campo "Imagen Miniatura"
2. **Pégala en una nueva pestaña** del navegador
3. **Verifica que se muestre la imagen directamente**
   - ✅ Correcto: Se ve la imagen
   - ❌ Incorrecto: Se ve una página web o error

#### Solución 2: URL Directa de Imagen

Asegúrate de usar la URL directa de la imagen:

**❌ Incorrecto (página de vista):**
```
https://drive.google.com/file/d/ABC123/view
https://www.dropbox.com/s/xyz/imagen.jpg
```

**✅ Correcto (URL directa):**
```
https://drive.google.com/uc?export=view&id=ABC123
https://www.dropbox.com/s/xyz/imagen.jpg?dl=1
```

#### Solución 3: Verificar CORS

Algunos sitios bloquean el uso de sus imágenes en otros sitios (CORS).

**Servicios que funcionan bien:**
- ✅ Imgur
- ✅ Unsplash
- ✅ Cloudinary
- ✅ AWS S3 (con permisos públicos)
- ✅ Google Drive (con link directo)

**Servicios que pueden dar problemas:**
- ⚠️ Facebook
- ⚠️ Instagram
- ⚠️ Algunos CDNs privados

#### Solución 4: Reiniciar el Servidor

Después de agregar una imagen externa por primera vez:

```bash
# Detener el servidor
Ctrl+C

# Reiniciar
npm run dev
```

---

## 🎯 Mejores Prácticas

### 1. Usar Servicios de Hosting de Imágenes

**Recomendados:**
- **Imgur** - Gratis, fácil, rápido
- **Cloudinary** - Profesional, con optimización
- **AWS S3** - Para producción seria
- **Vercel Blob** - Integrado con Vercel

### 2. Formato de Imágenes

**Formatos soportados:**
- ✅ JPG/JPEG
- ✅ PNG
- ✅ WebP
- ✅ GIF
- ✅ SVG

**Tamaño recomendado:**
- Ancho: 800-1200px
- Alto: 600-800px
- Peso: < 500KB (optimizado)

### 3. Nombres de Archivo

Si usas imágenes locales, evita:
- ❌ Espacios: `mi imagen.jpg`
- ❌ Acentos: `imágen.jpg`
- ❌ Caracteres especiales: `imagen#1.jpg`

Usa:
- ✅ Guiones: `mi-imagen.jpg`
- ✅ Guiones bajos: `mi_imagen.jpg`
- ✅ Sin espacios: `miimagen.jpg`

---

## 📦 Subir Imágenes a Imgur (Recomendado)

### Paso a Paso

1. **Ir a Imgur:**
   - https://imgur.com

2. **Subir imagen:**
   - Click en "New post"
   - Arrastra tu imagen
   - Espera a que suba

3. **Obtener URL directa:**
   - Click derecho en la imagen
   - "Copiar dirección de imagen"
   - Ejemplo: `https://i.imgur.com/ABC123.jpg`

4. **Pegar en Google Sheets:**
   - Pega la URL en la columna "Imagen Miniatura"
   - Guarda

5. **Verificar:**
   - Espera 1 hora (revalidación)
   - O reinicia el servidor en desarrollo

---

## 🔄 Flujo de Trabajo Recomendado

### Para Imágenes Nuevas

```
1. Subir imagen a Imgur/Cloudinary
   ↓
2. Copiar URL directa
   ↓
3. Pegar en Google Sheets (columna "Imagen Miniatura")
   ↓
4. Guardar (auto-save)
   ↓
5. Esperar revalidación (1 hora) o reiniciar servidor
   ↓
6. Verificar en el portal
```

### Para Imágenes Existentes (Locales)

```
1. Mantener en /public/clientes/ o /public/images/
   ↓
2. Usar ruta relativa: /clientes/imagen.jpg
   ↓
3. No cambiar nada si ya funciona
```

---

## 🐛 Debugging

### Ver Errores en Consola

1. **Abrir DevTools:**
   - F12 o Click derecho → "Inspeccionar"

2. **Ir a Console:**
   - Buscar mensajes de error
   - Buscar: "Error loading image"

3. **Verificar la URL:**
   - El error mostrará la URL que intentó cargar
   - Copia y prueba en nueva pestaña

### Verificar en Network

1. **Abrir DevTools → Network**
2. **Recargar la página**
3. **Filtrar por "img"**
4. **Buscar imágenes con status 404 o 403:**
   - 404 = No encontrada
   - 403 = Bloqueada (CORS)

---

## ✅ Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] La URL es directa a la imagen (no página de vista)
- [ ] La URL funciona en una nueva pestaña del navegador
- [ ] La imagen es de un servicio que permite CORS
- [ ] El servidor fue reiniciado después del cambio
- [ ] Pasó el tiempo de revalidación (1 hora) o se forzó
- [ ] No hay errores en la consola del navegador
- [ ] El campo "Imagen Miniatura" no está vacío
- [ ] El recurso está activo (ACTIVO = SÍ)

---

## 📞 Soporte

### Si la imagen no se muestra:

1. **Verificar URL directa** (pegar en navegador)
2. **Ver consola del navegador** (F12)
3. **Reiniciar servidor** (desarrollo)
4. **Esperar revalidación** (producción)
5. **Usar Imgur** como alternativa

### Contacto

Si nada funciona, proporciona:
- URL de la imagen
- ID del recurso en Google Sheets
- Captura de pantalla del error en consola
- Navegador y versión

---

## 🎓 Ejemplos Completos

### Ejemplo 1: Imagen de Imgur

**Google Sheets:**
```
Imagen Miniatura: https://i.imgur.com/ABC123.jpg
```

**Resultado:** ✅ Se muestra correctamente

### Ejemplo 2: Imagen Local

**Google Sheets:**
```
Imagen Miniatura: /clientes/guia-perfiles.jpeg
```

**Resultado:** ✅ Se muestra correctamente

### Ejemplo 3: Google Drive (Correcto)

**Google Sheets:**
```
Imagen Miniatura: https://drive.google.com/uc?export=view&id=1ABC...XYZ
```

**Resultado:** ✅ Se muestra correctamente

### Ejemplo 4: Google Drive (Incorrecto)

**Google Sheets:**
```
Imagen Miniatura: https://drive.google.com/file/d/1ABC...XYZ/view
```

**Resultado:** ❌ No se muestra (no es URL directa)

---

## 🚀 Próximos Pasos

1. **Probar con una imagen de Imgur**
2. **Verificar que se muestre**
3. **Documentar URLs que funcionan**
4. **Compartir con el equipo**

---

**Última actualización:** Febrero 2026  
**Versión:** 1.1.0  
**Soporte de imágenes externas:** ✅ Activado
