document.addEventListener('DOMContentLoaded', () => {
    // 1. Password Visibility Toggle
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon (eye / eye-off). For now, it stays the same, 
            // but we could swap the SVG here if we had both icons.
            if (type === 'text') {
                togglePasswordBtn.style.color = '#333'; // Highlight when visible
            } else {
                togglePasswordBtn.style.color = '#777'; // Dim when hidden
            }
        });
    }

    // 2. Image Carousel
    const carouselImages = document.querySelectorAll('.carousel-img');
    let currentImageIndex = 0;

    if (carouselImages.length > 1) {
        setInterval(() => {
            // Remove active class from current image
            carouselImages[currentImageIndex].classList.remove('active');
            
            // Move to next image
            currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
            
            // Add active class to new image
            carouselImages[currentImageIndex].classList.add('active');
        }, 4000); // Change image every 4 seconds
    }
});
