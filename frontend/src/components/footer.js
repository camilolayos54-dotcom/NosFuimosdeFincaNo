class GlobalFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="global-footer">
            <div class="footer-left">
                <h2>Nos Fuimos de Finca</h2>
                <p>© 2024 Nos Fuimos de Finca. Todos los derechos reservados.</p>
            </div>
            <div class="footer-right">
                <a href="#">Privacidad</a>
                <a href="#">Términos</a>
                <a href="#">Contacto</a>
                <a href="#">Preguntas Frecuentes</a>
                
                <div class="footer-icons" style="display: flex; gap: 1rem; margin-left: 1rem;">
                    <a href="#" aria-label="Cambiar idioma">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                    </a>
                    <a href="#" aria-label="Compartir">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    </a>
                </div>
            </div>
        </footer>
        `;
    }
}

customElements.define('global-footer', GlobalFooter);
