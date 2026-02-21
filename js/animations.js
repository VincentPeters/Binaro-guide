/* ================================================
   ANIMATIONS — Scroll reveal, before/after solve,
                hero background, grid showcase
   ================================================ */

export function initAnimations() {
    // Enable JS-dependent styles (scroll animations)
    document.documentElement.classList.add('js');

    initScrollReveal();
    initBeforeAfterSolve();
    initHeroBackground();
    initGridSizeShowcase();
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.content-block').forEach(block => observer.observe(block));
}

function initBeforeAfterSolve() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    document.querySelectorAll('.before-after').forEach(ba => {
        const afterItem = ba.querySelector('.ba-item:last-child');
        if (!afterItem) return;
        const solvedCells = afterItem.querySelectorAll('.cell-sm.solved');
        if (solvedCells.length === 0) return;

        solvedCells.forEach((cell, i) => {
            cell.classList.add('solve-pending');
            cell.style.animationDelay = (0.3 + i * 0.25) + 's';
        });

        const baObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    solvedCells.forEach(cell => {
                        cell.classList.remove('solve-pending');
                        cell.classList.add('solve-active');
                    });
                    baObserver.unobserve(ba);
                }
            });
        }, { threshold: 0.3 });

        baObserver.observe(ba);
    });
}

function initHeroBackground() {
    const heroBg = document.getElementById('heroBgGrid');
    if (!heroBg) return;

    const cols = 28;
    const rows = 20;
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('span');
        cell.style.cssText = `
            display: inline-block;
            width: ${100/cols}%;
            aspect-ratio: 1;
            background: ${Math.random() > 0.5 ? 'var(--cell-zero-bg)' : 'var(--cell-one-bg)'};
            border-radius: 3px;
        `;
        heroBg.appendChild(cell);
    }
    heroBg.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 2px;
        padding: 2px;
    `;
}

function initGridSizeShowcase() {
    document.querySelectorAll('.grid-size-visual').forEach(grid => {
        const cls = grid.className;
        const match = cls.match(/grid-(\d+)/);
        if (!match) return;
        const n = parseInt(match[1]);
        for (let i = 0; i < n * n; i++) {
            const cell = document.createElement('span');
            cell.style.background = Math.random() > 0.5
                ? 'var(--cell-zero-bg)' : 'var(--cell-one-bg)';
            grid.appendChild(cell);
        }
    });
}
