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
