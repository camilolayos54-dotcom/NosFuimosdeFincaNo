class GlobalFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="global-footer">
            <div class="footer-container">
                <div class="footer-col brand-col">
                    <div class="footer-logo">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4c5b0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        <h2>Nos Fuimos de Finca</h2>
                    </div>
                    <p>La forma más fácil y segura de alquilar fincas campestres verificadas en todo el país.</p>
                    <div class="footer-socials">
                        <a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
                        <a href="#" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                        <a href="#" aria-label="WhatsApp"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></a>
                    </div>
                </div>
                
                <div class="footer-col links-col">
                    <h3>Explorar</h3>
                    <a href="#">Inicio</a>
                    <a href="#">Fincas destacadas</a>
                    <a href="#">Nosotros</a>
                    <a href="#">Experiencias</a>
                    <a href="#">Testimonios</a>
                </div>
                
                <div class="footer-col contact-col">
                    <h3>Contacto</h3>
                    <p>Cra. 13 #93-40, Bogotá D.C.</p>
                    <p>+57 (601) 743 2100</p>
                    <p>hola@nosfuimosdefinca.co</p>
                    <p>Lun - Dom · 24 horas</p>
                </div>
                
                <div class="footer-col newsletter-col">
                    <h3>Boletín</h3>
                    <p>Recibe ofertas y nuevas fincas cada mes.</p>
                    <form class="newsletter-form">
                        <input type="email" placeholder="Tu correo" required>
                        <button type="submit" aria-label="Suscribirse">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                    </form>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>© 2026 Nos Fuimos de Finca. Todos los derechos reservados.</p>
                <div class="footer-bottom-links">
                    <a href="#">Términos</a>
                    <a href="#">Privacidad</a>
                    <a href="#">Cookies</a>
                </div>
            </div>
        </footer>
        `;
    }
}

customElements.define('global-footer', GlobalFooter);
