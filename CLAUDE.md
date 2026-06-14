# Decora Events — Reglas del proyecto

## Contexto
Sitio web de Decora Events, negocio colombiano de decoración de
eventos (cumpleaños, quince años, baby shower, bautizos, grados).

## Stack
- React + Vite + Tailwind CSS
- Sitio estático desplegado en Vercel
- Carrito con localStorage, checkout por WhatsApp (wa.me)
- Catálogo con 5 categorías

## Identidad visual (NO modificar)
- Estética cálida, premium, editorial
- Color principal: dorado cálido #7A5934
- Respetar tipografías y paleta ya definidas en el proyecto

## Reglas de trabajo obligatorias
1. Trabajar SOLO en la rama dev. Nunca tocar main.
2. Un cambio lógico = un commit con mensaje descriptivo en español.
3. NUNCA eliminar funcionalidad existente sin preguntar primero.
4. Si hay código que no entiendes, preguntar antes de modificarlo.
5. Antes de cambios grandes, mostrar un resumen del plan y esperar
   confirmación.
6. Al terminar cada tarea, indicar qué archivos cambiaron y cómo
   probar en local (npm run dev).
7. Todo texto visible para usuarios en español de Colombia.
8. Mobile-first: diseñar y probar primero en viewport móvil.

## Prerendering (SEO)
El build genera HTML estático por ruta (scripts/prerender.mjs):
las rutas de categorías y productos salen de los JSON de src/data
automáticamente, pero toda RUTA NUEVA en el router debe agregarse
también en ese script y recibir SEO en src/config/seo.js.

## Optimización de imágenes (scripts/optimizar-imagenes.mjs)
Script reutilizable con `sharp` (devDependency) que convierte fotos a
WebP, las redimensiona y las comprime por debajo de un peso máximo. NO
toca los originales: lee de una carpeta de ORIGEN (normalmente fuera del
repo) y escribe optimizadas dentro del proyecto (por convención en
`public/img/...`, que se sirve como ruta absoluta `/img/...`).

Uso:
```
node scripts/optimizar-imagenes.mjs --src "<carpeta_origen>" --dest "<carpeta_destino>" [opciones]
```
Opciones: `--width` (def. 800), `--height` (def. 600; 0 = automático),
`--fit` (cover|inside|contain, def. cover), `--quality` (def. 82),
`--max-kb` (def. 200; baja la calidad en escalones hasta cumplirlo),
`--recursive` (procesa subcarpetas), `--skip-existing`.

Catálogo (800x600, 4:3) — se corrió una vez por categoría, p. ej.:
```
node scripts/optimizar-imagenes.mjs --src "...\02-CATALOGO\Cumpleanos" --dest "public/img/catalogo/cumpleanos"
```
Reusos previstos con otros tamaños: portfolio, og-image (1200x630) y
las fotos del cotizador. Respeta la orientación EXIF de fotos de celular.
