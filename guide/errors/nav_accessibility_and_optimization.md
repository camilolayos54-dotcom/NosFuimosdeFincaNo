# Error: Semántica y Accesibilidad en la Barra de Navegación

## Descripción del Problema
Durante la revisión del código de la barra de navegación (HTML y CSS) se identificaron varios problemas relacionados con las buenas prácticas de desarrollo web, semántica de HTML y accesibilidad (a11y). Adicionalmente se encontraron reglas redundantes en la hoja de estilos.

### Problemas encontrados:
1. **Semántica de las Opciones de Navegación:**
   Las opciones principales del menú (`Inicio`, `Fincas`, `Contacto`, `Contrato`) se encontraban contenidas únicamente dentro de etiquetas de lista `<li>` que incluían un texto y un SVG, sin ninguna etiqueta ancla `<a>`. Esto implica que no eran enlaces reales, perjudicando la navegabilidad, accesibilidad, el enrutamiento estándar (MPA) y el SEO.

2. **Accesibilidad de los Menús Desplegables (Dropdowns):**
   Los elementos disparadores de los dropdowns (idioma y perfil de usuario) utilizaban una etiqueta genérica `<div>` con la clase `.dropdown-trigger`. Un `div` no es interactivo por defecto, lo que significa que los usuarios que navegan mediante teclado o lectores de pantalla no podían enfocar ni interactuar adecuadamente con estos menús.

3. **Optimización CSS Redundante:**
   El selector `body` en `login.css` estaba duplicado.

## Solución Implementada

Para resolver estos problemas se realizaron las siguientes modificaciones:

1. **Corrección Semántica:**
   Se envolvió el texto y los iconos SVG de cada `<li>` en la clase `.ctx-options` con etiquetas `<a>` que apuntan a sus respectivas rutas (`index.html`, `catalog.html`, etc.).

2. **Corrección de Accesibilidad (a11y):**
   - Se reemplazaron los `<div>` de `.dropdown-trigger` por botones `<button>`.
   - Se añadieron los atributos `aria-label` descriptivos y `aria-haspopup="true"` a los botones para indicar a los lectores de pantalla la funcionalidad de submenú.
   - En el CSS, se eliminaron los estilos predeterminados del botón (`background: none; border: none; font-family: inherit; font-size: inherit;`) para mantener el diseño visual idéntico al que tenía con el `div`.

3. **Optimización CSS:**
   Se consolidaron las declaraciones del selector `body` en una única regla. Se ajustó el CSS de `.ctx-options li` para trasladar el padding, tamaño de fuente, layout flex y animaciones hacia la nueva etiqueta `<a>`, de forma que el área clicable ocupe todo el espacio de la píldora y mantenga el rediseño dinámico intacto.

### Fragmento de la solución HTML (Ejemplo)
```html
<li>
    <a href="index.html">
        <svg ...></svg>
        Inicio
    </a>
</li>
```
