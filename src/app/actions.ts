"use server";

import { saveLead } from "@/lib/leads";
import { leadNeeds } from "@/lib/site";

export type LeadState = {
  ok: boolean;
  message: string;
  errors?: Partial<Record<"name" | "phone" | "need", string>>;
  // Lo que escribió el usuario, para no vaciar el formulario si hay errores
  values?: Partial<Record<"name" | "phone" | "business" | "need" | "message", string>>;
};

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  // Campo trampa para bots: los humanos no lo ven
  if (formData.get("company_website")) return { ok: true, message: "¡Gracias! Te escribimos pronto." };

  const lead = {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    business: String(formData.get("business") ?? "").trim(),
    need: String(formData.get("need") ?? ""),
    message: String(formData.get("message") ?? "").trim().slice(0, 2000),
    utm_source: String(formData.get("utm_source") ?? ""),
    utm_medium: String(formData.get("utm_medium") ?? ""),
    utm_campaign: String(formData.get("utm_campaign") ?? ""),
    source: "dyty.dev",
    createdAt: new Date().toISOString(),
  };

  const errors: LeadState["errors"] = {};
  if (lead.name.length < 2) errors.name = "Escribe tu nombre.";
  if (lead.phone.replace(/\D/g, "").length < 8) errors.phone = "Escribe un WhatsApp válido, con código de país.";
  if (!leadNeeds.some((n) => n.value === lead.need)) errors.need = "Elige una opción.";
  const values = { name: lead.name, phone: lead.phone, business: lead.business, need: lead.need, message: lead.message };
  if (Object.keys(errors).length) return { ok: false, message: "Revisa los campos marcados.", errors, values };

  // Se guarda para el panel (/panel) y, si hay webhook, también se reenvía. Basta con que uno funcione.
  let saved = false;
  try {
    await saveLead(lead);
    saved = true;
  } catch (err) {
    console.error("[lead] no se pudo guardar:", err, lead);
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  let sent = false;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      sent = true;
    } catch (err) {
      console.error("[lead] error enviando al webhook:", err);
    }
  }

  if (!saved && !sent) {
    return { ok: false, message: "No pudimos enviar tu mensaje. Escríbenos directo por WhatsApp.", values };
  }
  return { ok: true, message: "¡Gracias! Te escribimos pronto por WhatsApp." };
}
