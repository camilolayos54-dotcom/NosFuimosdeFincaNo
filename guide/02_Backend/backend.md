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
		scheduler/
			CancelExpiredBookingsJob.java    <- @Scheduled: cada hora cancela PENDING con mas de 24h
			SendPreCheckinRemindersJob.java  <- @Scheduled: diario 14:00 COT, envia recordatorio WhatsApp
		event/
			BookingEventPayload.java     <- POJO compartido para los eventos de booking
			BookingEventDispatcher.java  <- Enruta el evento al NotificationService
	iam/
		controllers/
			AuthController.java        <- POST /api/auth/register, /login, /refresh, /logout
			UserProfileController.java <- GET/PATCH /api/users/me
			KycController.java         <- POST /api/kyc/upload
			PasswordResetController.java  <- POST /api/auth/forgot-password, /api/auth/reset-password
		services/
			AuthService.java           <- Logica de registro, login, generacion de JWT
			JwtService.java            <- Genera y valida AccessToken + RefreshToken
			UserService.java           <- CRUD de perfil de usuario
			PasswordResetService.java  <- Genera y valida token de reset, envia correo
			EmailVerificationService.java  <- Doble opt-in: genera token, envia correo, valida clic
			KycService.java            <- Subida de RUT a S3, actualiza kyc_status en BD
			RateLimitService.java      <- Contador de intentos fallidos (Redis o en memoria)
		models/
			User.java                  <- Entidad JPA
			RefreshToken.java          <- Entidad JPA
			EmailVerificationToken.java  <- Entidad JPA
			PasswordResetToken.java    <- Entidad JPA
			UserRole.java              <- Enum: TOURIST, AGENCY_USER, OWNER_API
			KycStatus.java             <- Enum: PENDING, VERIFIED, REJECTED
			LoginRequest.java          <- Record: email, password
			RegisterRequest.java       <- Record: email, password, fullName, phoneNumber, role
			ForgotPasswordRequest.java <- Record: email
			ResetPasswordRequest.java  <- Record: token, newPassword
			ChangePasswordRequest.java <- Record: currentPassword, newPassword
			AuthResponse.java          <- Record: accessToken, refreshToken, userRole
			UserProfileDTO.java        <- Respuesta publica del perfil
			KycUploadResponse.java     <- Record: kycStatus, message
		repositories/
			UserRepository.java        <- extends JpaRepository<User, UUID>
			RefreshTokenRepository.java
			EmailVerificationTokenRepository.java
			PasswordResetTokenRepository.java
	search/
		controllers/
			SearchController.java      <- GET /api/search (query params: checkin, checkout, guests, amenities, price)
		services/
			SearchService.java         <- Faceted search + algoritmo de cross-selling (soft-match)
			SearchQueryBuilder.java    <- Construye el SQL dinamicamente con whitelist de sorting
		models/
			SearchRequest.java         <- DTO de entrada con todos los filtros
			SearchResponse.java        <- DTO paginado de salida
	dashboard/
		controllers/
			DashboardController.java   <- GET /api/dashboard/metrics, GET /api/dashboard/macro-calendar
			ExportController.java      <- POST /api/dashboard/export (genera CSV)
		services/
			DashboardService.java      <- Agrega metricas por mes/propiedad con GROUP BY SQL
			CsvExportService.java      <- Genera CSV con PII masking (ofusca email del turista)
			MacroCalendarService.java  <- Matriz de disponibilidad de multiples fincas para Agencias
		models/
			MetricsResponse.java       <- Array de { month, total }
			MacroCalendarResponse.java <- Matriz de disponibilidad
			ExportRequest.java         <- Filtros de fecha para la exportacion
	calendar/
		controllers/
			CalendarController.java    <- GET/POST /api/properties/{id}/availability
		services/
			AvailabilityService.java   <- Logica de bloqueo manual de fechas por el finquero
			SeasonalPricingService.java <- Sobreescribe el precio base en rangos de fechas especificos
		models/
			AvailabilityRequest.java
			AvailabilityResponse.java
		repositories/
			PropertyAvailabilityRepository.java
	reviews/
		controllers/
			ReviewController.java      <- POST /api/reviews (1 resena por reserva completada)
		services/
			ReviewService.java
		models/
			Review.java                <- Entidad JPA (booking_id UNIQUE)
			CreateReviewRequest.java   <- Record: bookingId, rating (1-5), comment
			ReviewDTO.java
		repositories/
			ReviewRepository.java
	wishlist/
		controllers/
			WishlistController.java    <- POST /api/wishlists (agregar), DELETE /api/wishlists/{id} (quitar)
		services/
			WishlistService.java
		models/
			Wishlist.java              <- Entidad JPA (UNIQUE user_id + property_id)
			WishlistDTO.java
		repositories/
			WishlistRepository.java
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
