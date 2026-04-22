"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  submitRegistration,
  type RegistrationFormData,
} from "@/lib/services/client-registration";
import { InvalidInvitation } from "@/components/invalid-invitation";

// ── Validation helpers (same logic as ScenarioCard) ──────────────────────────

function isValidEmail(email: string): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  if (!phone) return true; // optional unless required separately
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10;
}

function getRncError(value: string): string | null {
  const v = value.trim();
  if (!v) return "Este campo es obligatorio.";
  if (!/^\d{9}$/.test(v)) return "Debe contener exactamente 9 dígitos.";
  return null;
}

// ── Field limits ──────────────────────────────────────────────────────────────

const LIMITS = {
  razonSocial: 150,
  rnc: 9,
  direccion: 300,
  nombre: 100,
  email: 150,
  posicion: 100,
  telefono: 15,
} as const;

// ── Select options (same values as ScenarioCard) ──────────────────────────────

const TIPO_NCF_OPTIONS = [
  { value: "Crédito Fiscal", label: "Crédito Fiscal" },
  { value: "Gubernamental", label: "Gubernamental" },
  { value: "Régimen Especial de Tributación", label: "Régimen Especial de Tributación" },
];

const MEDIO_ENTREGA_OPTIONS = [
  { value: "Correo electrónico", label: "Correo electrónico" },
  { value: "Entrega física", label: "Entrega física" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">{title}</h2>
      {children}
    </div>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Props & form state ────────────────────────────────────────────────────────

interface RegistrationFormProps {
  token: string;
  inviteeName: string | null;
  inviteeEmail: string | null;
}

type PageState = "idle" | "submitting" | "success" | "invalid_token";

// ── Component ─────────────────────────────────────────────────────────────────

export function RegistrationForm({ token, inviteeName, inviteeEmail }: RegistrationFormProps) {
  const [pageState, setPageState] = useState<PageState>("idle");
  const [successEmail, setSuccessEmail] = useState("");
  const [showAdmin2, setShowAdmin2] = useState(false);
  const [showFact2, setShowFact2] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [fd, setFd] = useState<RegistrationFormData>({
    razonSocial: "",
    rnc: "",
    direccion: "",
    tipoNCF: "",
    medioEntrega: "",
    contactoFact1Nombre: "",
    contactoFact1Email: "",
    contactoFact1Posicion: "",
    contactoFact1Telefono: "",
    contactoFact2Nombre: "",
    contactoFact2Email: "",
    contactoFact2Posicion: "",
    contactoFact2Telefono: "",
    contactoAdmin1Nombre: inviteeName ?? "",
    contactoAdmin1Email: inviteeEmail ?? "",
    contactoAdmin1Posicion: "",
    contactoAdmin1Telefono: "",
    contactoAdmin2Nombre: "",
    contactoAdmin2Email: "",
    contactoAdmin2Posicion: "",
    contactoAdmin2Telefono: "",
  });

  function set(field: keyof RegistrationFormData, value: string) {
    setFd((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validate(): boolean {
    const e: Record<string, string> = {};

    // ── Empresa
    if (!fd.razonSocial.trim()) e.razonSocial = "Este campo es obligatorio.";
    const rncErr = getRncError(fd.rnc ?? "");
    if (rncErr) e.rnc = rncErr;
    if (!fd.direccion?.trim()) e.direccion = "Este campo es obligatorio.";

    // ── Contacto facturación 1
    if (!fd.contactoFact1Nombre?.trim()) e.contactoFact1Nombre = "Este campo es obligatorio.";
    if (!fd.contactoFact1Posicion?.trim()) e.contactoFact1Posicion = "Este campo es obligatorio.";
    if (!fd.contactoFact1Email) {
      e.contactoFact1Email = "Este campo es obligatorio.";
    } else if (!isValidEmail(fd.contactoFact1Email)) {
      e.contactoFact1Email = "Introduce un correo válido.";
    }
    if (!fd.contactoFact1Telefono) {
      e.contactoFact1Telefono = "Este campo es obligatorio.";
    } else if (!isValidPhone(fd.contactoFact1Telefono)) {
      e.contactoFact1Telefono = "Introduce un teléfono válido (10 dígitos).";
    }

    // ── Contacto facturación 2 (opcional — solo validar si tiene algún dato)
    if (fd.contactoFact2Email && !isValidEmail(fd.contactoFact2Email)) {
      e.contactoFact2Email = "Introduce un correo válido.";
    }
    if (fd.contactoFact2Telefono && !isValidPhone(fd.contactoFact2Telefono)) {
      e.contactoFact2Telefono = "Introduce un teléfono válido (10 dígitos).";
    }

    // ── Contacto admin 1
    if (!fd.contactoAdmin1Nombre?.trim()) e.contactoAdmin1Nombre = "Este campo es obligatorio.";
    if (!fd.contactoAdmin1Posicion?.trim()) e.contactoAdmin1Posicion = "Este campo es obligatorio.";
    if (!fd.contactoAdmin1Email) {
      e.contactoAdmin1Email = "Este campo es obligatorio.";
    } else if (!isValidEmail(fd.contactoAdmin1Email)) {
      e.contactoAdmin1Email = "Introduce un correo válido.";
    }
    if (!fd.contactoAdmin1Telefono) {
      e.contactoAdmin1Telefono = "Este campo es obligatorio.";
    } else if (!isValidPhone(fd.contactoAdmin1Telefono)) {
      e.contactoAdmin1Telefono = "Introduce un teléfono válido (10 dígitos).";
    }

    // ── Contacto admin 2 (opcional)
    if (fd.contactoAdmin2Email && !isValidEmail(fd.contactoAdmin2Email)) {
      e.contactoAdmin2Email = "Introduce un correo válido.";
    }
    if (fd.contactoAdmin2Telefono && !isValidPhone(fd.contactoAdmin2Telefono)) {
      e.contactoAdmin2Telefono = "Introduce un teléfono válido (10 dígitos).";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    setPageState("submitting");
    const result = await submitRegistration(token, fd);

    if (result.ok) {
      setSuccessEmail(fd.contactoAdmin1Email);
      setPageState("success");
    } else if (result.reason === "invalid_or_used_token") {
      setPageState("invalid_token");
    } else {
      setPageState("idle");
      alert("Ocurrió un error al enviar el formulario. Por favor intente nuevamente.");
    }
  }

  // ── Render states ──────────────────────────────────────────────────────────

  if (pageState === "invalid_token") {
    return <InvalidInvitation reason="already_used" />;
  }

  if (pageState === "success") {
    return (
      <div className="min-h-screen bg-[#EDEEF2] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center space-y-5">
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-gray-900">¡Registro completado!</h1>
            <p className="text-gray-500 text-sm">
              Hemos enviado las credenciales de acceso a{" "}
              <strong className="text-gray-700">{successEmail}</strong>.
            </p>
            <p className="text-gray-500 text-sm">
              Revisa tu bandeja de entrada — incluyendo la carpeta de spam.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#EDEEF2] py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/multiplicity-logo.png"
            alt="Multiplicity"
            className="h-10 w-auto mx-auto"
          />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Registro de empresa</h1>
          <p className="text-gray-500 text-sm">
            Completa el formulario para activar tu acceso a la plataforma.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">

          {/* ── Datos de la empresa ── */}
          <FormSection title="Datos de la empresa">
            <FieldRow>
              <Field label="Razón social" required error={errors.razonSocial}>
                <Input
                  value={fd.razonSocial}
                  onChange={(e) => set("razonSocial", e.target.value)}
                  placeholder="Nombre legal de la empresa"
                  maxLength={LIMITS.razonSocial}
                  className={errors.razonSocial ? "border-red-400" : ""}
                />
              </Field>
              <Field label="RNC" required error={errors.rnc}>
                <Input
                  value={fd.rnc}
                  onChange={(e) => set("rnc", e.target.value)}
                  placeholder="000000000"
                  inputMode="numeric"
                  maxLength={LIMITS.rnc}
                  className={errors.rnc ? "border-red-400" : ""}
                />
              </Field>
            </FieldRow>

            <Field label="Dirección" required error={errors.direccion}>
              <Textarea
                value={fd.direccion}
                onChange={(e) => set("direccion", e.target.value)}
                placeholder="Dirección fiscal completa"
                rows={3}
                maxLength={LIMITS.direccion}
                className={`resize-none ${errors.direccion ? "border-red-400" : ""}`}
              />
            </Field>

            <FieldRow>
              <Field label="Tipo de comprobante (NCF)" error={errors.tipoNCF}>
                <Select value={fd.tipoNCF} onValueChange={(v) => set("tipoNCF", v)}>
                  <SelectTrigger className={errors.tipoNCF ? "border-red-400" : ""}>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPO_NCF_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Medio de entrega de factura" error={errors.medioEntrega}>
                <Select value={fd.medioEntrega} onValueChange={(v) => set("medioEntrega", v)}>
                  <SelectTrigger className={errors.medioEntrega ? "border-red-400" : ""}>
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDIO_ENTREGA_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldRow>
          </FormSection>

          {/* ── Contactos de facturación ── */}
          <FormSection title="Contactos de facturación">
            <FieldRow>
              <Field label="Nombre" required error={errors.contactoFact1Nombre}>
                <Input
                  value={fd.contactoFact1Nombre}
                  onChange={(e) => set("contactoFact1Nombre", e.target.value)}
                  placeholder="Nombre completo"
                  maxLength={LIMITS.nombre}
                  className={errors.contactoFact1Nombre ? "border-red-400" : ""}
                />
              </Field>
              <Field label="Posición" required error={errors.contactoFact1Posicion}>
                <Input
                  value={fd.contactoFact1Posicion}
                  onChange={(e) => set("contactoFact1Posicion", e.target.value)}
                  placeholder="Cargo"
                  maxLength={LIMITS.posicion}
                  className={errors.contactoFact1Posicion ? "border-red-400" : ""}
                />
              </Field>
              <Field label="Email" required error={errors.contactoFact1Email}>
                <Input
                  type="email"
                  value={fd.contactoFact1Email}
                  onChange={(e) => set("contactoFact1Email", e.target.value)}
                  placeholder="correo@empresa.com"
                  maxLength={LIMITS.email}
                  className={errors.contactoFact1Email ? "border-red-400" : ""}
                />
              </Field>
              <Field label="Teléfono" required error={errors.contactoFact1Telefono}>
                <Input
                  value={fd.contactoFact1Telefono}
                  onChange={(e) => set("contactoFact1Telefono", e.target.value)}
                  placeholder="8090000000"
                  inputMode="tel"
                  maxLength={LIMITS.telefono}
                  className={errors.contactoFact1Telefono ? "border-red-400" : ""}
                />
              </Field>
            </FieldRow>

            {!showFact2 ? (
              <button
                type="button"
                onClick={() => setShowFact2(true)}
                className="text-sm text-indigo-600 hover:underline"
              >
                + Añadir segundo contacto de facturación (opcional)
              </button>
            ) : (
              <div className="space-y-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Segundo contacto de facturación</p>
                <FieldRow>
                  <Field label="Nombre" error={errors.contactoFact2Nombre}>
                    <Input
                      value={fd.contactoFact2Nombre}
                      onChange={(e) => set("contactoFact2Nombre", e.target.value)}
                      placeholder="Nombre completo"
                      maxLength={LIMITS.nombre}
                      className={errors.contactoFact2Nombre ? "border-red-400" : ""}
                    />
                  </Field>
                  <Field label="Posición" error={errors.contactoFact2Posicion}>
                    <Input
                      value={fd.contactoFact2Posicion}
                      onChange={(e) => set("contactoFact2Posicion", e.target.value)}
                      placeholder="Cargo"
                      maxLength={LIMITS.posicion}
                    />
                  </Field>
                  <Field label="Email" error={errors.contactoFact2Email}>
                    <Input
                      type="email"
                      value={fd.contactoFact2Email}
                      onChange={(e) => set("contactoFact2Email", e.target.value)}
                      placeholder="correo@empresa.com"
                      maxLength={LIMITS.email}
                      className={errors.contactoFact2Email ? "border-red-400" : ""}
                    />
                  </Field>
                  <Field label="Teléfono" error={errors.contactoFact2Telefono}>
                    <Input
                      value={fd.contactoFact2Telefono}
                      onChange={(e) => set("contactoFact2Telefono", e.target.value)}
                      placeholder="8090000000"
                      inputMode="tel"
                      maxLength={LIMITS.telefono}
                      className={errors.contactoFact2Telefono ? "border-red-400" : ""}
                    />
                  </Field>
                </FieldRow>
              </div>
            )}
          </FormSection>

          {/* ── Administradores de plataforma ── */}
          <FormSection title="Administradores de plataforma">
            <p className="text-xs text-gray-500 -mt-2">
              El administrador principal recibirá las credenciales de acceso a la plataforma.
            </p>
            <FieldRow>
              <Field label="Nombre" required error={errors.contactoAdmin1Nombre}>
                <Input
                  value={fd.contactoAdmin1Nombre}
                  onChange={(e) => set("contactoAdmin1Nombre", e.target.value)}
                  placeholder="Nombre completo"
                  maxLength={LIMITS.nombre}
                  className={errors.contactoAdmin1Nombre ? "border-red-400" : ""}
                />
              </Field>
              <Field label="Posición" required error={errors.contactoAdmin1Posicion}>
                <Input
                  value={fd.contactoAdmin1Posicion}
                  onChange={(e) => set("contactoAdmin1Posicion", e.target.value)}
                  placeholder="Cargo"
                  maxLength={LIMITS.posicion}
                  className={errors.contactoAdmin1Posicion ? "border-red-400" : ""}
                />
              </Field>
              <Field label="Email" required error={errors.contactoAdmin1Email}>
                <Input
                  type="email"
                  value={fd.contactoAdmin1Email}
                  onChange={(e) => set("contactoAdmin1Email", e.target.value)}
                  placeholder="correo@empresa.com"
                  maxLength={LIMITS.email}
                  className={errors.contactoAdmin1Email ? "border-red-400" : ""}
                />
              </Field>
              <Field label="Teléfono" required error={errors.contactoAdmin1Telefono}>
                <Input
                  value={fd.contactoAdmin1Telefono}
                  onChange={(e) => set("contactoAdmin1Telefono", e.target.value)}
                  placeholder="8090000000"
                  inputMode="tel"
                  maxLength={LIMITS.telefono}
                  className={errors.contactoAdmin1Telefono ? "border-red-400" : ""}
                />
              </Field>
            </FieldRow>

            {!showAdmin2 ? (
              <button
                type="button"
                onClick={() => setShowAdmin2(true)}
                className="text-sm text-indigo-600 hover:underline"
              >
                + Añadir segundo administrador (opcional)
              </button>
            ) : (
              <div className="space-y-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Segundo administrador</p>
                <FieldRow>
                  <Field label="Nombre" error={errors.contactoAdmin2Nombre}>
                    <Input
                      value={fd.contactoAdmin2Nombre}
                      onChange={(e) => set("contactoAdmin2Nombre", e.target.value)}
                      placeholder="Nombre completo"
                      maxLength={LIMITS.nombre}
                      className={errors.contactoAdmin2Nombre ? "border-red-400" : ""}
                    />
                  </Field>
                  <Field label="Posición" error={errors.contactoAdmin2Posicion}>
                    <Input
                      value={fd.contactoAdmin2Posicion}
                      onChange={(e) => set("contactoAdmin2Posicion", e.target.value)}
                      placeholder="Cargo"
                      maxLength={LIMITS.posicion}
                    />
                  </Field>
                  <Field label="Email" error={errors.contactoAdmin2Email}>
                    <Input
                      type="email"
                      value={fd.contactoAdmin2Email}
                      onChange={(e) => set("contactoAdmin2Email", e.target.value)}
                      placeholder="correo@empresa.com"
                      maxLength={LIMITS.email}
                      className={errors.contactoAdmin2Email ? "border-red-400" : ""}
                    />
                  </Field>
                  <Field label="Teléfono" error={errors.contactoAdmin2Telefono}>
                    <Input
                      value={fd.contactoAdmin2Telefono}
                      onChange={(e) => set("contactoAdmin2Telefono", e.target.value)}
                      placeholder="8090000000"
                      inputMode="tel"
                      maxLength={LIMITS.telefono}
                      className={errors.contactoAdmin2Telefono ? "border-red-400" : ""}
                    />
                  </Field>
                </FieldRow>
              </div>
            )}
          </FormSection>

          <Button type="submit" className="w-full" disabled={pageState === "submitting"}>
            {pageState === "submitting" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Completar registro"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
