# TASK BE-001 — `NosFuimosDeFincaApplication.java`

**Módulo:** `backend/src/main/java/com/nosfuimosdefinica/`
**Tipo de archivo:** Entry point de la aplicación Spring Boot
**Prioridad:** CRÍTICA — debe ser el primer archivo que exista en el proyecto. Sin él no arranca nada.
**Depende de:** `pom.xml` (debe estar configurado antes), `application.yml`
**Bloquea:** Todos los demás archivos del backend. Nada puede ejecutarse si este archivo no existe o está mal configurado.

---

## 1. Propósito

Este archivo es el **punto de entrada único** de toda la aplicación Java. Es la clase que JVM ejecuta primero cuando el proceso arranca (`java -jar app.jar`). Su única responsabilidad es inicializar el contexto de Spring Boot y delegar el control al framework. No contiene lógica de negocio. No hace consultas a la base de datos. No expone endpoints.

---

## 2. Instrucciones de Implementación Paso a Paso (Desde Cero)

Para concluir este archivo de manera correcta, sigue esta secuencia exacta de pasos:

### Paso 1: Crear la estructura de directorios
1. Navega a la carpeta raíz del backend: `backend/`.
2. Spring Boot requiere una estructura de carpetas específica de Maven. Debes crear los directorios anidados: `src/main/java/com/nosfuimosdefinica/`.
   - **Importante:** El nombre de la carpeta final debe ser exactamente `nosfuimosdefinica` (todo en minúsculas, sin guiones ni mayúsculas), ya que esto define el paquete principal.

### Paso 2: Crear el archivo físico
1. Dentro de la carpeta `com/nosfuimosdefinica/`, crea un nuevo archivo de texto llamado `NosFuimosDeFincaApplication.java`.
   - **Importante:** Asegúrate de que la primera letra sea mayúscula (PascalCase) y que la extensión sea `.java`.

### Paso 3: Definir el paquete
1. Abre el archivo y en la **primera línea**, declara el paquete al que pertenece este archivo. Esto es vital para que Java lo encuentre.
   Escribe: 
   ```java
   package com.nosfuimosdefinica;
   ```

### Paso 4: Añadir las importaciones necesarias
1. Deja una línea en blanco después del package.
2. Agrega las siguientes importaciones de Spring Boot. Necesitas estas clases y anotaciones para arrancar la app y habilitar funcionalidades extra (como auditoría y tareas programadas):
   ```java
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
   import org.springframework.scheduling.annotation.EnableScheduling;
   ```

### Paso 5: Declarar las anotaciones a nivel de clase
1. Después de los imports, añade las anotaciones que le dirán a Spring Boot cómo comportarse. Escríbelas justo encima de la declaración de la clase:
   - `@SpringBootApplication`: Marca esta clase como la configuración principal. Habilita el autoconfiguration y el escaneo de componentes.
   - `@EnableScheduling`: Habilita la capacidad de correr tareas programadas en el backend (útil para jobs en el futuro).
   - `@EnableJpaAuditing`: Permite a Spring rellenar automáticamente los campos `created_at` y `updated_at` en la base de datos.
   
   Tu código debería verse así ahora:
   ```java
   @SpringBootApplication
   @EnableScheduling
   @EnableJpaAuditing
   ```

### Paso 6: Declarar la clase principal
1. Inmediatamente debajo de las anotaciones, declara la clase pública. El nombre de la clase **debe coincidir exactamente** con el nombre del archivo.
   Escribe:
   ```java
   public class NosFuimosDeFincaApplication {
   ```

### Paso 7: Escribir el método `main`
1. Dentro de la clase, debes definir el método `main`, que es el estándar de Java para iniciar un programa.
2. Dentro de este método, llamarás al utilitario de Spring para arrancar la app, pasándole esta misma clase y los argumentos recibidos.
   Escribe:
   ```java
       public static void main(String[] args) {
           SpringApplication.run(NosFuimosDeFincaApplication.class, args);
       }
   }
   ```
3. Cierra la llave de la clase.

---

## 3. Archivo Completo Resultante

Una vez hayas completado los pasos anteriores, tu archivo debe ser **exactamente** igual a este (13 líneas):

```java
package com.nosfuimosdefinica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableJpaAuditing
public class NosFuimosDeFincaApplication {

    public static void main(String[] args) {
        SpringApplication.run(NosFuimosDeFincaApplication.class, args);
    }

}
```

---

## 4. Condiciones que debe cumplir (Checklist de Verificación)

Asegúrate de que se cumplan estrictamente estos puntos:

| # | Condición | Consecuencia si falla |
|---|-----------|----------------------|
| 1 | Package declarado como `com.nosfuimosdefinica` | Los beans de subpackages no son detectados por `@ComponentScan` |
| 2 | Anotación `@SpringBootApplication` presente | La aplicación no arranca. Error: `No qualifying bean` en todo |
| 3 | Anotación `@EnableScheduling` presente | Los `@Scheduled` jobs no se ejecutan. Bookings expirados nunca se cancelan |
| 4 | Anotación `@EnableJpaAuditing` presente | `created_at` y `updated_at` quedan `null` en todas las entidades |
| 5 | Clase `public` | `SpringApplication.run()` no puede instanciarla |
| 6 | Método `main` con firma exacta `public static void main(String[] args)` | JVM no puede iniciar el proceso |
| 7 | `SpringApplication.run(NosFuimosDeFincaApplication.class, args)` pasa `args` | Propiedades de línea de comandos ignoradas en Railway |
| 8 | Ninguna lógica de negocio dentro de la clase | Viola el principio de responsabilidad única. El entry point no debe saber nada del dominio |
| 9 | Nombre del archivo == nombre de la clase (`NosFuimosDeFincaApplication.java`) | El compilador Java lanzará error: public class must match file name |

---

## 5. Errores comunes a evitar

1. **Poner `@EnableJpaAuditing` en otra clase (ej. `JpaConfig.java`) en lugar de aquí.** Técnicamente funciona, pero la convención de Spring Boot es centralizar estas anotaciones de bootstrap en el entry point para visibilidad.
2. **Omitir `args` en `SpringApplication.run()`:** Escribir `.run(NosFuimosDeFincaApplication.class)` sin pasar `args`. Railway y los pipelines de CI/CD pueden inyectar propiedades por línea de comandos. Si `args` no se pasa, esas propiedades son ignoradas silenciosamente.
3. **Agregar lógica de inicialización aquí.** Si se necesita cargar datos de seed o ejecutar algo al arrancar, crear un `@Bean` de tipo `CommandLineRunner` en una clase separada. No ensucies este archivo.

---

## 6. Cómo verificar que el archivo funciona correctamente

Una vez creado, debes comprobar que el servidor levanta sin errores:

1. Asegúrate de que `pom.xml` y `application.yml` ya estén creados, y que la base de datos PostgreSQL local esté corriendo (vía Docker, por ejemplo).
2. En tu terminal, sitúate en la raíz del backend:
   ```bash
   cd backend/
   ```
3. Ejecuta la aplicación usando Maven Wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```

**Salida esperada en consola:**
Verás el logo gigante de Spring en arte ASCII y unas líneas más abajo debería decir:
```
... Started NosFuimosDeFincaApplication in X.XXX seconds (process running for X.XXX)
```
Si ves ese mensaje, has completado exitosamente la creación de este archivo.

*Próxima tarea: `TASK BE-002 — BookingStatus.java` (Enum del módulo booking)*
