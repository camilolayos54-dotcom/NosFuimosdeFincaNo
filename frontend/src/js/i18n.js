const translations = {
    es: {
        nav: {
            home: "Inicio",
            fincas: "Fincas",
            contact: "Contacto",
            contract: "Contrato",
            publish: "Publicar",
            login: "Iniciar Sesión",
            register: "Registrarse"
        },
        home: {
            heroTitle: "Tu escapada perfecta <i style='font-style: italic; font-family: Playfair Display, serif;'>al campo</i> comienza aquí",
            searchLocationLabel: "UBICACIÓN",
            searchLocationPlaceholder: "¿A dónde vas?",
            searchDatesLabel: "FECHAS",
            searchDatesPlaceholder: "Agrega fechas",
            searchGuestsLabel: "HUÉSPEDES",
            searchGuestsPlaceholder: "¿Cuántos?",
            filtersBtn: "Filtros",
            filterPool: "Piscina",
            filterPet: "Mascotas permitidas",
            filterWifi: "WiFi rápido",
            filterBbq: "Zona BBQ",
            filterAc: "Aire Acond.",
            filterFireplace: "Chimenea",
            filterMountain: "Vista a la montaña",
            perNight: "/ noche",
            loadMore: "Cargar más fincas",
            benefitsTitle: "Mira cómo Nos Fuimos de Finca te puede ayudar",
            benefitsSubtitle: "Conectándote con las experiencias rurales más exclusivas y auténticas en el corazón de Colombia.",
            benefit1Title: "Todas las propiedades",
            benefit1Desc: "Con acceso a las mejores fincas en las regiones más exclusivas de Colombia, cubrimos el 97% de la oferta rural del país.",
            benefit2Title: "Búsqueda exacta",
            benefit2Desc: "Nuestros filtros avanzados te permiten encontrar la finca con las amenidades específicas que buscas en tiempo récord.",
            benefit3Title: "Asesoría Premium",
            benefit3Desc: "Diseñamos herramientas para que tomes la mejor decisión basada en calidad, precio y experiencias reales."
        },
        catalog: {
            filtersTitle: "Filtros",
            clearFilters: "Limpiar",
            priceRange: "Rango de precio",
            min: "MÍNIMO",
            max: "MÁXIMO",
            amenities: "Comodidades",
            showMore: "Mostrar más",
            applyFilters: "Aplicar filtros",
            resultsTitle: "Fincas en Antioquia",
            resultsCount: "+200 alojamientos encontrados",
            sortBy: "Ordenar por:",
            guestFavorite: "Huésped Favorito",
            loadingMore: "Cargando más fincas...",
            viewMap: "Ver mapa completo"
        }
    },
    en: {
        nav: {
            home: "Home",
            fincas: "Estates",
            contact: "Contact",
            contract: "Contract",
            publish: "Publish",
            login: "Log In",
            register: "Sign Up"
        },
        home: {
            heroTitle: "Your perfect getaway <i style='font-style: italic; font-family: Playfair Display, serif;'>to the countryside</i> starts here",
            searchLocationLabel: "LOCATION",
            searchLocationPlaceholder: "Where are you going?",
            searchDatesLabel: "DATES",
            searchDatesPlaceholder: "Add dates",
            searchGuestsLabel: "GUESTS",
            searchGuestsPlaceholder: "How many?",
            filtersBtn: "Filters",
            filterPool: "Pool",
            filterPet: "Pet Friendly",
            filterWifi: "Fast WiFi",
            filterBbq: "BBQ Grill",
            filterAc: "A/C",
            filterFireplace: "Fireplace",
            filterMountain: "Mountain View",
            perNight: "/ night",
            loadMore: "Load more estates",
            benefitsTitle: "See how Nos Fuimos de Finca can help you",
            benefitsSubtitle: "Connecting you with the most exclusive and authentic rural experiences across the Colombian heartland.",
            benefit1Title: "All properties",
            benefit1Desc: "With access to the best estates in the most exclusive regions of Colombia, we cover 97% of the country's rural offering.",
            benefit2Title: "Exact search",
            benefit2Desc: "Our advanced filters allow you to find the estate with the specific amenities you are looking for in record time.",
            benefit3Title: "Premium Consulting",
            benefit3Desc: "We design tools for you to make the best decision based on quality, price, and real experiences."
        },
        catalog: {
            filtersTitle: "Filters",
            clearFilters: "Clear",
            priceRange: "Price range",
            min: "MINIMUM",
            max: "MAXIMUM",
            amenities: "Amenities",
            showMore: "Show more",
            applyFilters: "Apply filters",
            resultsTitle: "Estates in Antioquia",
            resultsCount: "+200 properties found",
            sortBy: "Sort by:",
            guestFavorite: "Guest Favorite",
            loadingMore: "Loading more estates...",
            viewMap: "View full map"
        }
    }
};

class I18nManager {
    constructor() {
        this.currentLang = localStorage.getItem('lang') || 'es';
        this.init();
    }

    init() {
        // Apply translations on load
        document.addEventListener('DOMContentLoaded', () => {
            this.translatePage();
            this.setupEventListeners();
        });

        // Use MutationObserver to handle web components rendering after DOM load
        const observer = new MutationObserver(() => {
            this.setupEventListeners();
            this.translatePage();
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }

    setLanguage(lang) {
        if (translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('lang', lang);
            this.translatePage();
            
            // Dispatch a custom event so other scripts (like flatpickr) can react
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
        }
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        const currentDict = translations[this.currentLang];

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getNestedValue(currentDict, key);

            if (translation) {
                // If it's an input with a placeholder
                if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else {
                    // Normal elements (allow HTML for br tags in hero title)
                    element.innerHTML = translation;
                }
            }
        });
    }

    setupEventListeners() {
        const langSelectors = document.querySelectorAll('.lang-selector');
        langSelectors.forEach(btn => {
            // Remove old listener to avoid duplicates
            btn.replaceWith(btn.cloneNode(true));
        });

        document.querySelectorAll('.lang-selector').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = e.currentTarget.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
    }
}

// Instantiate globally
window.i18n = new I18nManager();
