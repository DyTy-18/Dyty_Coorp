# Atribución de skills

Las skills de esta carpeta vienen de [Hainrixz/claude-webkit](https://github.com/Hainrixz/claude-webkit) (MIT),
que a su vez las tomó de sus autores originales. Copiadas el 2026-10-11.

| Skill | Origen | Licencia | Cambios locales |
|---|---|---|---|
| `frontend-design` | Anthropic (vía claude-webkit) | Apache 2.0 — `NOTICE.md` | Ninguno |
| `humanizer` | blader/humanizer (vía claude-webkit) | No indicada en claude-webkit | Ninguno |
| `seo-audit` | claude-webkit | No indicada | Ninguno |
| `vercel-react-best-practices` | Vercel | MIT (frontmatter) | Ninguno |
| `web-design-guidelines` | Vercel | No indicada | Ninguno. Descarga sus reglas al usarse desde `raw.githubusercontent.com/vercel-labs/web-interface-guidelines` |
| `emil-design-eng` | emilkowalski/skills | MIT — `LICENSE.txt` | La de claude-webkit (M1 en `NOTICE.md`): quitó el "saluda y espera" |
| `animate` | emilkowalski/skills | MIT — `LICENSE.txt` | claude-webkit la apuntó a `shadcn-ui` (M2); aquí se cambió para pedir confirmación antes de agregar una librería headless, porque este proyecto no usa shadcn |
| `review-animations` | emilkowalski/skills | MIT — `LICENSE.txt` | Ninguno |
| `find-animation-opportunities` | emilkowalski/skills | MIT — `LICENSE.txt` | Ninguno |

No se copiaron: `vercel-deploy` (usamos Dokploy), `shadcn-ui` y `building-components` (no usamos shadcn),
`apple-design` (recomienda fuentes del sistema), `ui-ux-pro-max` (ya instalada globalmente), `playwright-cli`,
`chrome-bridge-automation`, `web-reader`, `deep-research`, `prototype`, `improve-animations`, `animation-vocabulary`.

`find-animation-opportunities` menciona `improve-animations` como siguiente paso; esa skill no está aquí.
