# dyty.dev

Sitio de dyty: Next.js 16 (App Router) + Tailwind CSS 4, en español, listo para desplegar en Dokploy con Docker.

## Desarrollo

```bash
npm install
npm run dev
```

Crea un `.env.local` (git lo ignora) con las variables que necesites:

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número sin `+` (ej. `59162356328`). Si falta, usa el de `site.ts` |
| `LEAD_WEBHOOK_URL` | Opcional: reenvía cada lead en JSON |
| `ADMIN_PASSWORD` | Contraseña del panel `/panel` |
| `SESSION_SECRET` | Texto aleatorio de 32+ caracteres: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `DATA_DIR` | Carpeta de los leads (por defecto `./data`; en Docker `/app/data`) |

## Estructura

- `src/lib/site.ts`: textos del negocio (servicios, casos, paquetes, WhatsApp). Los valores entre `[corchetes]` están pendientes.
- `src/components/`: secciones de la landing.
- `src/app/actions.ts`: Server Action del formulario. Guarda el lead (`src/lib/leads.ts`) y lo reenvía a `LEAD_WEBHOOK_URL` si existe.
- `src/app/panel/`: panel privado de leads con login.

## Deploy en Dokploy

1. Crea una aplicación en Dokploy y conéctala a este repositorio.
2. Build type: **Dockerfile** (ruta `./Dockerfile`).
3. Variables:
   - **Build Args:** `NEXT_PUBLIC_WHATSAPP_NUMBER` (se incrusta en el build).
   - **Environment:** `ADMIN_PASSWORD`, `SESSION_SECRET` y, si lo usas, `LEAD_WEBHOOK_URL`.
   - **Volumes:** un Volume montado en `/app/data` (ahí viven los leads; sin él se borran en cada deploy).
4. Puerto del contenedor: `3000`.
5. En Domains, agrega `dyty.dev` (y `www.dyty.dev` con redirección) y activa HTTPS con Let's Encrypt.

Prueba local de la imagen:

```bash
docker build --build-arg NEXT_PUBLIC_WHATSAPP_NUMBER=59162356328 -t dyty-page .
docker run -p 3000:3000 -e LEAD_WEBHOOK_URL=https://... dyty-page
```
