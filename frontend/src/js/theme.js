document.addEventListener('DOMContentLoaded', () => {
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        // Icon update is deferred until navbar is loaded
    }
    
    // Since the navbar is a Web Component and might take a moment to render,
    // we use a MutationObserver or a small delay to attach the event listener.
    const attachThemeListener = () => {
        const themeToggles = document.querySelectorAll('.theme-toggle');
        if (themeToggles.length > 0) {
            themeToggles.forEach(toggle => {
                // Prevent multiple bindings if re-attached
                toggle.removeEventListener('click', handleThemeToggle);
                toggle.addEventListener('click', handleThemeToggle);
            });
            // Update icon right after binding based on current body class
            updateThemeIcon(document.body.classList.contains('dark-mode'));
        } else {
            // Retry if not yet available
            setTimeout(attachThemeListener, 100);
        }
    };
    
    attachThemeListener();
});

function handleThemeToggle() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
        if (isDark) {
            // Sun icon for dark mode
            toggle.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v2"/>
                    <path d="M12 20v2"/>
                    <path d="m4.93 4.93 1.41 1.41"/>
                    <path d="m17.66 17.66 1.41 1.41"/>
                    <path d="M2 12h2"/>
                    <path d="M20 12h2"/>
                    <path d="m6.34 17.66-1.41 1.41"/>
                    <path d="m19.07 4.93-1.41 1.41"/>
                </svg>
            `;
        } else {
            // Moon icon for light mode
            toggle.innerHTML = `
                <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
            `;
        }
    });
}
