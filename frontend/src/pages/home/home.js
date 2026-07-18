document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       SMOOTH SCROLLING (LENIS)
    ========================================= */
    // Inicializar Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Bucle de animación de Lenis
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

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

    // Funcionalidad del botón de bajar (Hero Arrow)
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            lenis.scrollTo('#catalog', { offset: -80, duration: 1.5 });
        });
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

    // Lógica básica para contadores de huéspedes
    const btnMinus = document.querySelectorAll('.btn-minus');
    const btnPlus = document.querySelectorAll('.btn-plus');
    const guestsDisplay = document.getElementById('guests-display');
    
    const updateGuestsDisplay = () => {
        if (!guestsDisplay) return;
        const adults = parseInt(document.querySelector('.count-adults').textContent) || 0;
        const children = parseInt(document.querySelector('.count-children').textContent) || 0;
        const total = adults + children;
        guestsDisplay.value = `${total} Huésped${total !== 1 ? 'es' : ''} ⌄`;
    };

    btnPlus.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevenir que el dropdown se cierre
            const span = btn.previousElementSibling;
            span.textContent = parseInt(span.textContent) + 1;
            updateGuestsDisplay();
        });
    });

    btnMinus.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevenir que el dropdown se cierre
            const span = btn.nextElementSibling;
            const currentVal = parseInt(span.textContent);
            if (currentVal > 0) {
                span.textContent = currentVal - 1;
                updateGuestsDisplay();
            }
        });
    });

    // Vincular salida-field para que abra el calendario de llegada
    const salidaField = document.getElementById('salida-field');
    const llegadaField = document.querySelector('[data-dropdown="dates-dropdown"]');
    if (salidaField && llegadaField) {
        salidaField.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!llegadaField.classList.contains('active')) {
                closeAllDropdowns();
                llegadaField.classList.add('active');
            } else {
                closeAllDropdowns();
            }
        });
    }
    
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
    const dateDisplayIn = document.getElementById('date-display-in');
    const dateDisplayOut = document.getElementById('date-display-out');
    const dateDropdown = document.getElementById('dates-dropdown');

    if (document.getElementById('date-picker-inline')) {
        const currentLang = localStorage.getItem('lang') || 'es';
        
        flatpickr("#date-picker-inline", {
            inline: true,
            mode: "range",
            minDate: "today",
            showMonths: window.innerWidth > 768 ? 2 : 1,
            locale: currentLang === 'en' ? 'default' : 'es', // flatpickr defaults to english
            onChange: function(selectedDates, dateStr, instance) {
                if (selectedDates.length === 2) {
                    // Formatear fechas seleccionadas
                    const localeCode = currentLang === 'en' ? 'en-US' : 'es-ES';
                    const start = selectedDates[0].toLocaleDateString(localeCode, { day: 'numeric', month: 'short' });
                    const end = selectedDates[1].toLocaleDateString(localeCode, { day: 'numeric', month: 'short' });
                    if (dateDisplayIn) dateDisplayIn.value = start;
                    if (dateDisplayOut) dateDisplayOut.value = end;
                    
                    // Pequeño delay antes de cerrar el dropdown para dar feedback visual
                    setTimeout(() => {
                        closeAllDropdowns();
                    }, 400);
                } else if (selectedDates.length === 1) {
                    const localeCode = currentLang === 'en' ? 'en-US' : 'es-ES';
                    const start = selectedDates[0].toLocaleDateString(localeCode, { day: 'numeric', month: 'short' });
                    if (dateDisplayIn) dateDisplayIn.value = start;
                    if (dateDisplayOut) dateDisplayOut.value = '';
                }
            }
        });
    }

    /* =========================================
       SCROLL TO TOP LOGIC
    ========================================= */
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            lenis.scrollTo(0, { duration: 1.5 });
        });
    }
});
