## PARTE 3: FRONTEND (Vite + JavaScript)

### 3.1 Estructura de Archivos


frontend/
	public/
		favicon.ico
		og-image.jpg              <- Open Graph image para SEO
		images/                   <- Assets estaticos
	src/
		pages/
			home/
				index.html        <- Pagina de inicio B2C. Barra de busqueda, destacados, CTA de "Sube tu finca".
				home.js
				home.css
			catalog/
				catalog.html      <- Resultados de busqueda. Grilla de tarjetas de fincas + filtros.
				catalog.js        <- Faceted search: fetch a /api/search con query params.
				catalog.css
			property-detail/
				property.html     <- Detalle de una finca. Galeria, descripcion, calendario, boton de reservar.
				property.js       <- Lee el slug/id de la URL y carga los datos del backend.
				property.css
			checkout/
				checkout.html     <- Resumen de reserva + formulario de pago (Wompi).
				checkout.js
				checkout.css
			checkout-success/
				checkout-success.html  <- Confirmacion post-pago. Numero de reserva y proximos pasos.
				checkout-success.js
				checkout-success.css
			auth/
				login.html        <- Inicio de sesion (Finquero/Agencia).
				register.html     <- Registro de cuenta nueva.
				auth.js           <- Logica compartida: fetch a /api/auth/login y /api/auth/register.
				auth.css
			host-landing/
				host-landing.html <- Landing page para Finqueros. CTA para registrar su finca.
				host-landing.js
				host-landing.css
			onboarding/
				onboarding.html   <- Flujo post-registro. Subida de RUT (KYC) y datos de la finca inicial.
				onboarding.js     <- Fetch a /api/kyc/upload y /api/properties.
				onboarding.css
			error/
				error.html        <- Pagina de error generica (404, 403, 500). Muestra codigo y mensaje.
				error.js          <- Lee el codigo de error de los query params de la URL.
				error.css
			my-bookings/
				my-bookings.html  <- Historial de reservas del Turista (solo acceso autenticado).
				my-bookings.js    <- Fetch a GET /api/bookings.
				my-bookings.css
			dashboard/
				dashboard.html    <- Panel home del Finquero. Metricas resumidas e ingresos.
				dashboard.js      <- Fetch a GET /api/dashboard/metrics.
				dashboard.css
			dashboard-properties/
				dashboard-properties.html  <- Gestion de fincas del Finquero. CRUD de propiedades.
				dashboard-properties.js
				dashboard-properties.css
			dashboard-calendar/
				dashboard-calendar.html    <- Calendario de disponibilidad. Bloquear/desbloquear fechas.
				dashboard-calendar.js      <- Fetch a /api/properties/{id}/availability.
				dashboard-calendar.css
			dashboard-bookings/
				dashboard-bookings.html    <- Lista de reservas recibidas. Aprobar o cancelar cada una.
				dashboard-bookings.js      <- Fetch a PATCH /api/bookings/{id}/status.
				dashboard-bookings.css
		components/               <- Snippets reutilizables (Nav y Footer comunes a todas las paginas)
			navbar.js             <- Inyecta la barra de navegacion en el <body> de cada HTML.
			footer.js
		services/                 <- Funciones para llamar al backend Java
			api.js                <- Wrapper fetch: manejo de errores, refresco de JWT y headers.
		utils/
			formatters.js         <- Formatear precios en COP, fechas, etc.
		styles/
			global.css            <- Reset CSS, tipografia base, estilos de Nav y Footer.
			tokens.css            <- Design tokens: colores, sombras, espaciado, tipografia.
	vite.config.js                <- Configurado en modo Multi-Page App (MPA). Un entry point por HTML.
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
