let currentGallery = [];
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', function () {
    setupLightbox();
});

function setupLightbox() {
    createLightbox();
    attachImageHandlers();
}

function createLightbox() {
    if (document.getElementById('lightbox-container')) return;

    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox-container';
    lightbox.className = 'lightbox';

    lightbox.innerHTML = `
    <div class="lightbox-content">
        <img id="lightbox-img" src="" alt="">
        <div class="lightbox-close">&#x2715;</div>
        <div class="lightbox-nav prev">&#60;</div>
        <div class="lightbox-nav next">&#62;</div>
    </div>
`;

    document.body.appendChild(lightbox);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    lightbox.querySelector('.lightbox-close')
        .addEventListener('click', closeLightbox);

    lightbox.querySelector('.next')
        .addEventListener('click', nextImage);

    lightbox.querySelector('.prev')
        .addEventListener('click', prevImage);
}

function attachImageHandlers() {
    const images = document.querySelectorAll('img');
    const isHomepage = document.body.classList.contains('homepage');

    images.forEach(img => {
        const inLink = img.closest('a');
        const inSlideshow = img.closest('.slideshow');
        const noLightbox = img.closest('.no-lightbox');
        const inMenuButton = img.closest('.menu-button');

        if (inLink || noLightbox || inMenuButton) return;
        if (inSlideshow && !isHomepage) return;

        if (img.dataset.lightboxBound) return;
        img.dataset.lightboxBound = 'true';

        img.style.cursor = 'pointer';
        img.addEventListener('dragstart', e => e.preventDefault());

        img.addEventListener('click', () => {
            if (inSlideshow && isHomepage && window.slideshowImages) {
                currentGallery = window.slideshowImages.map(item => item.src);
                currentIndex = window.slideshowIndex ?? 0;
            } else {
                currentGallery = [img.src];
                currentIndex = 0;
            }
            openLightbox();
        });
    });
}

function openLightbox() {
    const lightbox = document.getElementById('lightbox-container');
    if (!lightbox) return;

    // Show or hide arrows depending on gallery size
    const isSingle = currentGallery.length <= 1;
    lightbox.querySelector('.prev').style.display = isSingle ? 'none' : '';
    lightbox.querySelector('.next').style.display = isSingle ? 'none' : '';

    lightbox.classList.add('active');
    showLightboxImage(currentIndex);

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeydown);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox-container');
    const img = document.getElementById('lightbox-img');

    if (!lightbox || !img) return;

    lightbox.classList.remove('active');
    img.src = '';

    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeydown);
}

function showLightboxImage(index) {
    const src = currentGallery[index];
    if (!src) return;

    const img = document.getElementById('lightbox-img');
    img.src = '';
    setTimeout(() => {
        img.src = src;
    }, 10);
}

function nextImage() {
    if (currentGallery.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentGallery.length;
    showLightboxImage(currentIndex);
}

function prevImage() {
    if (currentGallery.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    showLightboxImage(currentIndex);
}

function handleKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
}