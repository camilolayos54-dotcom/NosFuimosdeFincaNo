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
