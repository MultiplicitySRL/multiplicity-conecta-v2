// Firma de los enlaces que Assess pone en el iframe de /cotizar-por-pruebas (?company_id=…&exp=…&sig=…).
// Sin firma, cualquiera puede pedir las facturas de otro cliente cambiando el company_id de la URL.
//   · Con ASSESS_LINK_SECRET definido, /api/alegra/* exige una firma válida y vigente.
//   · Sin la variable, todo sigue como antes (mientras Assess no firme los enlaces).
// Firma: hex(HMAC-SHA256(ASSESS_LINK_SECRET, `${clientId}.${exp}`)), con exp = vencimiento en segundos Unix.
import { createHmac, timingSafeEqual } from "node:crypto"

export function assessLinkRequired(): boolean {
  return Boolean(process.env.ASSESS_LINK_SECRET)
}

export function verifyAssessLink(clientId: string, exp: string | null, sig: string | null): boolean {
  const secret = process.env.ASSESS_LINK_SECRET
  if (!secret) return true
  if (!exp || !sig || !/^\d{1,12}$/.test(exp) || !/^[0-9a-f]{64}$/i.test(sig)) return false
  if (Number(exp) * 1000 < Date.now()) return false
  const expected = createHmac("sha256", secret).update(`${clientId}.${exp}`).digest()
  return timingSafeEqual(expected, Buffer.from(sig, "hex"))
}
