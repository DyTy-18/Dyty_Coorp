import "server-only";
import { randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

// Los leads se guardan como una línea JSON por formulario (JSONL). En Dokploy, DATA_DIR es un volumen
// para que sobrevivan a cada deploy. Suficiente para el volumen de un formulario de contacto.
const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "data");
const file = path.join(dataDir, "leads.jsonl");

export type Lead = {
  id: string;
  name: string;
  phone: string;
  business: string;
  need: string;
  message: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  source: string;
  createdAt: string;
};

export async function saveLead(lead: Omit<Lead, "id">) {
  await mkdir(dataDir, { recursive: true });
  await appendFile(file, JSON.stringify({ id: randomUUID(), ...lead }) + "\n", "utf8");
}

// Más recientes primero
export async function getLeads(): Promise<Lead[]> {
  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }

  const leads: Lead[] = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      leads.push(JSON.parse(line));
    } catch {
      console.error("[leads] línea inválida en leads.jsonl, se omite");
    }
  }
  return leads.reverse();
}
