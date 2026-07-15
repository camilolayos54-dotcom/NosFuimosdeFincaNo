# Error: Menú Desplegable (Dropdown) Genera Barra de Scroll Vertical

## Descripción del Problema
Al abrir un menú desplegable (configurado con `position: absolute`) en la barra de navegación, el navegador genera automáticamente una barra de desplazamiento (scroll) vertical indeseada. El menú no se superpone libremente, sino que parece forzar un desbordamiento en la página.

## Causa Raíz
Este comportamiento es una ilusión visual generada por la interacción de tres factores estructurales:

1. **Uso de `overflow-x: hidden`:** En el archivo CSS, la etiqueta `body` cuenta con la propiedad `overflow-x: hidden`. Al aplicar esta restricción horizontal, los navegadores alteran el comportamiento del eje vertical, forzándolo a actuar como `overflow-y: auto` para evitar pérdida de contenido.
2. **Desbordamiento Absoluto:** El menú desplegable sale del flujo normal del documento al usar `position: absolute`. No obstante, al abrirse (con un desplazamiento como `top: 150%`), su longitud física se proyecta hacia abajo.
3. **Altura Nula del Documento:** Si la página carece de contenido debajo de la barra de navegación, la altura física del `body` finaliza exactamente donde termina la navegación. Por lo tanto, al abrirse el menú, este se sale por completo de los límites inferiores del `body`. El navegador detecta este desbordamiento y, obedeciendo la regla del paso 1, crea una barra de scroll para permitir visualizar la porción del menú que "cayó" fuera del documento.

## Solución
El problema se corrige de manera orgánica al proveer al documento de una altura real que soporte la proyección del menú.

**Implementación:**
Al incorporar contenido base a la página (por ejemplo, un contenedor `hero-section` con un título `<h1>`), se incrementa de inmediato la altura intrínseca del `body`. 

Gracias a esta nueva altura, cuando el menú desplegable se abre, ya no sobrepasa el límite inferior de la página. Al dejar de existir un desbordamiento, el navegador no tiene motivos para generar una barra de scroll, permitiendo que el menú se superponga de manera limpia y natural sobre la sección subyacente.
