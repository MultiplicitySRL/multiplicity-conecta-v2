/**
 * Downloads an HTML string as a PDF by rendering it inside an isolated iframe.
 *
 * Using an iframe prevents the page's Tailwind CSS (which uses oklch color
 * functions) from leaking into the element that html2canvas captures.
 * html2canvas does not support oklch, so isolation is mandatory.
 */
export async function downloadHtmlAsPdf(html: string, filename: string): Promise<void> {
  const [html2canvasMod, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ])
  const html2canvas = html2canvasMod.default ?? html2canvasMod

  // Isolated iframe — the page's Tailwind variables won't apply here
  const iframe = document.createElement("iframe")
  iframe.setAttribute("sandbox", "allow-same-origin allow-scripts")
  iframe.style.cssText =
    "position:fixed;left:-9999px;top:0;width:794px;height:1px;border:none;opacity:0;pointer-events:none;"
  document.body.appendChild(iframe)

  try {
    const iframeDoc = iframe.contentDocument!
    iframeDoc.open()
    iframeDoc.write(html)
    iframeDoc.close()

    // Wait for Google Fonts and images to finish loading
    await (iframeDoc as Document & { fonts?: FontFaceSet }).fonts?.ready
    await new Promise((r) => setTimeout(r, 600))

    const scrollH = iframeDoc.documentElement.scrollHeight
    iframe.style.height = `${scrollH}px`

    // Capture the iframe body — html2canvas will use the iframe's own CSS context
    const canvas = await (html2canvas as (el: HTMLElement, opts?: object) => Promise<HTMLCanvasElement>)(
      iframeDoc.body,
      {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 794,
        windowWidth: 794,
        backgroundColor: "#ffffff",
      },
    )

    // Build a multi-page A4 PDF
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" })
    const pageW = pdf.internal.pageSize.getWidth()   // 210 mm
    const pageH = pdf.internal.pageSize.getHeight()  // 297 mm
    const mmPerPx = pageW / canvas.width
    const pxPerPage = pageH / mmPerPx

    const totalPages = Math.ceil(canvas.height / pxPerPage)

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage()

      const srcY = Math.round(page * pxPerPage)
      const srcH = Math.round(Math.min(pxPerPage, canvas.height - srcY))

      const slice = document.createElement("canvas")
      slice.width = canvas.width
      slice.height = srcH
      const ctx = slice.getContext("2d")!
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, slice.width, slice.height)
      ctx.drawImage(canvas, 0, -srcY)

      pdf.addImage(slice.toDataURL("image/jpeg", 0.98), "JPEG", 0, 0, pageW, srcH * mmPerPx)
    }

    pdf.save(filename)
  } finally {
    document.body.removeChild(iframe)
  }
}
