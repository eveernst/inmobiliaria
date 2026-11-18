# inmobiliaria

Frontend del sistema de gestión de propiedades de la Asociación Argentina Central (AAC),
proyecto de Informática Aplicada (UAP). Permite consultar propiedades, instalaciones y su
documentación (seguros, alquileres, planos y escrituras), descargar documentos en PDF y ver los
avisos de vencimiento. La API vive en
[eveernst/inmobiliaria_api](https://github.com/eveernst/inmobiliaria_api).

Stack: Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS, react-hook-form, jsPDF y
Supabase Storage para las imágenes.

## Configuración local

```bash
npm install
cp .env.example .env.local   # y completá los valores
npm run dev                  # http://localhost:3001
```

Variables de entorno (ver `.env.example`):

| Variable | Para qué sirve |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL de la API. Por defecto `http://localhost:3000`; hay que definirla en cualquier entorno desplegado |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto de Supabase (Storage) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública `anon` de Supabase. Nunca uses la `service_role` |

Las variables `NEXT_PUBLIC_*` quedan visibles en el navegador; no pongas secretos en ellas.

## Comandos

```bash
npm run dev            # desarrollo en el puerto 3001
npm run build          # build de producción
npm start              # sirve el build en el puerto 3001
npm run lint           # ESLint
npx tsc --noEmit       # verificación de tipos
```

Este repositorio no tiene pruebas automáticas ni integración continua: antes de abrir un pull
request se corren `npx tsc --noEmit`, `npm run lint` y `npm run build`.

## Roles

| Rol | Qué puede hacer |
|---|---|
| Usuario común | Consultar propiedades, instalaciones, documentación y avisos; descargar documentos en PDF |
| Administrador | Lo anterior, más alta, modificación y baja de propiedades, instalaciones y documentación |
| Superusuario | Consultar, y gestionar usuarios (alta, modificación, baja y cambio de rol) |

Los permisos reales los aplica la API; el frontend solo oculta lo que cada rol no puede usar.

## Despliegue (Render)

- Build: `npm run build`. Start: `npm start`.
- Definir `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` antes
  del build (se incorporan al código en la compilación).
- En el plan gratuito de Render el servicio se duerme tras un rato sin tráfico: la primera carga
  puede tardar entre 30 y 60 segundos. Lo mismo vale para la API.
