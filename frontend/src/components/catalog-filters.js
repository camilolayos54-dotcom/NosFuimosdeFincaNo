class CatalogFilters extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <aside class="catalog-sidebar">
            <div class="sidebar-header">
                <h2 data-i18n="catalog.filtersTitle">Filtros</h2>
                <a href="#" class="clear-filters" data-i18n="catalog.clearFilters">Limpiar</a>
            </div>

            <!-- Sección Rango de Precio -->
            <div class="filter-section">
                <h3 data-i18n="catalog.priceRange">Rango de precio</h3>
                <!-- UI Slider simulado -->
                <div class="price-slider-track">
                    <div class="price-slider-fill"></div>
                    <div class="price-slider-handle left"></div>
                    <div class="price-slider-handle right"></div>
                </div>
                <div class="price-inputs">
                    <div class="price-input-box">
                        <span class="price-label" data-i18n="catalog.min">MÍNIMO</span>
                        <span class="price-value">$ 150k</span>
                    </div>
                    <div class="price-input-box">
                        <span class="price-label" data-i18n="catalog.max">MÁXIMO</span>
                        <span class="price-value">$ 800k+</span>
                    </div>
                </div>
            </div>

            <hr class="sidebar-divider">

            <!-- Sección Comodidades -->
            <div class="filter-section">
                <h3 data-i18n="catalog.amenities">Comodidades</h3>
                
                <label class="custom-checkbox">
                    <input type="checkbox" checked>
                    <span class="checkmark"></span>
                    <span class="checkbox-label" data-i18n="home.filterPool">Piscina</span>
                </label>
                
                <label class="custom-checkbox">
                    <input type="checkbox">
                    <span class="checkmark"></span>
                    <span class="checkbox-label" data-i18n="home.filterPet">Mascotas permitidas</span>
                </label>
                
                <label class="custom-checkbox">
                    <input type="checkbox" checked>
                    <span class="checkmark"></span>
                    <span class="checkbox-label" data-i18n="home.filterBbq">Zona BBQ</span>
                </label>
                
                <label class="custom-checkbox">
                    <input type="checkbox">
                    <span class="checkmark"></span>
                    <span class="checkbox-label" data-i18n="home.filterWifi">WiFi de alta velocidad</span>
                </label>

                <a href="#" class="show-more-link" data-i18n="catalog.showMore">Mostrar más <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></a>
            </div>

            <button class="btn-apply-filters" data-i18n="catalog.applyFilters">Aplicar filtros</button>
        </aside>
        `;
    }
}
customElements.define('catalog-filters', CatalogFilters);
