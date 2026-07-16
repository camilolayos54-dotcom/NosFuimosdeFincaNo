# Conflicto de Z-Index entre NavBar Global y Hero Section

## Descripción del Problema
Al implementar menús desplegables para la barra de búsqueda dentro de la sección "Hero" de la página principal, estos quedaban ocultos (recortados) por las secciones inferiores debido a un problema de apilamiento o clipping (`overflow`). Para solucionarlo, se le asignó un `z-index: 20` a la `.hero-section`.

Sin embargo, esto provocó un efecto secundario no deseado (bug de regresión): Los menús desplegables del NavBar global (idioma y usuario) comenzaron a aparecer *por debajo* de la foto del Hero. Esto ocurrió porque el NavBar global (`.ctx-c_nav` en `navbar.css`) tenía configurado un `z-index: 10`. Al crear un contexto de apilamiento de `20` en el Hero, este último pasó a tener prioridad sobre la barra de navegación superior.

## Solución Aplicada
1. **Identificación de Contextos de Apilamiento:** Se comprobó que el componente principal del header (`.ctx-c_nav`) tenía un valor de z-index bajo para un elemento pegajoso (`sticky`).
2. **Elevación del Z-Index:** Se modificó `navbar.css` subiendo el `z-index` de `.ctx-c_nav` a `100`. 
3. **Asegurar Comportamiento Sticky:** Se añadió la regla `top: 0;` a `.ctx-c_nav` para asegurar que el comportamiento sticky funcione adecuadamente en todos los navegadores bajo el nuevo índice.

## Prevención Futura
- **Estandarización de Capas (Z-Index Hierarchy):** Cualquier componente global de navegación superior (Header/NavBar) debe tener siempre el z-index más alto de la aplicación (ej. `100` o `999`) de forma predeterminada, para evitar que futuras secciones dinámicas del cuerpo de la página se sobrepongan a él.
- **Auditoría de Efectos Secundarios:** Al alterar propiedades críticas de flujo de documento como `z-index` u `overflow` en contenedores gigantes (como un Hero full-screen), se debe probar de inmediato la interacción con elementos flotantes globales (modales, tooltips, navbars).
