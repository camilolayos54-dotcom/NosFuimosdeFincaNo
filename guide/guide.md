# Guia de Arquitectura: Nos Fuimos de Finca - Repositorio de Codigo

**Stack aprobado (Fase 2 - D3):** Java (Spring Boot) + PostgreSQL + Vite/JavaScript + Railway/Render

Este documento es la guia normativa y exhaustiva para la implementacion del sistema.
Cada archivo, cada clase, cada tabla, cada ruta CSS debe crearse segun las especificaciones aqui definidas.
**No se tolera desviacion del stack sin aprobacion explicita.**

---

## REGLAS GLOBALES OBLIGATORIAS

1. **Lenguaje Backend:** Java 17 (LTS). Se usa Maven como gestor de dependencias.
2. **Framework Backend:** Spring Boot 3.x con Spring MVC, Spring Security, Spring Data JPA.
3. **Base de Datos:** PostgreSQL 15+. Todas las migraciones se gestionan con **Flyway**.
4. **Lenguaje Frontend:** JavaScript (ES2022). Sin TypeScript. Sin frameworks pesados.
5. **Frontend Bundler:** Vite 5.x.
6. **CSS:** Vanilla CSS con CSS Variables. Sin TailwindCSS. Sin Bootstrap.
7. **Hosting:** Railway.app o Render.com con Dockerfile. Sin Vercel. Sin AWS directo.
8. **Autenticacion:** JWT propio (AccessToken + RefreshToken). Sin OAuth de terceros en MVP.
9. **Todos los montos monetarios:** Se almacenan en centavos de COP como BIGINT. Nunca como FLOAT o DECIMAL.
10. **Soft-delete obligatorio:** Todas las tablas con datos de negocio tienen columna `deleted_at TIMESTAMPTZ`.
11. **Nombres de archivos Java:** PascalCase. Nombres de archivos JS: camelCase o kebab-case.
12. **Nombres de tablas SQL:** snake_case plural (ej: `bookings`, `property_images`).

---

## ESTRUCTURA DEL REPOSITORIO

```
nos-fuimos-de-finca/          <- Raiz del repositorio Git
	backend/                  <- Todo el codigo Java Spring Boot
	frontend/                 <- Todo el codigo Vite + JavaScript
	docs/                     <- Documentacion MkDocs (no modificar desde aqui)
	docker-compose.yml        <- Levanta backend + PostgreSQL en local
	.github/
		workflows/
			ci-backend.yml
			ci-frontend.yml
```

---

## PARTE 1: BASE DE DATOS (PostgreSQL)

Las migraciones viven en `backend/src/main/resources/db/migration/`.
Cada archivo de migracion sigue la convencion de Flyway: `V{numero}__{descripcion}.sql`

### Archivos de Migracion (orden obligatorio)

```
V001__create_users_table.sql
V002__create_properties_tables.sql
V003__create_booking_tables.sql
V004__create_payment_tables.sql
V005__create_platform_tables.sql
V006__create_indexes.sql
```

### V001__create_users_table.sql

**Tablas a crear:** `users`, `refresh_tokens`

Tabla `users`:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `email` VARCHAR(255) NOT NULL UNIQUE
- `password_hash` VARCHAR(255) NOT NULL
- `role` VARCHAR(50) NOT NULL CHECK (role IN ('TOURIST', 'AGENCY_USER', 'OWNER_API'))
- `full_name` VARCHAR(255) NOT NULL
- `phone_number` VARCHAR(20) NOT NULL
- `document_number` VARCHAR(50) UNIQUE
- `avatar_url` TEXT
- `bank_name` VARCHAR(100)
- `bank_account_number` VARCHAR(50)
- `bank_account_type` VARCHAR(20) CHECK (bank_account_type IN ('AHORROS', 'CORRIENTE'))
- `kyc_status` VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING', 'VERIFIED', 'REJECTED'))
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `deleted_at` TIMESTAMPTZ

Tabla `refresh_tokens`:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `token_hash` VARCHAR(255) NOT NULL UNIQUE
- `expires_at` TIMESTAMPTZ NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `deleted_at` TIMESTAMPTZ

### V002__create_properties_tables.sql

**Tablas a crear:** `properties`, `property_images`, `property_amenities`, `property_rules`, `property_availability`, `seasonal_prices`

Tabla `properties`:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `host_id` UUID NOT NULL REFERENCES users(id)
- `name` VARCHAR(255) NOT NULL
- `description` TEXT NOT NULL
- `price_per_night` BIGINT NOT NULL (en centavos COP)
- `cleaning_fee` BIGINT NOT NULL DEFAULT 0 (en centavos COP)
- `max_guests` INT NOT NULL
- `bedrooms_count` INT NOT NULL DEFAULT 1
- `bathrooms_count` INT NOT NULL DEFAULT 1
- `beds_count` INT NOT NULL DEFAULT 1
- `location_lat` DECIMAL(10,8) NOT NULL
- `location_lng` DECIMAL(11,8) NOT NULL
- `location_address` VARCHAR(500) NOT NULL
- `status` VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'SUSPENDED'))
- `is_active` BOOLEAN NOT NULL DEFAULT TRUE
- Timestamps: `created_at`, `updated_at`, `deleted_at`

Tabla `property_images`:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `property_id` UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE
- `url_hd` TEXT NOT NULL
- `sort_order` INT NOT NULL DEFAULT 0
- Timestamps: `created_at`, `updated_at`, `deleted_at`

Tabla `property_amenities`:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `property_id` UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE
- `amenity_key` VARCHAR(50) NOT NULL CHECK (amenity_key IN ('POOL', 'WIFI', 'BBQ', 'PET_FRIENDLY', 'PARKING', 'AIR_CONDITIONING', 'KITCHEN'))
- Timestamps: `created_at`, `updated_at`, `deleted_at`

Tabla `property_rules` (relacion 1:1 con properties):
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `property_id` UUID NOT NULL UNIQUE REFERENCES properties(id) ON DELETE CASCADE
- `check_in_time` VARCHAR(10) NOT NULL DEFAULT '15:00'
- `check_out_time` VARCHAR(10) NOT NULL DEFAULT '12:00'
- `allows_pets` BOOLEAN NOT NULL DEFAULT FALSE
- `allows_parties` BOOLEAN NOT NULL DEFAULT FALSE
- `additional_rules` TEXT
- Timestamps: `created_at`, `updated_at`, `deleted_at`

Tabla `property_availability` (fechas bloqueadas manualmente por el finquero):
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `property_id` UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE
- `start_date` DATE NOT NULL
- `end_date` DATE NOT NULL
- `reason` VARCHAR(50) NOT NULL CHECK (reason IN ('MAINTENANCE', 'PERSONAL_USE', 'OTHER'))
- Timestamps: `created_at`, `updated_at`, `deleted_at`

Tabla `seasonal_prices`:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `property_id` UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE
- `start_date` DATE NOT NULL
- `end_date` DATE NOT NULL
- `price_per_night` BIGINT NOT NULL (en centavos COP, sobreescribe base)
- Timestamps: `created_at`, `updated_at`, `deleted_at`

### V003__create_booking_tables.sql

**Tablas a crear:** `coupons`, `bookings`

Tabla `coupons`:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `code` VARCHAR(50) NOT NULL UNIQUE
- `discount_percentage` DECIMAL(5,2) (NULL si no aplica porcentaje)
- `max_discount_amount` BIGINT (en centavos, NULL si no aplica limite)
- `valid_from` DATE NOT NULL
- `valid_until` DATE NOT NULL
- `usage_limit` INT (NULL = sin limite)
- Timestamps: `created_at`, `updated_at`, `deleted_at`

Tabla `bookings`:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `property_id` UUID NOT NULL REFERENCES properties(id)
- `guest_id` UUID NOT NULL REFERENCES users(id)
- `coupon_id` UUID REFERENCES coupons(id) (nullable)
- `check_in` DATE NOT NULL
- `check_out` DATE NOT NULL
- `guest_count` INT NOT NULL
- `agency_client_name` VARCHAR(255) (nullable, B2B)
- `base_price_amount` BIGINT NOT NULL
- `cleaning_fee_amount` BIGINT NOT NULL DEFAULT 0
- `platform_fee_amount` BIGINT NOT NULL DEFAULT 0
- `taxes_amount` BIGINT NOT NULL DEFAULT 0
- `total_price` BIGINT NOT NULL
- `status` VARCHAR(30) NOT NULL DEFAULT 'PENDING_PAYMENT' CHECK (status IN ('PENDING_PAYMENT','PENDING_APPROVAL','CONFIRMED','COMPLETED','CANCELLED'))
- `cancellation_reason` TEXT (nullable)
- Timestamps: `created_at`, `updated_at`, `deleted_at`

### V004__create_payment_tables.sql

**Tablas a crear:** `payments`, `payouts`

Tabla `payments`:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `booking_id` UUID NOT NULL REFERENCES bookings(id)
- `amount` BIGINT NOT NULL
- `currency` VARCHAR(3) NOT NULL DEFAULT 'COP'
- `gateway_reference` VARCHAR(255) UNIQUE (ID de Wompi)
- `payment_method` VARCHAR(30) (NEQUI, CARD, PSE, BANCOLOMBIA_TRANSFER)
- `transaction_date` TIMESTAMPTZ NOT NULL
- `receipt_url` TEXT
- `status` VARCHAR(30) NOT NULL CHECK (status IN ('PENDING','APPROVED','DECLINED','VOIDED'))
- Timestamps: `created_at`, `updated_at`, `deleted_at`

Tabla `payouts`:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `booking_id` UUID NOT NULL UNIQUE REFERENCES bookings(id)
- `host_id` UUID NOT NULL REFERENCES users(id)
- `amount` BIGINT NOT NULL (total_price - platform_fee_amount)
- `currency` VARCHAR(3) NOT NULL DEFAULT 'COP'
- `bank_reference` VARCHAR(255) (ID de la transferencia bancaria)
- `transaction_date` TIMESTAMPTZ
- `status` VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','PROCESSING','PAID','FAILED'))
- Timestamps: `created_at`, `updated_at`, `deleted_at`

### V005__create_platform_tables.sql

**Tablas a crear:** `wishlists`, `reviews`, `notifications`

Tabla `wishlists` (favoritos):
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `property_id` UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE
- UNIQUE(user_id, property_id)
- Timestamps: `created_at`, `updated_at`, `deleted_at`

Tabla `reviews`:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `property_id` UUID NOT NULL REFERENCES properties(id)
- `guest_id` UUID NOT NULL REFERENCES users(id)
- `booking_id` UUID NOT NULL UNIQUE REFERENCES bookings(id) (una resena por reserva)
- `rating` INT NOT NULL CHECK (rating BETWEEN 1 AND 5)
- `comment` TEXT
- UNIQUE(booking_id)
- Timestamps: `created_at`, `updated_at`, `deleted_at`

Tabla `notifications`:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `type` VARCHAR(30) NOT NULL CHECK (type IN ('EMAIL','WHATSAPP','PUSH','IN_APP'))
- `title` VARCHAR(255) NOT NULL
- `body` TEXT NOT NULL
- `read_at` TIMESTAMPTZ
- Timestamps: `created_at`, `updated_at`, `deleted_at`

### V006__create_indexes.sql

Indices obligatorios de rendimiento:
- `CREATE INDEX idx_properties_host_id ON properties(host_id);`
- `CREATE INDEX idx_properties_status ON properties(status) WHERE deleted_at IS NULL;`
- `CREATE INDEX idx_bookings_property_id ON bookings(property_id);`
- `CREATE INDEX idx_bookings_guest_id ON bookings(guest_id);`
- `CREATE INDEX idx_bookings_status ON bookings(status);`
- `CREATE INDEX idx_bookings_check_in_out ON bookings(check_in, check_out);`
- `CREATE INDEX idx_notifications_user_id ON notifications(user_id) WHERE read_at IS NULL;`
- `CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);`

---

## PARTE 2: BACKEND (Java / Spring Boot)

### 2.1 Estructura de Paquetes


backend/src/main/java/com/nosfuimosdefinica/
NosFuimosDeFincaApplication.java   <- Entry point (@SpringBootApplication)
 booking/
	 domain/
		Booking.java               <- Entidad JPA
		BookingStatus.java         <- Enum: PENDING_PAYMENT, PENDING_APPROVAL CONFIRMED, COMPLETED, CANCELLED
	application/
		CreateBookingUseCase.java  <- Orquesta: valida disponibilidad, crea lock, persiste Booking
		CancelBookingUseCase.java  <- Orquesta: valida politica, ejecuta reembolso, libera lock
		BookingAppService.java     <- Fachada publica del modulo Booking para consultas
	infrastructure/
		BookingRepository.java     <- extends JpaRepository<Booking, UUID>
		BookingController.java     <- @RestController, rutas /api/v1/bookings/**
		BookingMapper.java         <- Convierte entre Booking (entidad) y BookingDTO (respuesta)
		BookingDTO.java            <- Record/POJO de respuesta JSON
		CreateBookingRequest.java  <- Record/POJO de entrada JSON
billing/
	domain/
		Payment.java               <- Entidad JPA
		Payout.java                <- Entidad JPA
		PaymentStatus.java         <- Enum: PENDING, APPROVED, DECLINED, VOIDED
		PayoutStatus.java          <- Enum: PENDING, PROCESSING, PAID, FAILED
		application/
		ProcessWompiWebhookUseCase.java  <- Valida firma Wompi, actualiza Payment, dispara Payout
		TriggerRefundUseCase.java        <- Solicita reembolso a Wompi via REST
	infrastructure/
			PaymentRepository.java     <- extends JpaRepository<Payment, UUID>
			PayoutRepository.java      <- extends JpaRepository<Payout, UUID>
			WompiWebhookController.java  <- @RestController POST /api/v1/webhooks/wompi (publico)
			WompiHttpClient.java       <- Llama REST API Wompi con fetch/HttpClient de Java
			PaymentMapper.java
	catalog/
		controllers/
			PropertyController.java    <- @RestController, rutas /api/v1/properties/**
			PropertyImageController.java
		services/
			PropertyService.java       <- Logica de busqueda, filtrado, paginacion
			PropertyImageService.java  <- Subida de imagenes a Cloudinary
		models/
			Property.java              <- Entidad JPA
			PropertyImage.java         <- Entidad JPA
			PropertyAmenity.java       <- Entidad JPA
			PropertyRules.java         <- Entidad JPA
			PropertyAvailability.java  <- Entidad JPA
			SeasonalPrice.java         <- Entidad JPA
			PropertyDTO.java           <- Respuesta publica (sin campos sensibles del host)
			PropertySummaryDTO.java    <- Respuesta corta para listados (id, nombre, precio, foto)
			CreatePropertyRequest.java
		repositories/
			PropertyRepository.java    <- extends JpaRepository<Property, UUID>
			PropertyImageRepository.java
			SeasonalPriceRepository.java
	iam/
		controllers/
			AuthController.java        <- POST /api/v1/auth/register, /login, /refresh, /logout
			UserProfileController.java <- GET/PATCH /api/v1/users/me
		services/
			AuthService.java           <- Logica de registro, login, generacion de JWT
			JwtService.java            <- Genera y valida AccessToken + RefreshToken
			UserService.java           <- CRUD de perfil de usuario
		models/
			User.java                  <- Entidad JPA
			RefreshToken.java          <- Entidad JPA
			UserRole.java              <- Enum: TOURIST, AGENCY_USER, OWNER_API
			KycStatus.java             <- Enum: PENDING, VERIFIED, REJECTED
			LoginRequest.java          <- Record: email, password
			RegisterRequest.java       <- Record: email, password, fullName, phoneNumber, role
			AuthResponse.java          <- Record: accessToken, refreshToken, userRole
			UserProfileDTO.java        <- Respuesta publica del perfil
		repositories/
			UserRepository.java        <- extends JpaRepository<User, UUID>
			RefreshTokenRepository.java
	notifications/
		services/
			NotificationService.java   <- Orquesta envio segun tipo (email, whatsapp)
			WhatsAppService.java       <- Llama WhatsApp Business API via REST HTTP
			EmailService.java          <- Envio via SMTP (JavaMailSender de Spring)
		models/
			Notification.java          <- Entidad JPA
			NotificationType.java      <- Enum: EMAIL, WHATSAPP, PUSH, IN_APP
		repositories/
			NotificationRepository.java
	shared/
		config/
			SecurityConfig.java        <- Configura Spring Security, rutas publicas/privadas, JWT filter
			CorsConfig.java            <- Permite requests del frontend (localhost:5173 en local, dominio en prod)
			JpaConfig.java             <- Configura Auditing (@CreatedDate, @LastModifiedDate)
			DataSourceConfig.java      <- Configura HikariCP connection pool
		exception/
			GlobalExceptionHandler.java  <- @RestControllerAdvice. Captura excepciones y retorna JSON estandar
			ResourceNotFoundException.java  <- HTTP 404
			ConflictException.java          <- HTTP 409 (overbooking, duplicados)
			UnauthorizedException.java      <- HTTP 401
			ForbiddenException.java         <- HTTP 403
			ValidationException.java        <- HTTP 422 (reglas de negocio violadas)
		utils/
			DateUtils.java             <- Helpers para calcular noches, validar rangos de fechas
			MoneyUtils.java            <- Helpers para convertir centavos <-> pesos COP
		filter/
			JwtAuthenticationFilter.java  <- Intercepta cada request, valida JWT, setea SecurityContext
```

### 2.2 Archivo de Configuracion Principal

**Archivo:** `backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: ${DATABASE_URL}              # Inyectado por variable de entorno en Railway
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 2
  jpa:
    hibernate:
      ddl-auto: validate              # NUNCA create o create-drop en produccion
    show-sql: false
  flyway:
    enabled: true
    locations: classpath:db/migration

app:
  jwt:
    secret: ${JWT_SECRET}            # Minimo 256 bits, inyectado por env var
    access-token-expiration-ms: 3600000    # 1 hora
    refresh-token-expiration-ms: 604800000 # 7 dias
  wompi:
    events-secret: ${WOMPI_EVENTS_SECRET}
    public-key: ${WOMPI_PUBLIC_KEY}
    private-key: ${WOMPI_PRIVATE_KEY}
  whatsapp:
    api-url: ${WHATSAPP_API_URL}
    api-token: ${WHATSAPP_API_TOKEN}
  cloudinary:
    cloud-name: ${CLOUDINARY_CLOUD_NAME}
    api-key: ${CLOUDINARY_API_KEY}
    api-secret: ${CLOUDINARY_API_SECRET}
```

**Variables de entorno requeridas (nunca commitear):**
- `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- `JWT_SECRET`
- `WOMPI_EVENTS_SECRET`, `WOMPI_PUBLIC_KEY`, `WOMPI_PRIVATE_KEY`
- `WHATSAPP_API_URL`, `WHATSAPP_API_TOKEN`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### 2.3 Archivo pom.xml (dependencias Maven)

Dependencias obligatorias:
- `spring-boot-starter-web` (Spring MVC REST)
- `spring-boot-starter-security` (Spring Security)
- `spring-boot-starter-data-jpa` (Hibernate + JPA)
- `spring-boot-starter-validation` (Bean Validation @NotNull, @Email)
- `spring-boot-starter-mail` (JavaMailSender)
- `postgresql` (driver JDBC)
- `flyway-core` (migraciones SQL)
- `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (JWT - io.jsonwebtoken)
- `spring-boot-starter-test` (JUnit 5, Mockito)
- `testcontainers` (PostgreSQL en tests de integracion)

### 2.4 Dockerfile del Backend

```dockerfile
FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

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

## PARTE 4: CI/CD Y DOCKER

### 4.1 docker-compose.yml (raiz del proyecto)

Levanta en local:
- Servicio `db`: postgres:15-alpine, puerto 5432, datos en volumen local
- Servicio `backend`: construye desde `./backend/Dockerfile`, puerto 8080, depende de `db`
- Variables de entorno del backend inyectadas desde `.env.local` (no versionado)

### 4.2 .github/workflows/ci-backend.yml

Triggers: push a `main` y `dev`, pull_request a `main`

Pasos:
1. Checkout codigo
2. Setup Java 17
3. Cache de dependencias Maven
4. `mvn test` (ejecuta JUnit + Testcontainers contra PostgreSQL en Docker)
5. `mvn package -DskipTests`
6. (Solo en main) Deploy automatico a Railway via Railway CLI

### 4.3 .github/workflows/ci-frontend.yml

Triggers: push a `main` y `dev`, pull_request a `main`

Pasos:
1. Checkout codigo
2. Setup Node.js 20
3. `npm ci`
4. `npm run lint` (ESLint)
5. `npm run build`

---

## LIMITES ESTRICTOS POR MODULO (reglas de aislamiento)

 Modulo | Puede importar de | NO puede importar de |
--------|------------------|----------------------|
 `booking/domain` | nadie (POJO puro) | Spring, JPA, Wompi |
 `booking/application` | `booking/domain`, `billing/application` | Spring MVC, `catalog` directamente |
 `booking/infrastructure` | `booking/application`, Spring, JPA | `billing/domain` directamente |
 `billing/domain` | nadie (POJO puro) | Spring, JPA |
 `billing/application` | `billing/domain` | `catalog`, `iam` |
 `catalog/*` | Spring, JPA, `shared` | `booking`, `billing` |
 `iam/*` | Spring, JPA, `shared` | `booking`, `billing`, `catalog` |
 `notifications/*` | Spring, `shared` | `booking/domain`, `billing/domain` |
 `shared/*` | Spring, Java puro | ninguno de los modulos de negocio |

---

## ENDPOINTS REST (contrato entre Frontend y Backend)

### Autenticacion (publico)
- `POST /api/v1/auth/register` - Body: RegisterRequest - Response: AuthResponse
- `POST /api/v1/auth/login` - Body: LoginRequest - Response: AuthResponse
- `POST /api/v1/auth/refresh` - Cookie: refreshToken - Response: nuevo accessToken
- `POST /api/v1/auth/logout` - Header: Authorization - Invalida refreshToken en BD

### Catalogo (publico)
- `GET /api/v1/properties?page=0&size=12&maxGuests=4&minPrice=X&maxPrice=X` - Response: Page<PropertySummaryDTO>
- `GET /api/v1/properties/{id}` - Response: PropertyDTO (completo con reglas, amenidades, imagenes)

### Reservas (autenticado)
- `POST /api/v1/bookings` - Body: CreateBookingRequest - Response: BookingDTO
- `GET /api/v1/bookings/my` - Response: List<BookingDTO>
- `DELETE /api/v1/bookings/{id}` - Response: BookingDTO (con status CANCELLED)

### Webhooks (publico, validacion por firma HMAC)
- `POST /api/v1/webhooks/wompi` - Body: WompiWebhookPayload

### Host Dashboard (autenticado, rol OWNER_API)
- `GET /api/v1/host/properties` - Listado de fincas del finquero autenticado
- `POST /api/v1/host/properties` - Crea nueva finca
- `PATCH /api/v1/host/properties/{id}` - Edita finca
- `POST /api/v1/host/properties/{id}/availability` - Bloquea fechas
- `GET /api/v1/host/bookings` - Reservas pendientes de aprobacion
- `PATCH /api/v1/host/bookings/{id}/approve` - Aprueba reserva
- `PATCH /api/v1/host/bookings/{id}/reject` - Rechaza reserva (dispara reembolso)
