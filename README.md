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
| `infantiles` | Decoraciones Infantiles                      |
| `cumpleanos` | Decoraciones de Cumpleaños                   |
| `babyshower` | Baby Shower y Revelación de Género           |
| `quince`     | Decoraciones de 15 Años                      |
| `grado`      | Decoraciones de Grado                        |

---

## Cómo agregar imágenes reales

1. Copia tus fotos a `src/assets/catalogo/<categoria>/`
   Ejemplo: `src/assets/catalogo/infantiles/safari.jpg`

2. En `catalogo.js`, cambia el campo `imagen` de cada decoración:

```js
// Antes (placeholder de Unsplash/placehold):
imagen: 'https://placehold.co/800x600/...',

// Después (imagen local — importa al inicio del archivo):
import safariImg from '../assets/catalogo/infantiles/safari.jpg'
// ...
imagen: safariImg,
```

3. **Formato recomendado:** WebP o JPEG, proporción 4:3 (ej. 800×600 px), máximo 200 KB por imagen.

### Logo real

1. Copia `logodecoraevents.png` a `src/assets/`
2. Abre `src/components/layout/Logo.jsx` y cambia la línea del import:

```js
// Línea actual (placeholder SVG):
import logoUrl from '../../assets/logo-placeholder.svg'

// Cámbiala por:
import logoUrl from '../../assets/logodecoraevents.png'
```

### Foto del hero

En `src/components/home/Hero.jsx`, cambia `HERO_IMAGE_URL` al inicio del archivo:

```js
// URL provisional de Unsplash:
const HERO_IMAGE_URL = 'https://images.unsplash.com/...'

// Para usar foto local:
import heroImg from '../../assets/hero.jpg'
// Luego úsala en el src del <img>: src={heroImg}
```

---

## Estructura de carpetas

```
src/
├── assets/
│   ├── logo-placeholder.svg       ← reemplazar con logodecoraevents.png
│   └── catalogo/                  ← imágenes reales por categoría
│       ├── infantiles/
│       ├── cumpleanos/
│       ├── babyshower/
│       ├── quince/
│       └── grado/
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
