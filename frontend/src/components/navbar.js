class NavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <div class="ctx-c_nav">
        <nav class="ctx-nav_bar">
            <div class="ctx-c_nav_logo">
                <a href="index.html" class="logo">
                    <img src="/frontend/public/nf_logo_nf.png" alt="Nos Fuimos de Finca!" height="55px" width="auto">
                </a>
            </div>
            <div class="ctx-c_nav_main_options">
                <ul class="ctx-options">
                    <li class="active">
                        <a href="index.html">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            <span data-i18n="nav.home">Inicio</span>
                        </a>
                    </li>
                    <li>
                        <a href="catalog.html">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 20 10 4" />
                                <path d="m5 20 9-16" />
                                <path d="M3 20h18" />
                                <path d="m12 15-3 5" />
                                <path d="m12 15 3 5" />
                            </svg>
                            <span data-i18n="nav.fincas">Fincas</span>
                        </a>
                    </li>
                    <li>
                        <a href="contact.html">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path
                                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            <span data-i18n="nav.contact">Contacto</span>
                        </a>
                    </li>
                    <li>
                        <a href="contract.html">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14 2 14 8 20 8" />
                                <path d="M8 13h2" />
                                <path d="M8 17h2" />
                                <path d="M14 13h4" />
                                <path d="M14 17h4" />
                            </svg>
                            <span data-i18n="nav.contract">Contrato</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="ctx-c_nav_actions">
                <button class="btn btn-dark" data-i18n="nav.publish">Publicar</button>
                <div class="nav-icons">
                    <!-- Botón de Modo Oscuro/Claro -->
                    <button class="theme-toggle menu-btn" aria-label="Cambiar tema">
                        <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                    </button>

                    <div class="dropdown">
                        <button class="dropdown-trigger menu-btn" aria-label="Idioma" aria-haspopup="true">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path
                                    d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
                                </path>
                            </svg>
                        </button>
                        <ul>
                            <li><a href="#" class="lang-selector" data-lang="es">Español</a></li>
                            <li><a href="#" class="lang-selector" data-lang="en">English</a></li>
                        </ul>
                    </div>
                    <div class="dropdown">
                        <button class="dropdown-trigger menu-btn" aria-label="Menú de usuario" aria-haspopup="true">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>
                        <ul>
                            <li><a href="/frontend/src/pages/auth/login.html" data-i18n="nav.login">Iniciar Sesion</a></li>
                            <li><a href="/frontend/src/pages/auth/register.html" data-i18n="nav.register">Registrarse</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </div>
        `;
    }
}
customElements.define('nav-bar', NavBar);
