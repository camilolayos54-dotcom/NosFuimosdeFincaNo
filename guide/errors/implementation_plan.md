# Recreación del Diseño de la Página de Login

## Descripción del Objetivo
El objetivo es recrear fielmente el diseño de la pantalla de inicio de sesión (Login) según la imagen proporcionada, implementando un diseño dividido (Split Layout). El lado izquierdo contendrá el formulario de ingreso corporativo/administrativo, y el lado derecho mostrará una imagen a pantalla completa con una tarjeta de información flotante (estilo glassmorfismo).

## User Review Required
> [!NOTE]
> La imagen de referencia no muestra la barra de navegación (`<nav-bar>`), pero actualmente está en el código. Asumiré que el contenedor del login ocupará el alto restante de la pantalla (`min-height: calc(100vh - 81px)`). Si prefieres ocultar la barra de navegación en esta página específica (como suele ser común en vistas de login tipo panel), házmelo saber.

## Open Questions
- ¿Deseas mantener la barra de navegación `<nav-bar>` visible en esta página o prefieres que la pantalla dividida ocupe el 100% del alto de la ventana (`100vh`) sin navbar?
- ¿Tienes el SVG exacto para el icono del ojo (contraseña) y la estrella (tarjeta derecha), o puedo utilizar iconos estándar de Lucide que coincidan visualmente?

## Cambios Propuestos

### HTML (`frontend/src/pages/auth/login.html`)
- [MODIFY] Reestructurar `.auth-split-login` para incluir:
  - Logo superior.
  - Títulos ("BIENVENIDO DE NUEVO", "Ingresa a tu cuenta...").
  - Etiquetas (`label`) y campos (`input`) estructurados en grupos (form-group).
  - Envoltura para el campo de contraseña con el icono de "ojo".
  - Enlace de "OLVIDÉ MI CONTRASEÑA" y el botón "INGRESAR".
  - Footer de copyright al fondo (`© 2024 NOS FUIMOS DE FINCA...`).
- [MODIFY] Reestructurar `.auth-split-media` para incluir:
  - Contenedor relativo para la imagen de fondo.
  - Elemento `.premium-card` absoluto en la parte inferior con su icono y textos.

### CSS (`frontend/src/pages/auth/login.css`)
- [MODIFY] Añadir los estilos completos para el `.auth-split`:
  - `display: flex` para dividir la pantalla (ej. 45% izquierdo, 55% derecho).
  - Estilos de tipografía gruesa y color verde oscuro (`#0d1e16`) para el texto principal.
  - Diseño de los inputs (bordes finos, padding, placeholder claro).
  - Posicionamiento absoluto para el botón de visibilidad de contraseña.
  - Estilos de Glassmorfismo (`backdrop-filter: blur`, fondo translúcido) para la tarjeta derecha.

## Plan de Verificación

### Verificación Manual
- Abrir `login.html` en el navegador y comprobar que el diseño coincida 1:1 con la imagen proporcionada.
- Probar la responsividad: asegurar que en móviles la imagen se oculte o cambie de posición, y el formulario ocupe el 100% del ancho.
- Asegurarse de que el hover sobre los inputs y el botón funcione suavemente.
