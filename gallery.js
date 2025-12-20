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
 * Image Modal (Lightbox)
 */
function initImageModal() {
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));

    document.addEventListener('click', function (e) {
        const galleryItem = e.target.closest('.gallery-item');

        if (galleryItem) {
            e.preventDefault();

            const img = galleryItem.querySelector('img');
            const title = galleryItem.getAttribute('data-title');
            const description = galleryItem.getAttribute('data-description');
            const category = galleryItem.getAttribute('data-category');
            const projectLink = galleryItem.getAttribute('data-project-link');

            // Update modal content
            document.getElementById('modalImage').src = img.src;
            document.getElementById('imageModalTitle').textContent = title;
            document.getElementById('imageDescription').textContent = description;
            document.getElementById('imageCategory').textContent = `Category: ${category}`;

            const viewProjectBtn = document.getElementById('viewProjectBtn');
            if (projectLink) {
                viewProjectBtn.href = projectLink;
                viewProjectBtn.style.display = 'inline-block';
            } else {
                viewProjectBtn.style.display = 'none';
            }

            // Show modal
            imageModal.show();
        }
    });
}

/**
 * Load Gallery Images
 */
function loadGalleryImages() {
    const galleryGrid = document.getElementById('galleryGrid');
    const loadingSpinner = document.getElementById('galleryLoading');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');

    if (!galleryGrid) return;

    // Use actual gallery files found in subfolders
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
    const galleryData = imageFiles.map((path, index) => {
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
            title: title,
            category: category,
            description: `${title} — ${category}`
        };
    });

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

            col.innerHTML = `
                <div class="gallery-item-inner">
                    <img src="${image.src}" 
                         data-src="${image.src}"
                         alt="${image.title}"
                         class="lazy-load"
                         loading="lazy">
                    <div class="gallery-overlay">
                        <h4 class="gallery-title">${image.title}</h4>
                        <span class="gallery-category">${image.category}</span>
                        <p class="gallery-description mt-2">${image.description}</p>
                        <button class="btn btn-sm btn-light mt-3">View Details</button>
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