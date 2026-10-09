# dyty.dev

Sitio de dyty: Next.js 16 (App Router) + Tailwind CSS 4, en español, listo para desplegar en Dokploy con Docker.

## Desarrollo

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Estructura

- `src/lib/site.ts`: textos del negocio (servicios, casos, paquetes, WhatsApp). Los valores entre `[corchetes]` están pendientes.
- `src/components/`: secciones de la landing.
- `src/app/actions.ts`: Server Action del formulario. Envía el lead en JSON a `LEAD_WEBHOOK_URL`.

## Deploy en Dokploy

1. Crea una aplicación en Dokploy y conéctala a este repositorio.
2. Build type: **Dockerfile** (ruta `./Dockerfile`).
3. Variables:
   - **Build Args:** `NEXT_PUBLIC_WHATSAPP_NUMBER` (se incrusta en el build).
   - **Environment:** `LEAD_WEBHOOK_URL`.
4. Puerto del contenedor: `3000`.
5. En Domains, agrega `dyty.dev` (y `www.dyty.dev` con redirección) y activa HTTPS con Let's Encrypt.

Prueba local de la imagen:

```bash
docker build --build-arg NEXT_PUBLIC_WHATSAPP_NUMBER=5215512345678 -t dyty-page .
docker run -p 3000:3000 -e LEAD_WEBHOOK_URL=https://... dyty-page
```
