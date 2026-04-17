/**
 * URLs de transformación de Supabase Storage (Image CDN).
 * Requiere el proyecto con "Image transformations" activado en Storage.
 * @see https://supabase.com/docs/guides/storage/serving/image-transformations
 */

export type SupabaseImageTransformOpts = {
  width?: number
  height?: number
  /** 20–100; por defecto ~95 (compresión ligera, alta calidad visual) */
  quality?: number
  resize?: "cover" | "contain" | "fill"
  /** Query `v=` para invalidar caché al cambiar el recurso en el CMS */
  cacheKey?: string | number
}

const OBJECT_PUBLIC = "/storage/v1/object/public/"
const RENDER_PUBLIC = "/storage/v1/render/image/public/"

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function wantsExplicitResize(opts: SupabaseImageTransformOpts): boolean {
  return opts.width != null || opts.height != null || opts.resize != null
}

/** Solo recompresión / WebP: no toca dimensiones → no recorta en el CDN. */
function applyQualityOnlyParams(params: URLSearchParams, opts: SupabaseImageTransformOpts, defaultQuality: number) {
  params.delete("width")
  params.delete("height")
  params.delete("resize")

  let quality = opts.quality
  if (quality == null && params.has("quality")) quality = Number(params.get("quality"))
  if (quality == null || Number.isNaN(quality)) quality = defaultQuality
  params.set("quality", String(clamp(Math.round(quality), 20, 100)))

  if (opts.cacheKey != null) params.set("v", String(opts.cacheKey))
}

type BoxDefaults = {
  width: number
  height: number
  quality: number
  resize: "cover" | "contain" | "fill"
}

/** Si hace falta redimensionar: caja grande + contain para no perder bordes de la imagen. */
/** Calidad en el CDN: ligera reducción respecto al máximo (100), sin bajar demasiado el detalle. */
const DEFAULT_RESOURCE_QUALITY = 95

const RESIZE_BOX_DEFAULTS: BoxDefaults = {
  width: 2400,
  height: 2400,
  quality: DEFAULT_RESOURCE_QUALITY,
  resize: "contain",
}

function applyBoxResizeParams(params: URLSearchParams, opts: SupabaseImageTransformOpts, defaults: BoxDefaults) {
  let width = opts.width
  if (width == null && params.has("width")) width = Number(params.get("width"))
  if (width == null || Number.isNaN(width)) width = defaults.width

  let height = opts.height
  if (height == null && params.has("height")) height = Number(params.get("height"))
  if (height == null || Number.isNaN(height)) height = defaults.height

  params.set("width", String(clamp(Math.round(width), 1, 2500)))
  params.set("height", String(clamp(Math.round(height), 1, 2500)))

  let quality = opts.quality
  if (quality == null && params.has("quality")) quality = Number(params.get("quality"))
  if (quality == null || Number.isNaN(quality)) quality = defaults.quality
  params.set("quality", String(clamp(Math.round(quality), 20, 100)))

  const resize = opts.resize ?? (params.get("resize") as SupabaseImageTransformOpts["resize"]) ?? defaults.resize
  params.set("resize", resize || defaults.resize)

  if (opts.cacheKey != null) params.set("v", String(opts.cacheKey))
}

/**
 * Convierte `.../storage/v1/object/public/<bucket>/<ruta>` en URL `render`.
 * Por defecto solo añade `quality` (y `v`): no redimensiona → misma composición que el original.
 * Si pasas `width`, `height` o `resize`, aplica caja con `contain` por defecto.
 */
export function getSupabaseStorageRenderUrl(url: string, opts: SupabaseImageTransformOpts = {}): string {
  const trimmed = url?.trim()
  if (!trimmed || !trimmed.startsWith("http")) return trimmed

  try {
    const u = new URL(trimmed)

    if (u.pathname.includes(RENDER_PUBLIC)) {
      const out = new URL(u.toString())
      if (wantsExplicitResize(opts)) {
        applyBoxResizeParams(out.searchParams, opts, RESIZE_BOX_DEFAULTS)
      } else {
        applyQualityOnlyParams(out.searchParams, opts, DEFAULT_RESOURCE_QUALITY)
      }
      return out.toString()
    }

    const pubIdx = u.pathname.indexOf(OBJECT_PUBLIC)
    if (pubIdx === -1) return trimmed

    const rest = u.pathname.slice(pubIdx + OBJECT_PUBLIC.length)
    if (!rest) return trimmed

    const out = new URL(`${u.origin}${RENDER_PUBLIC}${rest}`)
    if (wantsExplicitResize(opts)) {
      applyBoxResizeParams(out.searchParams, opts, RESIZE_BOX_DEFAULTS)
    } else {
      applyQualityOnlyParams(out.searchParams, opts, DEFAULT_RESOURCE_QUALITY)
    }
    return out.toString()
  } catch {
    return trimmed
  }
}

/**
 * Imagen de un recurso CMS: optimiza Storage de Supabase sin recortar (solo calidad por defecto).
 * URLs externas no-Supabase: `?v=orden` para caché.
 */
export function getResourceImageSrc(
  imagen: string | undefined,
  orden: number,
  transform?: Omit<SupabaseImageTransformOpts, "cacheKey">,
): string {
  const base = imagen?.trim() || "/placeholder.svg"
  if (!base.startsWith("http")) return base

  const optimized = getSupabaseStorageRenderUrl(base, { ...transform, cacheKey: orden })
  if (optimized !== base) return optimized

  const separator = base.includes("?") ? "&" : "?"
  return `${base}${separator}v=${orden}`
}
