# 🔧 Fix: Imágenes no se mostraban en secciones

## Problema

Las imágenes solo se mostraban en "Caso de uso multiplicity" pero no en las demás secciones (Manuales, Bases Conceptuales, etc.).

## Causa

El componente `dynamic-section.tsx` estaba usando el campo `imagen_miniatura` de la versión V2 del CMS, pero en V3 el campo se llama simplemente `imagen`.

## Solución

Actualicé `components/dynamic-section.tsx` para usar el campo correcto:

### Cambios realizados:

1. **Función `getImageSrc`:**
   ```typescript
   // Antes (V2):
   const baseUrl = resource.imagen_miniatura || "/placeholder.svg"
   
   // Ahora (V3):
   const baseUrl = resource.imagen || "/placeholder.svg"
   ```

2. **Atributo `crossOrigin`:**
   ```typescript
   // Antes (V2):
   crossOrigin={resource.imagen_miniatura?.startsWith("http") ? "anonymous" : undefined}
   
   // Ahora (V3):
   crossOrigin={resource.imagen?.startsWith("http") ? "anonymous" : undefined}
   ```

3. **Tipo de parámetro:**
   ```typescript
   // Antes:
   const getImageSrc = (resource: Resource) => { ... }
   
   // Ahora:
   const getImageSrc = (resource: ResourceV3) => { ... }
   ```

## Verificación

Después de este fix, todas las imágenes deberían mostrarse correctamente en:

- ✅ Caso de uso multiplicity
- ✅ Paso 1, 2, 3, 4
- ✅ Interpretación de Resultados
- ✅ Manuales
- ✅ Bases Conceptuales
- ✅ Valoración Integral
- ✅ Investigaciones

## Archivos modificados

- `components/dynamic-section.tsx` - Actualizado campo de imagen de V2 a V3

---

**Fecha:** Febrero 2026  
**Estado:** ✅ Resuelto
