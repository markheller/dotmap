window.slideshowImages = [
    { src: "images/home/Landscape-Workshop_Web.jpg", caption: "<em>Landscape Workshop</em>, Data x Design Exhibition, 2026" },
    { src: "images/home/Auto-Simulacrum.png", caption: "Computational Rendering of Mt. Hood produced with Auto-Simulacrum, 2020" },
    { src: "images/home/AcrossTheMainland.png", caption: "Still from <em>Across the Mainland</em>, 2020" },
    { src: "images/home/siting.png", caption: "Pittsburgh Development Index, Siting Invisible Values, 2023" },
    { src: "images/home/AlphanumericSublime.png", caption: "Composite Still from <em>Alphanumeric Sublime</em>, 2020" },
    { src: "images/home/MetabolicCities_Diagram.png", caption: "Stock and Flow Diagram, Metabolic Cities, 2017" },
    { src: "images/home/Ibex_Perspective.jpg", caption: "Terrain Model of the Grand Canyon produced with Ibex, 2020" }
];

window.slideshowIndex = 0;

let animating = false;

const slideA = document.getElementById('slideA');
const slideB = document.getElementById('slideB');
const caption = document.getElementById('caption');

let current = slideA;
let next = slideB;

/* INIT */

function initSlideshow() {
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

initSlideshow();

/* PRELOAD */

function preloadImage(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = () => resolve(src);
    });
}

/* MAIN */

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

    const transition = 'transform 2s cubic-bezier(0.4, 0, 0.2, 1)';
    next.style.transition = transition;
    current.style.transition = transition;

    next.style.transform = 'translateX(0)';
    current.style.transform = 'translateX(-100%)';

    caption.style.opacity = '0';

    setTimeout(() => {
        caption.innerHTML = window.slideshowImages[window.slideshowIndex].caption;
        caption.style.opacity = '1';
    }, 1600);

    current.addEventListener('transitionend', () => {
        current.style.transition = 'none';
        current.style.transform = 'translateX(100%)';
        current.style.visibility = 'hidden';

        [current, next] = [next, current];
        animating = false;
    }, { once: true });
}

/* AUTOPLAY */

let slideshowInterval = setInterval(() => {
    advanceSlideshow(window.slideshowIndex + 1);
}, 4000);

/* CONTROLS */

document.querySelector('.slideshow .next').addEventListener('click', () => {
    clearInterval(slideshowInterval);
    advanceSlideshow(window.slideshowIndex + 1);
    slideshowInterval = setInterval(() => advanceSlideshow(window.slideshowIndex + 1), 4000);
});

document.querySelector('.slideshow .prev').addEventListener('click', () => {
    clearInterval(slideshowInterval);
    advanceSlideshow(window.slideshowIndex - 1);
    slideshowInterval = setInterval(() => advanceSlideshow(window.slideshowIndex + 1), 4000);
});