import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Sesión del panel: un solo usuario (ADMIN_PASSWORD). La cookie guarda la fecha de vencimiento firmada con
// SESSION_SECRET; no hay nada que leer del lado del cliente.
const COOKIE = "dyty_panel";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 días

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET falta o tiene menos de 32 caracteres");
  return s;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

// Compara por hash para que el tiempo no dependa del largo ni del contenido
function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function panelConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && (process.env.SESSION_SECRET?.length ?? 0) >= 32);
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && safeEqual(password, expected!);
}

export async function createSession() {
  const expires = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/panel",
    maxAge: MAX_AGE,
  });
}

export async function deleteSession() {
  (await cookies()).delete({ name: COOKIE, path: "/panel" });
}

export async function isLoggedIn() {
  // Lee la cookie antes que nada: así la página se arma en cada visita y no se prerenderiza en el build
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value || !panelConfigured()) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature || !safeEqual(signature, sign(expires))) return false;
  return Number(expires) > Date.now();
}
