"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkPassword, createSession, deleteSession, panelConfigured } from "@/lib/session";

export type LoginState = { error?: string };

// Freno simple contra fuerza bruta: 5 intentos fallidos por IP cada 15 minutos (en memoria del contenedor)
const WINDOW = 15 * 60 * 1000;
const MAX_FAILS = 5;
const fails = new Map<string, { count: number; since: number }>();

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!panelConfigured()) return { error: "El panel no está configurado (faltan ADMIN_PASSWORD o SESSION_SECRET)." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const entry = fails.get(ip);
  if (entry && now - entry.since > WINDOW) fails.delete(ip);
  if ((fails.get(ip)?.count ?? 0) >= MAX_FAILS) return { error: "Demasiados intentos. Prueba de nuevo en 15 minutos." };

  if (!checkPassword(String(formData.get("password") ?? ""))) {
    const current = fails.get(ip) ?? { count: 0, since: now };
    fails.set(ip, { count: current.count + 1, since: current.since });
    await new Promise((r) => setTimeout(r, 800));
    return { error: "Contraseña incorrecta." };
  }

  fails.delete(ip);
  await createSession();
  redirect("/panel");
}

export async function logout() {
  await deleteSession();
  redirect("/panel/login");
}
