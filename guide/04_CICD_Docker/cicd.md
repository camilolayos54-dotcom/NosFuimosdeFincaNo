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
