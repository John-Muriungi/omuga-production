/**
 * Gallery Page Functionality
 * Handles filtering, masonry layout, and lightbox
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize gallery components
    initGalleryFilter();
    initGalleryMasonry();
    initImageModal();
    loadGalleryImages();
});

/**
 * Gallery Filtering
 */
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.btn-filter');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter gallery items
            const filterValue = this.getAttribute('data-filter');
            filterGalleryItems(filterValue);
        });
    });
}

function filterGalleryItems(filter) {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });

    // Reinitialize masonry layout after filtering
    setTimeout(initGalleryMasonry, 300);
}

/**
 * Masonry Layout for Gallery
 */
function initGalleryMasonry() {
    const galleryGrid = document.getElementById('galleryGrid');

    if (!galleryGrid || !window.Masonry) return;

    // Destroy existing masonry instance
    if (galleryGrid.masonry) {
        galleryGrid.masonry.destroy();
    }

    // Initialize new masonry instance
    galleryGrid.masonry = new Masonry(galleryGrid, {
        itemSelector: '.gallery-item',
        columnWidth: '.gallery-item',
        percentPosition: true,
        transitionDuration: '0.3s'
    });
}

/**
 * Shuffle array in-place using Fisher-Yates algorithm
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Image Modal (Lightbox) with Zoom & Fullscreen
 */
function initImageModal() {
    const fullscreenOverlay = document.getElementById('fullscreenOverlay');
    const fullscreenImage = document.getElementById('fullscreenImage');
    let fullscreenZoom = 1;

    console.log('✅ Image modal initialized');
    console.log('Fullscreen overlay element:', fullscreenOverlay);
    console.log('Fullscreen image element:', fullscreenImage);

    // Click on expand button to open fullscreen
    document.addEventListener('click', function (e) {
        const expandBtn = e.target.closest('.expand-btn');

        if (expandBtn) {
            e.preventDefault();

            const galleryItem = expandBtn.closest('.gallery-item');
            const img = galleryItem.querySelector('img');
            const fullSrc = img.getAttribute('data-full') || img.src;

            console.log('');
            console.log('=== EXPAND BUTTON CLICKED ===');
            console.log('Image title:', galleryItem.getAttribute('data-title'));
            console.log('Image src:', img.src);
            console.log('data-full attribute:', img.getAttribute('data-full'));
            console.log('Final fullSrc URL being used:', fullSrc);
            console.log('============================');
            console.log('');

            // Handle Google Drive URLs with CORS proxy
            let urlToLoad = fullSrc;
            let corsProxyUrl = null;
            
            if (fullSrc && fullSrc.includes('drive.google.com')) {
                // Prepare a CORS proxy version as fallback
                corsProxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(fullSrc)}`;
                console.log('📍 Detected Google Drive URL');
                console.log('   Primary URL:', fullSrc);
                console.log('   Proxy fallback:', corsProxyUrl);
            }

            // Set fullscreen image
            fullscreenImage.src = urlToLoad;

            fullscreenImage.onload = function () {
                console.log('✅ Fullscreen image loaded successfully!');
            };

            fullscreenImage.onerror = function (error) {
                console.error('❌ ERROR loading fullscreen image');
                console.error('URL attempted:', urlToLoad);
                console.error('Error:', error);
                
                // Try CORS proxy if available and not already tried
                if (corsProxyUrl && this.src !== corsProxyUrl) {
                    console.log('🔄 Attempting CORS proxy alternative...');
                    this.src = corsProxyUrl;
                    
                    // Override onerror for proxy attempt
                    this.onerror = function(proxyError) {
                        console.error('❌ CORS proxy also failed');
                        console.error('Both URLs inaccessible:', urlToLoad, corsProxyUrl);
                        this.alt = 'Image could not be loaded (access restricted)';
                    };
                } else {
                    this.alt = 'Failed to load fullscreen image';
                }
            };

            fullscreenZoom = 1;
            fullscreenImage.style.transform = `scale(${fullscreenZoom})`;

            // Show fullscreen overlay
            fullscreenOverlay.style.display = 'flex';
            console.log('🖼️ Fullscreen opened');

            document.getElementById('exitFullscreenBtn').focus();
        }
    });

    // Fullscreen Zoom In/Out
    document.getElementById('fullscreenZoomInBtn').addEventListener('click', function () {
        fullscreenZoom = Math.min(fullscreenZoom + 0.2, 3);
        fullscreenImage.style.transform = `scale(${fullscreenZoom})`;
    });

    document.getElementById('fullscreenZoomOutBtn').addEventListener('click', function () {
        fullscreenZoom = Math.max(fullscreenZoom - 0.2, 1);
        fullscreenImage.style.transform = `scale(${fullscreenZoom})`;
    });

    // Exit Fullscreen
    document.getElementById('exitFullscreenBtn').addEventListener('click', function () {
        fullscreenOverlay.style.display = 'none';
        fullscreenZoom = 1;
        console.log('❌ Fullscreen closed');
    });

    // Close fullscreen on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && fullscreenOverlay.style.display !== 'none') {
            fullscreenOverlay.style.display = 'none';
            fullscreenZoom = 1;
            console.log('❌ Fullscreen closed via Escape');
        }
    });
}

/**
 * Load Gallery Images
 * Attempts to load from Google Drive, falls back to local images
 */
async function loadGalleryImages() {
    const galleryGrid = document.getElementById('galleryGrid');
    const loadingSpinner = document.getElementById('galleryLoading');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');

    if (!galleryGrid) return;

    console.log('');
    console.log('========== LOADING GALLERY ==========');
    console.log('Starting gallery initialization...');
    console.log('');

    // Try to load from Google Drive first
    let galleryData = [];
    let sourceMessage = '';

    // Use LOCAL IMAGES directly (Google Drive has sharing issues)
    console.log('');
    console.log('🔄 Attempting to load images from Google Drive...');
    console.log('');

    // Try Google Drive first
    let driveImageLoadSuccess = false;
    if (typeof fetchGoogleDriveImages === 'function') {
        try {
            const driveImages = await fetchGoogleDriveImages();
            
            if (driveImages && driveImages.length > 0) {
                galleryData = driveImages.map((img, index) => ({
                    id: index + 1,
                    thumb: img.thumb || img.src || img.full,
                    full: img.full || img.src,
                    src: img.full || img.src,
                    title: img.title,
                    category: img.category,
                    description: img.description,
                    folderName: img.folderName
                }));
                
                console.log(`✅ SUCCESS! Loaded ${galleryData.length} images from Google Drive`);
                driveImageLoadSuccess = true;
            }
        } catch (error) {
            console.log('⚠️ Google Drive loading failed, falling back to local images:', error.message);
        }
    }

    // Fallback to local images if Google Drive fails
    if (!driveImageLoadSuccess || galleryData.length === 0) {
        console.log('📂 Loading LOCAL IMAGES from your file system');
        console.log('');

        // Local images from your folder structure
        const imageFiles = [
        // Corporate Events (1-12)
        'images/gallery/Corporate Events/gallery-1.jpg',
        'images/gallery/Corporate Events/gallery-2.jpg',
        'images/gallery/Corporate Events/gallery-3.jpg',
        'images/gallery/Corporate Events/gallery-4.jpg',
        'images/gallery/Corporate Events/gallery-5.jpg',
        'images/gallery/Corporate Events/gallery-6.jpg',
        'images/gallery/Corporate Events/gallery-7.jpg',
        'images/gallery/Corporate Events/gallery-8.jpg',
        'images/gallery/Corporate Events/gallery-9.jpg',
            'images/gallery/Corporate Events/gallery-10.jpg',
            'images/gallery/Corporate Events/gallery-11.jpg',
            'images/gallery/Corporate Events/gallery-12.jpg',
            // Potraiture (13-18)
            'images/gallery/Potraiture/gallery-13.jpg',
            'images/gallery/Potraiture/gallery-14.jpg',
            'images/gallery/Potraiture/gallery-15.jpg',
            'images/gallery/Potraiture/gallery-16.jpg',
            'images/gallery/Potraiture/gallery-17.jpg',
            'images/gallery/Potraiture/gallery-18.jpg',
            // Sports and nature photography (19-30)
            'images/gallery/sports and nature photography/gallery-19.jpg',
            'images/gallery/sports and nature photography/gallery-20.jpg',
            'images/gallery/sports and nature photography/gallery-21.jpg',
            'images/gallery/sports and nature photography/gallery-22.jpg',
            'images/gallery/sports and nature photography/gallery-23.jpg',
            'images/gallery/sports and nature photography/gallery-24.jpg',
            'images/gallery/sports and nature photography/gallery-25.jpg',
            'images/gallery/sports and nature photography/gallery-26.jpg',
            'images/gallery/sports and nature photography/gallery-27.jpg',
            'images/gallery/sports and nature photography/gallery-28.jpg',
            'images/gallery/sports and nature photography/gallery-29.jpg',
            'images/gallery/sports and nature photography/gallery-30.jpg'
        ];

        // Map file paths into gallery data with titles and categories derived from path
        galleryData = imageFiles.map((path, index) => {
            const filename = path.split('/').pop();
            const nameNoExt = filename.replace(/\.[^/.]+$/, '').replace(/-/g, ' ');
            const title = nameNoExt.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

            let category = 'photography';
            if (path.includes('Corporate Events')) category = 'commercial';
            else if (path.includes('Potraiture')) category = 'photography';
            else if (path.includes('sports and nature photography')) category = 'personal';

            return {
                id: index + 1,
                src: path,
                thumb: path,
                full: path,  // Make sure full is set to the path for local images
                title: title,
                category: category,
                description: `${title} — ${category}`
            };
        });
    }

    // Shuffle images to mix categories from all folders
    if (galleryData && galleryData.length > 1) {
        shuffleArray(galleryData);
    }

    let currentPage = 1;
    const itemsPerPage = 9;

    // Load initial images
    function loadImages(page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageImages = galleryData.slice(startIndex, endIndex);

        pageImages.forEach(image => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 gallery-item';
            col.setAttribute('data-category', image.category);
            col.setAttribute('data-title', image.title);
            col.setAttribute('data-description', image.description);
            col.setAttribute('data-file-id', image.id || '');

            col.innerHTML = `
                <div class="gallery-item-inner">
                    <img src="${image.thumb || image.src}" 
                         data-src="${image.thumb || image.src}"
                         data-full="${image.full || image.src}"
                         alt="${image.title}"
                         class="lazy-load"
                         loading="lazy">
                    <div class="gallery-overlay">
                        <h4 class="gallery-title">${image.title}</h4>
                        <span class="gallery-category">${image.category}</span>
                        <p class="gallery-description mt-2">${image.description}</p>
                        <button class="btn btn-sm btn-light mt-3 expand-btn" title="Expand to fullscreen">
                            <i class="bi bi-arrows-fullscreen"></i> Expand
                        </button>
                    </div>
                </div>
            `;

            galleryGrid.appendChild(col);
        });

        // Hide loading spinner after first load
        if (loadingSpinner && page === 1) {
            loadingSpinner.style.display = 'none';
        }

        // Hide load more button if no more images
        if (endIndex >= galleryData.length) {
            loadMoreContainer.style.display = 'none';
        }

        // Reinitialize masonry and lazy loading
        setTimeout(() => {
            initGalleryMasonry();
            initImageLazyLoading();
        }, 100);
    }

    // Load initial page
    loadImages(currentPage);

    // Load more button functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            currentPage++;
            loadImages(currentPage);
        });
    }
}