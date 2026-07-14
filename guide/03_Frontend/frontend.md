## PARTE 3: FRONTEND (Vite + JavaScript)

### 3.1 Estructura de Archivos

```text
frontend/
	public/
		favicon.ico
		og-image.jpg              <- Open Graph image para SEO
		images/                   <- Assets estaticos
	src/
		pages/
			home/
				index.html        <- Pagina de inicio. Escribes todo tu HTML manual aqui.
				home.js           <- Logica especifica (ej. carousel, llamadas fetch)
				home.css          <- Estilos especificos
			catalog/
				catalog.html      <- Pagina de busqueda y lista de fincas.
				catalog.js
				catalog.css
			property-detail/
				property.html     <- Plantilla HTML para ver una finca
				property.js       <- JS lee el ID de la URL y carga los datos del backend
				property.css
			checkout/
				checkout.html     <- Pagina de pago
				checkout.js
				checkout.css
			auth/
				login.html        <- Pagina de inicio de sesion
				register.html     <- Pagina de registro
				auth.js
				auth.css
			dashboard/
				dashboard.html    <- Panel del finquero
				dashboard.js
				dashboard.css
		components/               <- Opcional: Snippets de codigo HTML para reutilizar (Nav/Footer)
			navbar.js             <- Script simple para inyectar la barra superior en cada HTML
			footer.js
		services/                 <- Funciones para llamar al backend Java
			api.js                <- fetch con manejo de errores y tokens JWT
		utils/
			formatters.js         <- Formatear precios
		styles/
			global.css            <- Reset CSS, tipografia, nav y footer
			tokens.css            <- Design tokens (colores, sombras)
	vite.config.js                <- Configurado en modo Multi-Page App (MPA)
	package.json
```

*(Nota sobre la Arquitectura: A petición explícita, se adopta un enfoque **Multi-Page Application (MPA)** puro. Esto significa que **cada página tiene su propio archivo `.html` físico** donde puedes escribir y estructurar todos tus `<div>`, clases, e IDs de forma manual y tradicional. Navegar de una página a otra requiere etiquetas `<a href="catalog.html">` normales. No hay renderizado mágico ni frameworks oscuros; tú tienes el control absoluto del DOM).*

### 3.2 Archivo global.css

**Responsabilidad:** Define el sistema de diseno global. NINGUN otro archivo debe re-declarar estas variables.

Debe contener:
- `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');`
- Reset CSS (box-sizing: border-box, margin: 0, padding: 0 en todos los elementos)
- Variables de tipografia: `--font-body: 'Inter', sans-serif;` y `--font-display: 'Outfit', sans-serif;`

### 3.3 Archivo tokens.css

**Responsabilidad:** Tokens de diseno. Referenciado por todos los archivos .css de componentes.

Debe contener estas custom properties en `:root {}`:

Paleta de colores (HSL, vibrante, modo oscuro incluido):
- `--color-primary: hsl(158, 64%, 40%);` (verde finca, marca)
- `--color-primary-dark: hsl(158, 64%, 30%);`
- `--color-primary-light: hsl(158, 64%, 90%);`
- `--color-accent: hsl(27, 95%, 55%);` (naranja cta)
- `--color-accent-dark: hsl(27, 95%, 45%);`
- `--color-surface: hsl(220, 20%, 10%);` (fondo oscuro principal)
- `--color-surface-2: hsl(220, 15%, 16%);` (cards)
- `--color-surface-3: hsl(220, 12%, 22%);` (inputs, elementos interactivos)
- `--color-text-primary: hsl(220, 20%, 95%);`
- `--color-text-secondary: hsl(220, 10%, 65%);`
- `--color-text-muted: hsl(220, 8%, 45%);`
- `--color-border: hsl(220, 15%, 25%);`
- `--color-success: hsl(142, 71%, 45%);`
- `--color-warning: hsl(38, 92%, 50%);`
- `--color-error: hsl(0, 85%, 60%);`

Espaciado (escala de 4px):
- `--space-1: 4px;` hasta `--space-16: 64px;`

Tipografia:
- `--text-xs: 0.75rem;` hasta `--text-4xl: 2.25rem;`
- `--font-weight-normal: 400;`, `--font-weight-medium: 500;`, `--font-weight-semibold: 600;`, `--font-weight-bold: 700;`

Bordes y sombras:
- `--radius-sm: 6px;`, `--radius-md: 12px;`, `--radius-lg: 20px;`, `--radius-full: 9999px;`
- `--shadow-sm: 0 1px 3px hsl(220, 30%, 5%, 0.4);`
- `--shadow-md: 0 4px 16px hsl(220, 30%, 5%, 0.5);`
- `--shadow-lg: 0 8px 32px hsl(220, 30%, 5%, 0.6);`
- `--shadow-glow: 0 0 24px hsl(158, 64%, 40%, 0.3);` (efecto glassmorphism)

Transiciones:
- `--transition-fast: 150ms ease;`
- `--transition-base: 250ms ease;`
- `--transition-slow: 400ms ease;`

### 3.4 Archivo router.js

Define las rutas de la SPA. Debe implementar:
- Rutas publicas: `/`, `/catalog`, `/property/:slug`, `/login`, `/register`
- Rutas protegidas (requieren autenticacion): `/checkout`, `/my-bookings`
- Rutas de host (requieren rol OWNER_API o AGENCY_USER): `/dashboard`, `/dashboard/properties`, `/dashboard/calendar`, `/dashboard/bookings`
- Redireccion a `/login` si usuario no autenticado intenta acceder a ruta protegida

### 3.5 Archivo vite.config.js

Debe incluir:
- `proxy`: Redirige `/api/**` a `http://localhost:8080` en desarrollo local
- `build.outDir: '../backend/src/main/resources/static'` para servir el frontend desde Spring Boot en produccion (alternativa: despliegue independiente)

---
