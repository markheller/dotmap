window.slideshowImages = [
    { src: "images/home/Landscape-Workshop_Web.jpg", caption: "<em>Landscape Workshop</em>, Data x Design Exhibition, 2026" },
    { src: "images/home/Auto-Simulacrum.png", caption: "Computational Rendering of Mt. Hood produced with Auto-Simulacrum, 2020" },
    { src: "images/home/AcrossTheMainland.png", caption: "Still from <em>Across the Mainland</em>, 2020" },
    { src: "images/home/siting.png", caption: "Pittsburgh Development Index, Siting Invisible Values, 2023" },
    { src: "images/home/AlphanumericSublime.png", caption: "Composite still from <em>Alphanumeric Sublime</em>, 2020" },
    { src: "images/home/MetabolicCities_Diagram.png", caption: "Stock and flow diagram, Metabolic Cities, 2017" },
    { src: "images/home/Ibex_Perspective.jpg", caption: "Terrain model of the Grand Canyon produced with Ibex, 2020" }
];

window.slideshowIndex = 0;

let animating = false;
let current, next, caption;
let slideshowInterval;

/* PRELOAD ALL IMAGES IMMEDIATELY */
function preloadAllImages() {
    window.slideshowImages.forEach(img => {
        const i = new Image();
        i.src = img.src;
    });
}

/* INIT */
function initSlideshow() {
    current = document.getElementById('slideA');
    next = document.getElementById('slideB');
    caption = document.getElementById('caption');

    if (!current || !next || !caption) return;

    current.src = window.slideshowImages[0].src;
    current.style.transform = 'translateX(0)';
    current.style.zIndex = '2';
    current.style.visibility = 'visible';

    next.style.transform = 'translateX(100%)';
    next.style.zIndex = '1';
    next.style.visibility = 'hidden';

    caption.innerHTML = window.slideshowImages[0].caption;
    caption.style.opacity = '1';
}

/* PRELOAD SINGLE IMAGE (for transitions) */
function preloadImage(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = () => resolve(src);
    });
}

/* MAIN TRANSITION */
async function advanceSlideshow(i) {
    if (animating) return;
    animating = true;

    window.slideshowIndex = (i + window.slideshowImages.length) % window.slideshowImages.length;

    const newSrc = await preloadImage(window.slideshowImages[window.slideshowIndex].src);
    next.src = newSrc;

    next.style.transition = 'none';
    current.style.transition = 'none';

    next.style.transform = 'translateX(100%)';
    next.style.visibility = 'visible';

    next.offsetHeight;

    next.style.zIndex = '3';
    current.style.zIndex = '2';

    const transition = 'transform 1.6s cubic-bezier(0.4, 0, 0.2, 1)';
    next.style.transition = transition;
    current.style.transition = transition;

    next.style.transform = 'translateX(0)';
    current.style.transform = 'translateX(-100%)';

    caption.style.opacity = '0';

    setTimeout(() => {
        caption.innerHTML = window.slideshowImages[window.slideshowIndex].caption;
        caption.style.opacity = '1';
    }, 1200);

    current.addEventListener('transitionend', () => {
        current.style.transition = 'none';
        current.style.transform = 'translateX(100%)';
        current.style.visibility = 'hidden';

        [current, next] = [next, current];
        animating = false;
    }, { once: true });
}

/* AUTOPLAY */
function startAutoplay() {
    slideshowInterval = setInterval(() => {
        advanceSlideshow(window.slideshowIndex + 1);
    }, 4000);
}

/* CONTROLS */
function setupControls() {
    const nextBtn = document.querySelector('.slideshow .next');
    const prevBtn = document.querySelector('.slideshow .prev');

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(slideshowInterval);
            advanceSlideshow(window.slideshowIndex + 1);
            startAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(slideshowInterval);
            advanceSlideshow(window.slideshowIndex - 1);
            startAutoplay();
        });
    }
}

/* START EVERYTHING AFTER DOM LOAD */
document.addEventListener('DOMContentLoaded', () => {
    preloadAllImages();   // ✅ key fix for delay
    initSlideshow();      // ✅ instant first render
    setupControls();      // ✅ safe event binding
    startAutoplay();      // ✅ begin cycling
});