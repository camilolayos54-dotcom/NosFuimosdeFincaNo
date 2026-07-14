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
