# Deep Linking - Documentación

## Descripción

Sistema de deep linking implementado para acceder directamente a recursos específicos (videos, PDFs, secciones) mediante URLs con parámetros.

## Características Implementadas

### 1. Deep Linking a Recursos Individuales

**URL Format:** `/clientes?resource={RESOURCE_ID}`

**Comportamiento:**
- Hace scroll automático al recurso específico
- Si es un video: abre el modal automáticamente y reproduce
- Si es un PDF/archivo: abre el archivo en nueva pestaña automáticamente

**Ejemplo:**
```
https://tu-dominio.com/clientes?resource=f740bf6f-1965-4ed4-92cd-51ff5555d27b
```

### 2. Deep Linking a Secciones

**URL Format:** `/clientes?section={SECTION_ID}`

**Comportamiento:**
- Hace scroll automático a la sección completa
- Muestra todos los recursos de esa sección

**Ejemplo:**
```
https://tu-dominio.com/clientes?section=use-case
```

### 3. Página de Gestión de Enlaces

**URL:** `/admin/links`

**Funcionalidades:**
- Lista todos los recursos disponibles en una tabla
- Filtros por:
  - Búsqueda por título/descripción
  - Sección
  - Tipo de recurso
- Botón para copiar enlaces directos
- Notificaciones al copiar
- Diferenciación visual entre recursos y secciones

## Archivos Modificados/Creados

### Archivos Modificados

1. **`lib/resources-cms-v3.ts`**
   - Agregado campo `id: string` a la interface `ResourceV3`
   - Actualizado parser para leer IDs desde la primera columna del CSV
   - Nuevas funciones:
     - `getResourceById(id: string)`: Busca un recurso por ID
     - `getSectionId(sectionName: string)`: Obtiene el ID de una sección

2. **`app/clientes/page.tsx`**
   - Envuelto con `Suspense` para soportar `useSearchParams`

3. **`app/clientes/page-dynamic.tsx`**
   - Importado `useSearchParams` de Next.js
   - Agregado estado `autoOpenResourceId` para controlar apertura automática
   - Implementada lógica de deep linking en `useEffect`
   - Actualizado IDs de secciones para usar `section-{id}`
   - Pasada prop `autoOpenResourceId` a componentes hijos

4. **`components/dynamic-resource-card.tsx`**
   - Agregada prop `autoOpen?: boolean`
   - Implementado `useEffect` para apertura automática
   - Actualizado ID del Card para usar `resource-{id}` en lugar de `resource-{orden}`
   - Cambiado `onComplete` para usar `resource.id`

5. **`components/dynamic-step-section.tsx`**
   - Agregada prop `autoOpenResourceId?: string | null`
   - Pasada prop a `DynamicResourceCard`
   - Actualizado key para usar `resource.id`

6. **`components/dynamic-section.tsx`**
   - Actualizados todos los IDs para usar `resource.id` en lugar de `resource.orden`
   - Agregado atributo `id` a todos los Cards

### Archivos Creados

1. **`app/admin/links/page.tsx`**
   - Página principal de gestión de enlaces
   - Carga recursos desde la API
   - Renderiza el componente `ResourceLinkManager`
   - Incluye sección informativa sobre cómo usar los enlaces

2. **`components/resource-link-manager.tsx`**
   - Componente cliente con tabla de recursos
   - Filtros y búsqueda
   - Funcionalidad de copiar al portapapeles
   - Notificaciones con `sonner`
   - Diferenciación visual por tipo de recurso

## Formato del CSV

El CSV debe tener la siguiente estructura (primera fila):

```
ID,MOSTRAR,ORDEN,SECCIÓN,PASO,SUBSECCIÓN,TÍTULO,DESCRIPCIÓN,TEXTO BOTÓN,TIPO,URL VIDEO,URL ARCHIVO,IMAGEN,NOTAS,COLOR
```

**Importante:** La columna `ID` debe contener UUIDs únicos para cada recurso.

## Flujos de Usuario

### Caso 1: Usuario recibe link a video
1. Abre URL: `/clientes?resource=f740bf6f-1965-4ed4-92cd-51ff5555d27b`
2. La página carga
3. Hace scroll automático a la tarjeta del video
4. El modal se abre automáticamente
5. El video comienza a reproducirse

### Caso 2: Usuario recibe link a PDF
1. Abre URL: `/clientes?resource=66611668-5c32-438f-93f8-e57f47de00b6`
2. La página carga
3. Hace scroll automático a la tarjeta del PDF
4. El PDF se abre en nueva pestaña automáticamente

### Caso 3: Administrador genera links
1. Navega a `/admin/links`
2. Ve tabla con todos los recursos
3. Usa filtros para encontrar el recurso deseado
4. Click en "Copiar Link"
5. Recibe confirmación visual
6. Pega el link donde lo necesite

## Consideraciones Técnicas

- **Next.js App Router:** Usa `useSearchParams()` con Suspense boundary
- **Client Components:** Componentes marcados con `"use client"`
- **IDs únicos:** Usa UUIDs del CSV como identificadores
- **Performance:** Carga recursos una sola vez, no hace fetch adicional por ID
- **Accesibilidad:** Scroll suave con `behavior: "smooth"`
- **UX:** Delays de 500ms para scroll y 800ms para auto-open para mejor experiencia

## Testing

Para probar la funcionalidad:

1. **Test de recursos individuales:**
   - Visita `/admin/links`
   - Copia un link de un video
   - Abre el link en nueva pestaña
   - Verifica que hace scroll y abre el video

2. **Test de PDFs:**
   - Copia un link de un PDF
   - Abre el link
   - Verifica que abre el PDF en nueva pestaña

3. **Test de secciones:**
   - Copia un link de una sección
   - Abre el link
   - Verifica que hace scroll a la sección completa

## Dependencias

- `sonner`: Para notificaciones toast (ya incluido en package.json)
- `lucide-react`: Para iconos (ya incluido)
- Next.js 15+ con App Router

## Próximos Pasos (Opcional)

- [ ] Agregar analytics para trackear qué enlaces se usan más
- [ ] Implementar short URLs para enlaces más cortos
- [ ] Agregar preview de recursos en la página de links
- [ ] Exportar lista de enlaces a CSV/Excel
