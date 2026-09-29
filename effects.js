// Content stays visible if JavaScript or motion effects are unavailable.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.section, .publication-item').forEach((element) => {
        revealObserver.observe(element);
    });
}

const progressBar = document.querySelector('.reading-progress');
const sections = [...document.querySelectorAll('main > section[id]')];
const navLinks = [...document.querySelectorAll('.nav-links a')];
const pageHeader = document.querySelector('header');
let scrollScheduled = false;

function updateScrollState() {
    const availableScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = availableScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / availableScroll)) : 0;
    progressBar.style.transform = `scaleX(${progress})`;

    const offset = pageHeader.offsetHeight + 50;
    let activeId = '';
    for (const section of sections) {
        if (section.getBoundingClientRect().top <= offset) activeId = section.id;
    }
    if (progress >= 0.999 && availableScroll > 0) activeId = sections.at(-1).id;
    navLinks.forEach((link) => {
        if (link.hash === `#${activeId}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });
    scrollScheduled = false;
}

function scheduleScrollUpdate() {
    if (!scrollScheduled) {
        scrollScheduled = true;
        requestAnimationFrame(updateScrollState);
    }
}

window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
window.addEventListener('resize', scheduleScrollUpdate);
window.addEventListener('load', scheduleScrollUpdate);
updateScrollState();
