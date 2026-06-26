# Decora Events — Sitio web de catálogo y cotización

Sitio web estático para **Decora Events**, empresa colombiana de decoración para eventos y celebraciones. Los clientes exploran el catálogo, arman su selección y la envían directamente al WhatsApp del negocio con un solo toque.

## Tecnologías

- **React 19** + **Vite 6**
- **Tailwind CSS v4** (configuración por `@theme` en `index.css`)
- **lucide-react** para íconos
- Estado del carrito en `localStorage` (sin backend)

---

## Arrancar en local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
# → http://localhost:5173

# 3. Generar build de producción
npm run build

# 4. Previsualizar el build
npm run preview
```

---

## Cómo cambiar el número de WhatsApp

Abre `src/config/site.js` y edita la propiedad `whatsapp`:

```js
export const SITE_CONFIG = {
  whatsapp: '573103112856',  // ← indicativo + número, sin espacios ni signos
  // ...
}
```

---

## Cómo editar el catálogo

Todo el catálogo está en **`src/data/catalogo.js`**.
Cada decoración tiene esta estructura:

```js
{
  id: 'inf-01',                     // ID único (no repetir)
  categoria: 'infantiles',          // debe coincidir con CATEGORIAS[].id
  nombre: 'Montaje temático Safari',
  descripcion: 'Arco de globos...',
  precio: 450000,                   // número entero en pesos COP
  imagen: 'https://...',            // URL externa o ruta local (ver abajo)
  personalizacion: ['Verde/café', 'Pastel'],  // null si no tiene opciones
}
```

### Categorías disponibles

| `id`         | Nombre visible                               |
|--------------|----------------------------------------------|
| `cumpleanos` | Decoraciones de Cumpleaños                   |
| `quince`     | Decoraciones de 15 Años                      |
| `babyshower` | Baby Shower y Revelación de Género           |
| `bautizo`    | Decoraciones de Bautizo                      |
| `grado`      | Decoraciones de Grado                        |

---

## Cómo agregar imágenes reales

1. Optimiza las fotos con el script (las convierte a WebP 800×600 < 200 KB):

```
node scripts/optimizar-imagenes.mjs --src "<carpeta_origen>" --dest "public/img/catalogo/<categoria>"
```

2. En `src/data/productos.json`, apunta el campo `imagen` a la ruta local. Las
   imágenes viven en `public/`, así que se sirven como ruta absoluta `/img/...`:

```json
"imagen": "/img/catalogo/cumpleanos/mi-foto.webp"
```

3. **Formato:** el script ya entrega WebP 4:3 (800×600) por debajo de 200 KB.

### Logo

El logo real está en `src/assets/logo-decora-events.svg` (vectorial, lo usa
`Logo.jsx`). El `.png` (`logo-decora-events.png`) queda como respaldo para usos
donde el SVG no sirva (redes, og-image, email).

### Foto del hero

El fondo del hero es el **LCP** de la home y se sirve local con variantes
responsive (AVIF/WebP/JPEG, 640→2400 px) desde `public/img/hero/`, generadas
por `scripts/optimizar-hero.mjs`. El `<picture>` está en
`src/components/home/Hero.jsx` y el `<link rel="preload">` de la variante AVIF
se inyecta solo en la home desde `scripts/prerender.mjs`. La imagen lleva un
efecto **Ken Burns** en CSS (clase `.hero-kenburns` en `src/index.css`).

Para cambiar la foto, pon el original (máxima resolución, fuera del repo) y
regenera las variantes:

```
node scripts/optimizar-hero.mjs --src "C:/Users/juanc/Downloads/hero-decora.jpg"
```

El script imprime los `srcset` y el `width/height` (aspect-ratio) por si cambia
el encuadre. Si cambian los anchos, actualiza `HERO_WIDTHS` en `Hero.jsx` y en
`scripts/prerender.mjs`.

---

## Estructura de carpetas

```
src/
├── assets/
│   ├── logo-decora-events.svg     ← logo real (lo usa Logo.jsx)
│   └── logo-decora-events.png     ← respaldo en PNG
│   (las fotos del catálogo viven en public/img/catalogo/<categoria>/)
├── components/
│   ├── layout/   Header, Footer, Logo
│   ├── home/     Hero, CategoriesGrid, Portfolio, Testimonials, AboutUs
│   ├── catalog/  CatalogSection, ProductCard
│   └── cart/     CartDrawer, CartButton, WhatsAppFab
├── config/
│   └── site.js           ← datos del negocio (WhatsApp, redes, nombre)
├── context/
│   └── CartContext.jsx   ← estado global del carrito + localStorage
├── data/
│   └── catalogo.js       ← TODO el catálogo de decoraciones
├── hooks/
│   └── useCart.js
└── utils/
    ├── formatPrice.js          ← formatea a $450.000
    └── buildWhatsAppMessage.js ← construye el link wa.me
```

---

## Desplegar en Vercel

```bash
# 1. Instala Vercel CLI (si no lo tienes)
npm i -g vercel

# 2. Desde la raíz del proyecto
vercel
# Build command: npm run build | Output: dist
```

O conecta el repositorio desde **vercel.com → Import Project → Deploy**.
Vercel detecta Vite automáticamente sin configuración extra.

## Desplegar en Netlify

1. Ejecuta `npm run build`
2. Arrastra la carpeta `/dist` al dashboard de Netlify
3. O conecta el repo con estas opciones:
   - Build command: `npm run build`
   - Publish directory: `dist`

---

## Contacto del negocio

| Campo       | Valor                                                         |
|-------------|---------------------------------------------------------------|
| Negocio     | Decora Events                                                 |
| Dueño       | Juan David Villalobos                                         |
| WhatsApp    | +57 310 311 2856                                              |
| Instagram   | [@finomontaje](https://instagram.com/finomontaje)             |
| Facebook    | [Decora Events FB](https://www.facebook.com/share/1B7eTf2eMu/) |
