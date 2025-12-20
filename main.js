/**
 * Creative Portfolio - Main JavaScript
 * Handles common functionality across all pages
 * Fixed dark mode and z-index issues
 */

document.addEventListener('DOMContentLoaded', function () {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Initialize components
    initThemeToggle();
    initBackToTop();
    initNavbarScroll();
    initImageLazyLoading();
    initMobileMenuFix();

    // Page-specific initializations
    if (document.querySelector('#featuredGallery')) {
        initFeaturedGallery();
    }
});

/**
 * Dark/Light Theme Toggle - FIXED VERSION
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('i');

    if (!themeToggle || !themeIcon) {
        console.log('Theme toggle elements not found');
        return;
    }

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(themeIcon, savedTheme);

    themeToggle.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent event bubbling

        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        console.log(`Switching theme from ${currentTheme} to ${newTheme}`);

        // Update theme attribute on html element
        document.documentElement.setAttribute('data-theme', newTheme);

        // Save preference
        localStorage.setItem('theme', newTheme);

        // Update icon
        updateThemeIcon(themeIcon, newTheme);

        // Force repaint to ensure styles are applied
        document.body.style.visibility = 'hidden';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.visibility = 'visible';
    });
}

function updateThemeIcon(icon, theme) {
    if (theme === 'dark') {
        icon.className = 'bi bi-sun-fill';
        icon.setAttribute('title', 'Switch to Light Mode');
    } else {
        icon.className = 'bi bi-moon-fill';
        icon.setAttribute('title', 'Switch to Dark Mode');
    }
}

/**
 * Fix for Bootstrap mobile menu z-index issues
 */
function initMobileMenuFix() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');

    if (!navbar || !navbarToggler) return;

    // Ensure navbar has proper z-index
    navbar.style.zIndex = '1030';

    // Fix for Bootstrap collapse on mobile
    navbarToggler.addEventListener('click', function () {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbar.style.zIndex = '1030';
        } else {
            // When menu is open, ensure it's above everything
            navbar.style.zIndex = '1040';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        const navbarCollapse = document.querySelector('.navbar-collapse.show');
        const navbarToggler = document.querySelector('.navbar-toggler');

        if (navbarCollapse && !navbar.contains(event.target)) {
            // Trigger collapse
            if (navbarToggler) {
                navbarToggler.click();
            }
        }
    });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) return;

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Navbar Scroll Effect
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Image Lazy Loading
 */
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;

                // Remove data-src attribute and add loaded class
                img.removeAttribute('data-src');
                img.classList.add('loaded');

                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    images.forEach(img => imageObserver.observe(img));
}

/**
 * Featured Gallery on Home Page
 */
function initFeaturedGallery() {
    const galleryContainer = document.getElementById('featuredGallery');
    const loadingSpinner = galleryContainer.querySelector('.loading-spinner');

    // Sample image data (in production, this would come from an API)
    const allImages = [
        { id: 1, src: '/images/gallery/Potraiture/gallery-17.jpg', title: 'Urban Portrait', category: 'photography' },
        { id: 2, src: '/images/gallery/Potraiture/gallery-15.jpg', title: 'Creative Workspace', category: 'personal' },
        { id: 3, src: 'images/gallery/Corporate Events/gallery-10.jpg', title: 'Brand Campaign', category: 'photography' },
        { id: 4, src: 'images/gallery/Corporate Events/gallery-11.jpg', title: 'Product Showcase', category: 'commercial' },
        { id: 5, src: 'images/gallery/Potraiture/gallery-14.jpg', title: 'urban Portrait', category: 'personal' },
        { id: 6, src: 'images/gallery/sports and nature photography/gallery-19.jpg', title: 'Sports Action', category: 'photography' },
        { id: 7, src: 'images/gallery/sports and nature photography/gallery-29.jpg', title: 'nature', category: 'videography' },
        { id: 8, src: 'images/gallery/sports and nature photography/gallery-25.jpg', title: 'Japanese Streets', category: 'personal' },
        { id: 9, src: 'images/gallery/Potraiture/gallery-17.jpg', title: 'Sports Action', category: 'videography' },
        { id: 10, src: 'images/gallery/Potraiture/gallery-13.jpg', title: 'Creative Portrait', category: 'photography' }
    ];

    // Get 6 random images
    const getRandomImages = (images, count) => {
        const shuffled = [...images].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const featuredImages = getRandomImages(allImages, 6);

    // Simulate loading delay
    setTimeout(() => {
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }

        featuredImages.forEach(image => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';

            col.innerHTML = `
                <div class="featured-item">
                    <img src="${image.src}" 
                         data-src="${image.src}"
                         alt="${image.title}"
                         class="lazy-load"
                         loading="lazy">
                    <div class="featured-overlay">
                        <h4 class="featured-title">${image.title}</h4>
                        <span class="featured-category">${image.category}</span>
                    </div>
                </div>
            `;

            galleryContainer.appendChild(col);
        });

        // Re-initialize lazy loading for new images
        initImageLazyLoading();
    }, 800);
}

/**
 * Fix for Bootstrap modal z-index issue
 */
document.addEventListener('DOMContentLoaded', function () {
    // Ensure modals have proper z-index
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.zIndex = '1050';
    });

    // Fix modal backdrop
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach(backdrop => {
        backdrop.style.zIndex = '1040';
    });
});


// Add this function to test dark mode
function testDarkMode() {
    console.log('Testing dark mode...');
    console.log('Current theme:', document.documentElement.getAttribute('data-theme'));
    console.log('Body background:', getComputedStyle(document.body).backgroundColor);
    console.log('Body color:', getComputedStyle(document.body).color);

    // Force a theme switch to test
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);

    setTimeout(() => {
        console.log('After switch - theme:', document.documentElement.getAttribute('data-theme'));
        console.log('Body background:', getComputedStyle(document.body).backgroundColor);
        console.log('Body color:', getComputedStyle(document.body).color);

        // Switch back
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, 1000);
}

// Uncomment to test
// testDarkMode();
