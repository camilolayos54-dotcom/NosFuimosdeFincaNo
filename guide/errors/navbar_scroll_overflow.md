# Error: Opciones de navegación cortadas en mobile (Scroll Overflow)

## Descripción del Problema
Al añadir un scroll horizontal (`overflow-x: auto`) al menú principal de navegación en dispositivos móviles, el primer elemento de la lista (ej: "Inicio") aparecía cortado a la izquierda, imposibilitando visualizarlo o hacer scroll hacia él.

## Causa
El contenedor padre (`.ctx-c_nav_main_options`) tenía asignada la propiedad `justify-content: center` heredada de la versión de escritorio.
Cuando un contenedor flexible (Flexbox) tiene `justify-content: center` y sus elementos hijos superan el ancho disponible, el navegador distribuye el desbordamiento equitativamente hacia la izquierda y la derecha. Dado que el desbordamiento hacia la izquierda en un contenedor centrado queda fuera de los límites de scroll del navegador, el contenido se vuelve permanentemente inaccesible.

## Solución
Para solucionar este comportamiento, es necesario reescribir la propiedad de alineación en el Media Query correspondiente a la versión móvil (por ejemplo, `max-width: 768px`).

Al aplicar `justify-content: flex-start`, el contenido comienza desde el borde izquierdo y cualquier desbordamiento ocurre exclusivamente hacia la derecha, permitiendo que el `overflow-x: auto` funcione correctamente.

### Código Corregido

```css
/* Mobile Devices */
@media screen and (max-width: 768px) {
    .ctx-c_nav_main_options {
        order: 3;
        flex: 1 1 100%;
        margin-top: 1rem;
        
        /* Habilitar scroll horizontal suave */
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        
        /* FIX: Alinear a la izquierda para evitar cortes en el inicio del scroll */
        justify-content: flex-start;
    }
}
```
