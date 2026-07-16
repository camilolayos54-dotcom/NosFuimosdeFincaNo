document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       HERO CAROUSEL LOGIC
    ========================================= */
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 segundos por imagen

    if (carouselItems.length > 0) {
        setInterval(() => {
            // Remover la clase active de la imagen actual
            carouselItems[currentSlide].classList.remove('active');
            
            // Calcular el siguiente slide
            currentSlide = (currentSlide + 1) % carouselItems.length;
            
            // Añadir clase active al nuevo slide
            carouselItems[currentSlide].classList.add('active');
        }, slideInterval);
    }

    /* =========================================
       SEARCH DROPDOWN LOGIC
    ========================================= */
    const searchFields = document.querySelectorAll('.search-field');
    
    // Función para cerrar todos los dropdowns
    const closeAllDropdowns = () => {
        searchFields.forEach(field => {
            field.classList.remove('active');
        });
    };

    // Agregar evento a cada campo de búsqueda
    searchFields.forEach(field => {
        field.addEventListener('click', (e) => {
            // Evitar que el clic se propague al document
            e.stopPropagation();
            
            // Si el campo actual ya está activo, lo cerramos
            if (field.classList.contains('active')) {
                field.classList.remove('active');
                return;
            }
            
            // Si no está activo, cerramos todos y abrimos el actual
            closeAllDropdowns();
            field.classList.add('active');
        });
    });

    // Cerrar dropdowns si se hace clic fuera del buscador
    document.addEventListener('click', (e) => {
        const searchBar = document.getElementById('searchBar');
        if (searchBar && !searchBar.contains(e.target)) {
            closeAllDropdowns();
        }
    });

    // Lógica básica para contadores de huéspedes (visual)
    const btnMinus = document.querySelectorAll('.btn-minus');
    const btnPlus = document.querySelectorAll('.btn-plus');

    btnPlus.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevenir que el dropdown se cierre
            const span = btn.previousElementSibling;
            span.textContent = parseInt(span.textContent) + 1;
        });
    });

    btnMinus.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevenir que el dropdown se cierre
            const span = btn.nextElementSibling;
            const currentVal = parseInt(span.textContent);
            if (currentVal > 0) {
                span.textContent = currentVal - 1;
            }
        });
    });
    
    // Lógica básica para seleccionar ubicaciones
    const locationItems = document.querySelectorAll('#location-dropdown .dropdown-list li');
    const locationInput = document.querySelector('.search-field[data-dropdown="location-dropdown"] input');
    
    locationItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            locationInput.value = item.textContent;
            closeAllDropdowns(); // Cierra el menú al elegir
        });
    });

    /* =========================================
       SCROLL NAVBAR LOGIC
    ========================================= */
    const navBar = document.querySelector('nav-bar');
    const heroSection = document.querySelector('.hero-section');
    
    if (navBar) {
        window.addEventListener('scroll', () => {
            // Calculamos la altura dinámica del hero (funciona perfecto en móvil donde es 60vh y en desktop donde es 100vh)
            const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
            // Restamos unos 80px (el alto de la barra) para que el cambio ocurra justo antes de tapar el dashboard
            const threshold = heroHeight - 80;
            
            if (window.scrollY > threshold) {
                navBar.classList.add('scrolled');
            } else {
                navBar.classList.remove('scrolled');
            }
        });
    }

    /* =========================================
       PREVENT DROPDOWN BUBBLING BUG
    ========================================= */
    // Prevenir que clics dentro de cualquier dropdown lo cierren accidentalmente
    const allDropdowns = document.querySelectorAll('.search-dropdown');
    allDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    /* =========================================
       FLATPICKR CALENDAR LOGIC
    ========================================= */
    const dateDisplay = document.getElementById('date-display');
    const dateDropdown = document.getElementById('dates-dropdown');

    if (document.getElementById('date-picker-inline')) {
        flatpickr("#date-picker-inline", {
            inline: true,
            mode: "range",
            minDate: "today",
            showMonths: window.innerWidth > 768 ? 2 : 1,
            locale: "es", // Español
            onChange: function(selectedDates, dateStr, instance) {
                if (selectedDates.length === 2) {
                    // Formatear fechas seleccionadas
                    const start = selectedDates[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                    const end = selectedDates[1].toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                    dateDisplay.value = `${start} - ${end}`;
                    
                    // Pequeño delay antes de cerrar el dropdown para dar feedback visual
                    setTimeout(() => {
                        closeAllDropdowns();
                    }, 400);
                } else if (selectedDates.length === 1) {
                    const start = selectedDates[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                    dateDisplay.value = `${start} - ...`;
                }
            }
        });
    }
});
