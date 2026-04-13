/**
 * HTML para imprimir / guardar como PDF la cotización de pruebas,
 * alineado al formato corporativo (Cotización Cliente Autogestión).
 */

export type QuotePdfTestDetail = {
  key: string
  name: string
  qty: number
  price: number
  totalWithoutDiscount: number
  discountAmount: number
  priceWithDiscount: number
  totalWithDiscount: number
  hasDiscount: boolean
}

export type QuotePdfCalculations = {
  testDetails: QuotePdfTestDetail[]
  totalTests: number
  subtotalWithoutDiscount: number
  totalDiscountAmount: number
  subtotalWithDiscount: number
  itbisAmount: number
  applyTax: boolean
  total: number
  symbol: string
}

export type BuildDirectQuotePdfHtmlParams = {
  origin: string
  quoteDate: Date
  clientName: string | null | undefined
  companyId: string | null
  currency: string
  showDopUsdNote: boolean
  calculations: QuotePdfCalculations
  formatCurrency: (amount: number, symbol?: string) => string
  convertCurrency: (amountUSD: number) => number
}

const PLUS_KEYS = ["competenciaPlus", "pensamientoAnalitico", "motivadores"] as const
const BASIC_KEYS = ["competenciasBasicas", "razonamientoGeneral"] as const

const PDF_PURPLE = "#2d1b69"
const PDF_TEAL = "#00b8a9"
const PDF_TEAL_DEEP = "#009688"
const PDF_TOP_BAR = "#4b5563"
const PDF_GREY_SUM = "#6b7280"
const ITBIS_RATE = 0.18

const PDF_APPENDIX_HTML = `
<section class="appendix">
  <h2 class="ap-h2">Observaciones:</h2>
  <hr class="rule rule--full" />
  <h2 class="ap-h2">Condiciones:</h2>
  <ul class="dash-list">
    <li>Pago único</li>
    <li>Las licencias de evaluaciones por uso no tienen fecha de vencimiento</li>
    <li>Permitido canjear productos de evaluación</li>
  </ul>
  <h2 class="ap-h2">Autogestión:</h2>
  <h3 class="ap-h3 ap-h3--ul">Responsabilidades de Multiplicity:</h3>
  <div class="ap-lines">
    <p>Ofrecer entrenamientos iniciales virtuales: Bases Conceptuales y Taller Gestión de la Plataforma</p>
    <p>Acompañamiento en definición de perfiles</p>
    <p>Otorgar claves de acceso a los administradores</p>
    <p>Soporte incidencias técnicas</p>
    <p>Asesoría en interpretación de resultados</p>
    <p>Manuales de Uso</p>
  </div>
  <p class="ap-bold-title">Talleres para Implementar un Proceso de Valoración Integral:</p>
  <div class="ap-lines">
    <p>Entrevista por Competencias</p>
    <p>Convirtiendo los datos de evaluación en entendimiento</p>
  </div>
  <p class="ap-bold-title">Guías: Disponibles a través del Repositorio de Contenido Multiplicity Conecta:</p>
  <div class="ap-lines">
    <p>Interpretación de Resultados</p>
    <p>Retroalimentación</p>
    <p>Pautas de Autodesarrollo</p>
    <p>Entrevista por Competencias</p>
  </div>
  <h3 class="ap-h3 ap-h3--ul">Responsabilidades del Cliente:</h3>
  <div class="ap-lines">
    <p>Administrar los perfiles ideales dentro de la plataforma</p>
    <p>Enviar invitaciones y recordatorios a los evaluados</p>
    <p>Generar reportes: Estatus de evaluaciones, resultados individuales, resumen, participante y grupales</p>
    <p>Leer y hacer uso del Manual Funcional de la Plataforma y de los documentos de valoración integral para implementar buenas prácticas de evaluación.</p>
    <p>Administrar (Crear/eliminar) usuarios para los administradores de la plataforma en su empresa.</p>
  </div>
  <hr class="rule rule--full rule--footer" />
  <div class="sig-block">
    <div class="sig-inner">
      <hr class="rule rule--sig" />
      <p class="sig-label">Preparado por</p>
    </div>
  </div>
</section>
`.trim()

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function rowCells(
  test: QuotePdfTestDetail,
  formatCurrency: BuildDirectQuotePdfHtmlParams["formatCurrency"],
  convertCurrency: BuildDirectQuotePdfHtmlParams["convertCurrency"],
  symbol: string,
): string {
  const q = test.qty
  const c = convertCurrency
  const fc = (n: number) => formatCurrency(n, symbol)
  if (q <= 0) {
    return `<td>${esc(test.name)}</td>
      <td class="c">-</td>
      <td class="r">-</td>
      <td class="r">-</td>
      <td class="r">-</td>
      <td class="r">-</td>
      <td class="r">-</td>`
  }
  return `<td>${esc(test.name)}</td>
    <td class="c">${q}</td>
    <td class="r">${fc(c(test.price))}</td>
    <td class="r">${fc(c(test.totalWithoutDiscount))}</td>
    <td class="r">${test.hasDiscount ? fc(c(test.discountAmount)) : "-"}</td>
    <td class="r">${fc(c(test.priceWithDiscount))}</td>
    <td class="r"><strong>${fc(c(test.totalWithDiscount))}</strong></td>`
}

function sectionRow(label: string, colspan = 7, extraClass = ""): string {
  const cls = ["sec", extraClass].filter(Boolean).join(" ")
  return `<tr><td colspan="${colspan}" class="${cls}">${esc(label)}</td></tr>`
}

export function buildDirectQuotePdfHtml(p: BuildDirectQuotePdfHtmlParams): string {
  const { calculations, formatCurrency, convertCurrency, currency, clientName, companyId, origin, showDopUsdNote } = p
  const sym = calculations.symbol
  const fc = (n: number) => formatCurrency(n, sym)
  const c = convertCurrency

  const dateShort = p.quoteDate.toLocaleDateString("es-DO", { day: "numeric", month: "numeric", year: "numeric" })
  const clientLine = (clientName ?? "").trim() || "—"

  const plus = calculations.testDetails.filter((t) => PLUS_KEYS.includes(t.key as (typeof PLUS_KEYS)[number]))
  const basic = calculations.testDetails.filter((t) => BASIC_KEYS.includes(t.key as (typeof BASIC_KEYS)[number]))

  const curLabel = `(${currency})`

  const thead = `<thead>
    <tr class="head-main">
      <th class="desc">Descripción</th>
      <th class="nw c">Cantidad</th>
      <th class="nw r">Costo Por Evaluado Sin Descuento ${curLabel}</th>
      <th class="nw r">Monto Total Sin Descuento ${curLabel}</th>
      <th class="nw r">Descuento Por Volumen ${curLabel}</th>
      <th class="nw r">Costo Por Evaluado con Descuento ${curLabel}</th>
      <th class="nw r">Valor a Pagar Multiplicity ${curLabel}</th>
    </tr>
  </thead>`

  const bodyParts: string[] = []
  bodyParts.push(sectionRow("Por Uso", 7, "sec-usage"))
  bodyParts.push(sectionRow("Pruebas Plus", 7, "sec-group-title"))
  let stripeAlt = false
  const pushTestRow = (test: QuotePdfTestDetail) => {
    const stripe = stripeAlt ? "data-row data-row--alt" : "data-row"
    stripeAlt = !stripeAlt
    bodyParts.push(`<tr class="${stripe}">${rowCells(test, formatCurrency, convertCurrency, sym)}</tr>`)
  }
  for (const test of plus) pushTestRow(test)
  bodyParts.push(sectionRow("Pruebas Básicas", 7, "sec-group-title"))
  for (const test of basic) pushTestRow(test)

  bodyParts.push(`<tr class="subtot">
    <td><strong>Subtotales</strong></td>
    <td class="c"><strong>${calculations.totalTests}</strong></td>
    <td class="r">-</td>
    <td class="r"><strong>${fc(c(calculations.subtotalWithoutDiscount))}</strong></td>
    <td class="r"><strong>${fc(c(calculations.totalDiscountAmount))}</strong></td>
    <td class="r">-</td>
    <td class="r"><strong>${fc(c(calculations.subtotalWithDiscount))}</strong></td>
  </tr>`)

  const hasVolumeDiscount = calculations.totalDiscountAmount > 0.0001
  const subList = calculations.subtotalWithoutDiscount
  const itbisOnList = calculations.applyTax ? subList * ITBIS_RATE : 0
  const totalLista = subList + itbisOnList

  const blockListHtml = (() => {
    const rows: string[] = [
      `<tr class="sum-inv"><td class="lbl">Subtotal</td><td class="val">${fc(c(subList))}</td></tr>`,
    ]
    if (calculations.applyTax) {
      rows.push(
        `<tr class="sum-inv"><td class="lbl">ITBIS (18%)</td><td class="val">${fc(c(itbisOnList))}</td></tr>`,
      )
    }
    rows.push(
      `<tr class="sum-inv"><td class="lbl">Total</td><td class="val">${fc(c(totalLista))}</td></tr>`,
    )
    return `<table class="sum sum-block" aria-label="Totales lista">${rows.join("")}</table>`
  })()

  const blockNetHtml = (() => {
    let headerLabel = "Resumen"
    if (hasVolumeDiscount && subList > 0) {
      const pct = Math.round((calculations.totalDiscountAmount / subList) * 100)
      headerLabel = `Descuento por volumen (${pct}%)`
    } else if (hasVolumeDiscount) {
      headerLabel = "Descuento por volumen"
    }
    const rows: string[] = [
      `<tr class="sum-accent-head"><td colspan="2">${esc(headerLabel)}</td></tr>`,
      `<tr class="sum-purp"><td class="lbl">Subtotal</td><td class="val">${fc(c(calculations.subtotalWithDiscount))}</td></tr>`,
    ]
    if (calculations.applyTax) {
      rows.push(
        `<tr class="sum-purp"><td class="lbl">ITBIS (18%)</td><td class="val">${fc(c(calculations.itbisAmount))}</td></tr>`,
      )
    }
    rows.push(
      `<tr class="sum-purp"><td class="lbl">Total Neto</td><td class="val">${fc(calculations.total)}</td></tr>`,
    )
    return `<table class="sum sum-block" aria-label="Totales finales">${rows.join("")}</table>`
  })()

  const singleBlockHtml = (() => {
    const rows: string[] = [
      `<tr class="sum-inv"><td class="lbl">Subtotal</td><td class="val">${fc(c(calculations.subtotalWithDiscount))}</td></tr>`,
    ]
    if (calculations.applyTax) {
      rows.push(
        `<tr class="sum-inv"><td class="lbl">ITBIS (18%)</td><td class="val">${fc(c(calculations.itbisAmount))}</td></tr>`,
      )
    }
    rows.push(
      `<tr class="sum-inv"><td class="lbl">Total Neto</td><td class="val">${fc(calculations.total)}</td></tr>`,
    )
    return `<table class="sum sum-block" aria-label="Totales">${rows.join("")}</table>`
  })()

  const summaryTablesHtml = hasVolumeDiscount
    ? `${blockListHtml}${blockNetHtml}`
    : singleBlockHtml

  const dopNote = showDopUsdNote
    ? `<div class="note"><strong>Nota:</strong> Los precios se muestran en DOP como referencia. La factura será emitida en USD.</div>`
    : ""

  const clientDisplay = clientLine !== "—" ? esc(clientLine) : ""

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Cotización Multiplicity</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4; margin: 14mm 16mm 16mm 16mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "DM Sans", Arial, Helvetica, sans-serif;
      font-size: 10.5pt;
      color: #111827;
      line-height: 1.4;
    }
    .top-bar {
      height: 11px;
      background: ${PDF_TOP_BAR};
      margin: 0 0 18px 0;
      width: 100%;
    }
    .sheet { max-width: 100%; }
    .brand-block { margin-bottom: 16px; }
    .logo { max-height: 36px; width: auto; display: block; margin-bottom: 10px; }
    .letterhead { font-size: 9.75pt; color: #374151; }
    .letterhead p { margin: 0 0 3px 0; }
    .title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      margin-bottom: 14px;
    }
    .title-quote { font-size: 15pt; font-weight: 700; color: #111; letter-spacing: -0.02em; }
    .title-meta { text-align: right; font-size: 10pt; color: #111; }
    .title-meta div { margin-bottom: 4px; }
    .title-meta .k { font-weight: 700; }
    .client-block { font-size: 10pt; margin-bottom: 16px; }
    .client-field {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 10px;
    }
    .client-field .k { font-weight: 700; flex-shrink: 0; min-width: 5.2rem; }
    .client-line {
      flex: 1;
      border-bottom: 1px solid #111827;
      min-height: 1.15em;
      padding: 0 4px 2px 4px;
      font-weight: 600;
    }
    .ref-id { font-size: 9pt; color: #6b7280; margin-top: 4px; }
    .grid { width: 100%; border-collapse: collapse; font-size: 8.25pt; margin-bottom: 16px; }
    .grid th, .grid td { border: 1px solid #374151; padding: 7px 6px; vertical-align: middle; }
    .grid thead tr.head-main th {
      background: ${PDF_PURPLE};
      color: #fff;
      font-weight: 700;
      text-align: center;
      border-color: ${PDF_PURPLE};
    }
    .grid thead th.desc { text-align: left; }
    .grid .c { text-align: center; }
    .grid .r { text-align: right; }
    .grid .nw { white-space: normal; line-height: 1.2; max-width: 0; }
    .grid tr.data-row td { background: #fff; }
    .grid tr.data-row--alt td { background: #f3f4f6; }
    .grid td.sec-usage {
      background: ${PDF_TEAL};
      color: #fff;
      font-weight: 700;
      text-align: left;
      padding: 5px 8px;
      font-size: 8.5pt;
      border-color: ${PDF_TEAL_DEEP};
    }
    .grid td.sec-group-title {
      background: #e5e7eb;
      color: #111827;
      font-weight: 700;
      text-align: left;
      padding: 6px 8px;
      font-size: 8.75pt;
      border-color: #9ca3af;
    }
    .grid tr.subtot td {
      background: #d1d5db;
      font-weight: 700;
      color: #111;
      border-color: #6b7280;
    }
    .sum-wrap {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 14px;
      margin-bottom: 14px;
    }
    .sum-block { border-collapse: collapse; min-width: 270px; max-width: 300px; width: 100%; font-size: 10pt; }
    .sum-block td { padding: 8px 14px; border: none; }
    .sum-inv + .sum-inv td { border-top: 1px solid rgba(255,255,255,0.35); }
    .sum-purp + .sum-purp td { border-top: 1px solid rgba(255,255,255,0.22); }
    .sum-block .lbl { font-weight: 600; text-align: left; }
    .sum-block .val { text-align: right; font-weight: 600; }
    .sum-inv .lbl,
    .sum-inv .val {
      background: ${PDF_GREY_SUM};
      color: #fff;
    }
    .sum-purp .lbl,
    .sum-purp .val {
      background: ${PDF_PURPLE};
      color: #fff;
    }
    .sum-accent-head td {
      background: ${PDF_TEAL};
      color: #111827;
      font-weight: 700;
      text-align: center;
      padding: 9px 14px;
    }
    .note {
      margin-top: 12px;
      padding: 10px 12px;
      background: #fffbeb;
      border: 1px solid #facc15;
      font-size: 9.5pt;
      color: #713f12;
      border-radius: 6px;
    }
    .appendix {
      page-break-before: always;
      padding-top: 72px;
      font-size: 10.5pt;
      color: #111;
      line-height: 1.45;
    }
    .ap-h2 { font-size: 11pt; font-weight: 700; margin: 0 0 8px 0; }
    .ap-h3 { font-size: 10.5pt; font-weight: 700; margin: 18px 0 8px 0; }
    .ap-h3--ul { text-decoration: underline; text-underline-offset: 3px; }
    .ap-bold-title { font-weight: 700; margin: 16px 0 8px 0; }
    .rule {
      border: none;
      border-top: 1px solid #111827;
      margin: 0 0 14px 0;
    }
    .rule--footer { margin-top: 22px; margin-bottom: 28px; }
    .sig-inner { width: 32%; max-width: 200px; }
    .rule--sig { width: 100%; margin: 0 0 6px 0; border-color: #111; }
    .dash-list { list-style: none; padding: 0; margin: 0 0 16px 0; }
    .dash-list li { margin: 5px 0; padding-left: 0; }
    .dash-list li::before { content: "- "; font-weight: 600; }
    .ap-lines p { margin: 5px 0 5px 0; padding-left: 0; }
    .sig-block { margin-top: 8px; }
    .sig-label { font-weight: 700; text-align: center; width: 100%; font-size: 10pt; margin: 0; }
  </style>
</head>
<body>
  <div class="top-bar" aria-hidden="true"></div>
  <div class="sheet">
  <div class="brand-block">
    <img class="logo" src="${esc(origin)}/images/multiplicity-logo.png" alt="Multiplicity" />
    <div class="letterhead">
      <p>Edif. La Isla Piso 1</p>
      <p>Avenida Tiradentes #30</p>
      <p>Santo Domingo, Rep. Dominicana</p>
      <p>Tel.: 809-565-0747</p>
      <p>R.N.C. 124-03034-1</p>
    </div>
  </div>

  <div class="title-row">
    <span class="title-quote">Cotización</span>
    <div class="title-meta">
      <div><span class="k">Fecha:</span> ${esc(dateShort)}</div>
      <div><span class="k">No.:</span></div>
    </div>
  </div>

  <div class="client-block">
    <div class="client-field">
      <span class="k">Cliente:</span>
      <span class="client-line">${clientDisplay || "&nbsp;"}</span>
    </div>
    <div class="client-field">
      <span class="k">RNC:</span>
      <span class="client-line">&nbsp;</span>
    </div>
    <div class="client-field">
      <span class="k">Teléfono:</span>
      <span class="client-line">&nbsp;</span>
    </div>
    ${companyId ? `<p class="ref-id">Referencia cuenta: ${esc(companyId)}</p>` : ""}
  </div>

  <table class="grid">
    ${thead}
    <tbody>
      ${bodyParts.join("\n")}
    </tbody>
  </table>

  <div class="sum-wrap">
    ${summaryTablesHtml}
  </div>

  ${dopNote}

  ${PDF_APPENDIX_HTML}
  </div>
</body>
</html>`
}
