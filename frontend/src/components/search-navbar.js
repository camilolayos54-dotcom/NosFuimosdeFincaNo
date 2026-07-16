class SearchNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav class="search-navbar">
            <div class="search-nav-left">
                <a href="index.html" class="search-nav-logo">
                    <img src="/frontend/public/nf_logo_nf.png" alt="Nos Fuimos de Finca">
                </a>
                
                <div class="search-nav-input-wrapper desktop-search">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <input type="text" placeholder="Buscar destinos o fincas...">
                </div>
            </div>
            
            <button class="mobile-menu-toggle" aria-label="Abrir menú">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            
            <div class="search-nav-right">
                <div class="search-nav-input-wrapper mobile-search">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <input type="text" placeholder="Buscar destinos o fincas...">
                </div>
                
                <div class="search-nav-links">
                    <a href="#">Destinos</a>
                    <a href="#">Experiencias</a>
                    <a href="#">Anfitriones</a>
                </div>
                <button class="search-nav-btn">Reservar Ahora</button>
            </div>
        </nav>
        `;

        const toggleBtn = this.querySelector('.mobile-menu-toggle');
        const navRight = this.querySelector('.search-nav-right');

        toggleBtn.addEventListener('click', () => {
            navRight.classList.toggle('mobile-open');
        });
    }
}

customElements.define('search-navbar', SearchNavbar);
