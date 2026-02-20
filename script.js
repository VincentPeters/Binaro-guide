/* ================================================
   BINARO GUIDE — INTERACTIVE SCRIPT
   Walkthroughs, practice puzzles, animations
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // Enable JS-dependent styles (scroll animations)
    document.documentElement.classList.add('js');

    // ========================================
    // NAVIGATION
    // ========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    if (navToggle && navLinks) {
        navToggle.setAttribute('aria-controls', 'navLinks');
        navToggle.setAttribute('aria-expanded', 'false');

        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.content-block').forEach(block => observer.observe(block));

    // ========================================
    // HERO BACKGROUND GRID
    // ========================================
    const heroBg = document.getElementById('heroBgGrid');
    if (heroBg) {
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

    // ========================================
    // GRID SIZE SHOWCASE — fill mini grids
    // ========================================
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

    // ========================================
    // UTILITY: Render a puzzle grid
    // ========================================
    function renderGrid(container, grid, cellSize, options = {}) {
        const n = grid.length;
        container.innerHTML = '';
        container.style.gridTemplateColumns = `repeat(${n}, ${cellSize}px)`;

        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.width = cellSize + 'px';
                cell.style.height = cellSize + 'px';
                cell.style.fontSize = (cellSize * 0.45) + 'px';
                cell.dataset.row = r;
                cell.dataset.col = c;

                const val = grid[r][c];
                if (val === 0) {
                    cell.classList.add('zero');
                    cell.textContent = '0';
                } else if (val === 1) {
                    cell.classList.add('one');
                    cell.textContent = '1';
                } else {
                    cell.classList.add('empty-cell');
                }

                if (options.given && options.given[r][c] !== null) {
                    cell.classList.add('given');
                }

                if (options.highlight) {
                    for (const h of options.highlight) {
                        if (h[0] === r && h[1] === c) {
                            cell.classList.add('highlighted');
                        }
                    }
                }

                if (options.justSolved) {
                    for (const s of options.justSolved) {
                        if (s[0] === r && s[1] === c) {
                            cell.classList.add('just-solved');
                        }
                    }
                }

                if (options.onClick) {
                    cell.addEventListener('click', () => options.onClick(r, c, cell));
                }

                container.appendChild(cell);
            }
        }
    }

    // Deep clone a 2D array
    function cloneGrid(grid) {
        return grid.map(row => [...row]);
    }

    // ========================================
    // WALKTHROUGH ENGINE
    // ========================================
    function createWalkthrough(config) {
        const {
            gridId, prevId, nextId, stepNumId, stepTotalId, explanationId,
            initialGrid, steps, cellSize
        } = config;

        const container = document.getElementById(gridId);
        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);
        const stepNumEl = document.getElementById(stepNumId);
        const stepTotalEl = document.getElementById(stepTotalId);
        const explanationEl = document.getElementById(explanationId);

        let currentStep = -1;
        const grids = [cloneGrid(initialGrid)];

        // Build grid states for each step
        for (let i = 0; i < steps.length; i++) {
            const prev = cloneGrid(grids[i]);
            for (const placement of steps[i].placements) {
                prev[placement.r][placement.c] = placement.v;
            }
            grids.push(prev);
        }

        stepTotalEl.textContent = steps.length;

        function render() {
            const step = currentStep;
            const gridState = grids[step + 1];
            const opts = { given: initialGrid };

            if (step >= 0) {
                opts.justSolved = steps[step].placements.map(p => [p.r, p.c]);
                if (steps[step].highlight) {
                    opts.highlight = steps[step].highlight;
                }
            }

            renderGrid(container, gridState, cellSize, opts);
            stepNumEl.textContent = Math.max(0, step + 1);

            if (step < 0) {
                explanationEl.textContent = 'Press "Next Step" to begin solving.';
            } else {
                explanationEl.textContent = steps[step].explanation;
            }

            prevBtn.disabled = step < 0;
            nextBtn.disabled = step >= steps.length - 1;
            if (step >= steps.length - 1) {
                nextBtn.textContent = 'Done!';
            } else {
                nextBtn.textContent = 'Next Step';
            }
        }

        nextBtn.addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                render();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentStep >= 0) {
                currentStep--;
                render();
            }
        });

        render();
    }

    // ========================================
    // WALKTHROUGH 1: 4×4 Puzzle
    // ========================================
    // Puzzle:
    //   _  1  _  _
    //   0  _  _  1
    //   _  _  1  _
    //   _  0  _  _
    // Solution:
    //   0  1  1  0
    //   0  1  0  1
    //   1  0  1  0
    //   1  0  0  1
    const w1Initial = [
        [null, 1,    null, null],
        [0,    null, null, 1   ],
        [null, null, 1,    null],
        [null, 0,    null, null]
    ];

    createWalkthrough({
        gridId: 'walkthrough1Grid',
        prevId: 'w1Prev', nextId: 'w1Next',
        stepNumId: 'w1StepNum', stepTotalId: 'w1StepTotal',
        explanationId: 'w1Explanation',
        initialGrid: w1Initial,
        cellSize: 56,
        steps: [
            {
                placements: [{ r: 0, c: 0, v: 0 }],
                explanation: 'Row 1 has a 1 at position 2. Column 1 already has a 0 in row 2. To avoid two 0s at the top of col 1, and keep equal counts, place 0 here.',
                highlight: [[0, 1], [1, 0]]
            },
            {
                placements: [{ r: 0, c: 2, v: 1 }],
                explanation: 'Row 1 now has: 0, 1, _, _. It needs two 0s and two 1s. We already have one 0 and one 1. Column 3 has a 1 in row 3 — placing 1 here is valid (no three in a row).',
                highlight: [[0, 0], [0, 1], [2, 2]]
            },
            {
                placements: [{ r: 0, c: 3, v: 0 }],
                explanation: 'Row 1 is now: 0, 1, 1, _. We already have two 1s, so the last cell must be 0.',
            },
            {
                placements: [{ r: 1, c: 1, v: 1 }],
                explanation: 'Column 2: has 1 (row 1), 0 (row 4). Row 2 starts with 0, and needs balance. Placing 1 here avoids triple issues.',
                highlight: [[0, 1], [3, 1]]
            },
            {
                placements: [{ r: 1, c: 2, v: 0 }],
                explanation: 'Row 2 is: 0, 1, _, 1. Already two 1s → remaining must be 0.',
            },
            {
                placements: [{ r: 2, c: 0, v: 1 }],
                explanation: 'Column 1: has 0 (row 1), 0 (row 2). Already two 0s — next must be 1 (pair cap rule).',
                highlight: [[0, 0], [1, 0]]
            },
            {
                placements: [{ r: 2, c: 1, v: 0 }],
                explanation: 'Row 3: 1, _, 1, _. Sandwich! A 1 on each side of position 2 means it must be 0.',
                highlight: [[2, 0], [2, 2]]
            },
            {
                placements: [{ r: 2, c: 3, v: 0 }],
                explanation: 'Row 3 now: 1, 0, 1, _. Two 1s already → last cell = 0.',
            },
            {
                placements: [{ r: 3, c: 0, v: 1 }],
                explanation: 'Column 1: has 0, 0, 1, _. Two 0s and one 1 → needs one more 1. Place 1.',
            },
            {
                placements: [{ r: 3, c: 2, v: 0 }, { r: 3, c: 3, v: 1 }],
                explanation: 'Row 4: 1, 0, _, _. Needs one more 0 and one more 1. Col 3 has 1,0,1 → next must be 0. Col 4 has 0,1,0 → next must be 1. Puzzle complete!',
            }
        ]
    });

    // ========================================
    // WALKTHROUGH 2: 6×6 Puzzle
    // ========================================
    // Puzzle:
    //   _  0  _  _  _  _
    //   _  _  _  1  _  0
    //   _  _  0  _  _  _
    //   _  _  _  _  _  0
    //   _  1  0  _  _  _
    //   1  _  0  _  1  _
    // Solution:
    //   0  0  1  1  0  1
    //   1  0  1  1  0  0
    //   0  1  0  0  1  1
    //   1  0  1  0  1  0
    //   0  1  0  1  0  1
    //   1  1  0  0  1  0
    const w2Initial = [
        [null, 0,    null, null, null, null],
        [null, null, null, 1,    null, 0   ],
        [null, null, 0,    null, null, null],
        [null, null, null, null, null, 0   ],
        [null, 1,    0,    null, null, null],
        [1,    null, 0,    null, 1,    null]
    ];

    createWalkthrough({
        gridId: 'walkthrough2Grid',
        prevId: 'w2Prev', nextId: 'w2Next',
        stepNumId: 'w2StepNum', stepTotalId: 'w2StepTotal',
        explanationId: 'w2Explanation',
        initialGrid: w2Initial,
        cellSize: 48,
        steps: [
            {
                placements: [{ r: 0, c: 0, v: 0 }],
                explanation: 'Column 1 has a 1 at row 5. Row 1 has a 0 at col 2. Looking at col 1: it needs three 0s and three 1s. Placing 0 here starts building the balance.',
                highlight: [[0, 1]]
            },
            {
                placements: [{ r: 0, c: 2, v: 1 }, { r: 0, c: 3, v: 1 }],
                explanation: 'Row 1: 0,0,_,_,_,_. After two 0s (cols 1-2), col 3 must cap → 1. Then col 4: we can place another 1 (two 1s adjacent is fine, just not three).',
                highlight: [[0, 0], [0, 1]]
            },
            {
                placements: [{ r: 0, c: 4, v: 0 }, { r: 0, c: 5, v: 1 }],
                explanation: 'Row 1: 0,0,1,1,_,_. After two 1s (cols 3-4), col 5 must cap → 0. Count: three 0s, two 1s → col 6 = 1. Row 1 complete: 0,0,1,1,0,1.',
                highlight: [[0, 2], [0, 3]]
            },
            {
                placements: [{ r: 1, c: 0, v: 1 }, { r: 1, c: 1, v: 0 }],
                explanation: 'Column 1: 0,_,... Row 2 starts with _,_,_,1. Col 1 has 0 at row 1 — placing 1 avoids 0,0,0 vertically. Col 2: has 0 (row 1), placing 0 here gives 0,0 which is valid (capped next).',
            },
            {
                placements: [{ r: 1, c: 2, v: 1 }],
                explanation: 'Row 2: 1,0,_,1,_,0. After col 2 = 0, we can\'t have three 0s (col 2 only has two). Col 3 cross-ref: col 3 has 1 (row 1), can take 0 or 1. But row 2 has 0,_,1 — placing 1 at col 3 gives 0,1,1 (valid pair). Count needs balance.',
                highlight: [[1, 1]]
            },
            {
                placements: [{ r: 1, c: 4, v: 0 }],
                explanation: 'Row 2: 1,0,1,1,_,0. Count: three 1s already → remaining cell must be 0. Row 2 complete: 1,0,1,1,0,0.',
            },
            {
                placements: [{ r: 2, c: 0, v: 0 }, { r: 2, c: 1, v: 1 }],
                explanation: 'Column 1: 0,1,_,... Can place 0 (no three in a row since prior was 0,1). Column 2: 0,0,_,... After two 0s, must cap with 1!',
                highlight: [[0, 1], [1, 1]]
            },
            {
                placements: [{ r: 2, c: 3, v: 0 }, { r: 2, c: 4, v: 1 }, { r: 2, c: 5, v: 1 }],
                explanation: 'Row 3: 0,1,0,_,_,_. Count: two 0s, one 1. Need one more 0 and two more 1s. Col 4 has 1,1 (rows 1-2), so col 4 can\'t be 1 (would make three). Col 4 = 0. Then cols 5,6 must be 1,1. Check: row ends ...0,1,1 — pair at end is valid. Row 3: 0,1,0,0,1,1.',
                highlight: [[0, 3], [1, 3]]
            },
            {
                placements: [{ r: 3, c: 0, v: 1 }, { r: 3, c: 1, v: 0 }],
                explanation: 'Column 1: 0,1,0,_,_,1. Pattern is alternating. After 0 at row 3, placing 1 at row 4 avoids 0,0,0 and maintains balance. Col 2: 0,0,1,_,1,_ — after 1 at row 3, placing 0 at row 4 is needed (col 2 already has two 0s and one 1, can take one more 0).',
            },
            {
                placements: [{ r: 3, c: 2, v: 1 }, { r: 3, c: 3, v: 0 }],
                explanation: 'Row 4: 1,0,_,_,_,0. Col 3 has 1,1,0 (rows 1-3) — two 1s, one 0. Can take more of either. Row 4 needs balance: after 1,0 placing 1 at col 3 (no three in a row with 0,1). Col 4 = 0 (cap after 1, and three 0s in row reached? No: 1,0,1,0 = two 0s, two 1s. Need one more of each. Col 5: col 5 has 0,0,1 → two 0s, can only add 1. Col 6 = 0 (given). That makes row: 1,0,1,0,1,0 ✓.',
            },
            {
                placements: [{ r: 3, c: 4, v: 1 }],
                explanation: 'Row 4: 1,0,1,0,_,0. Three 0s already → remaining cell is 1. Row 4 complete: 1,0,1,0,1,0.',
            },
            {
                placements: [{ r: 4, c: 0, v: 0 }, { r: 4, c: 3, v: 1 }],
                explanation: 'Column 1: 0,1,0,1,_,1. Three 1s already → must be 0. Row 5: 0,1,0,_,_,_. Col 4 has 1,1,0,0 — two each, either works. Row count: one 0 and one 1 placed. Placing 1 at col 4 is valid.',
            },
            {
                placements: [{ r: 4, c: 4, v: 0 }, { r: 4, c: 5, v: 1 }],
                explanation: 'Row 5: 0,1,0,1,_,_. Count: two 0s, two 1s. Need one more of each. Col 5: has 0,0,1,1 — balanced, either works. But row 5: after 0,1,0,1 — col 5 = 0 (if 1, then 1,1 and col 6 must be 0, giving row 0,1,0,1,1,0; check uniqueness). Col 5 = 0, col 6 = 1. Row 5: 0,1,0,1,0,1.',
            },
            {
                placements: [{ r: 5, c: 1, v: 1 }, { r: 5, c: 3, v: 0 }, { r: 5, c: 5, v: 0 }],
                explanation: 'Row 6: 1,_,0,_,1,_. Col 2: 0,0,1,0,1,_ — three 0s, two 1s → needs 1. Col 4: 1,1,0,0,1,_ — three 1s already → needs 0. Col 6: 1,0,1,0,1,_ — three 1s, two 0s → needs 0. Row 6: 1,1,0,0,1,0. Puzzle solved!',
            },
        ]
    });

    // ========================================
    // WALKTHROUGH 3: 8×8 Puzzle
    // ========================================
    const w3Initial = [
        [null, null, 1,    null, null, 0,    null, null],
        [1,    null, null, null, 0,    null, null, 1   ],
        [null, null, null, 1,    null, null, 0,    null],
        [null, 1,    null, null, null, 1,    null, 0   ],
        [0,    null, null, 1,    null, null, null, null],
        [null, null, 1,    null, null, 0,    1,    null],
        [null, 1,    null, null, 1,    null, null, 0   ],
        [1,    null, null, 0,    null, null, null, null]
    ];

    // Solution:
    // 0 1 1 0 1 0 1 0
    // 1 0 0 1 0 1 0 1
    // 1 0 0 1 1 0 0 1
    // 0 1 1 0 0 1 1 0
    // 0 1 0 1 0 1 0 1
    // 1 0 1 0 1 0 1 0
    // 0 1 0 1 1 0 1 0
    // 1 0 1 0 0 1 0 1

    createWalkthrough({
        gridId: 'walkthrough3Grid',
        prevId: 'w3Prev', nextId: 'w3Next',
        stepNumId: 'w3StepNum', stepTotalId: 'w3StepTotal',
        explanationId: 'w3Explanation',
        initialGrid: w3Initial,
        cellSize: 44,
        steps: [
            {
                placements: [{ r: 0, c: 0, v: 0 }, { r: 0, c: 1, v: 1 }],
                explanation: 'Row 1 has a 1 at col 3 and 0 at col 6. Column 2: has no values yet but col 1 has 1 (row 2) and 0 (row 5). Cross-referencing column counts with row needs gives us 0 at col 1 and 1 at col 2.',
            },
            {
                placements: [{ r: 0, c: 3, v: 0 }],
                explanation: 'Row 1: 0,1,1,_,_,0,_,_. After two 1s at cols 2-3, col 4 must cap the pair → 0.',
                highlight: [[0, 1], [0, 2]]
            },
            {
                placements: [{ r: 0, c: 4, v: 1 }, { r: 0, c: 6, v: 1 }, { r: 0, c: 7, v: 0 }],
                explanation: 'Row 1: 0,1,1,0,_,0,_,_. Count: two 1s, two 0s placed. Need two more 1s and two more 0s. After 0 at col 4 would make 0,0 (cols 4,6) — possible, but col 5 is already 0, so col 5,6 would be 0,0. Place 1 at col 5. Then cols 7,8: need one 1 and one 0. Col 7 = 1, col 8 = 0 (placing 0 at col 7 would create 0,0,0 with cols 6,8).',
            },
            {
                placements: [{ r: 1, c: 1, v: 0 }, { r: 1, c: 2, v: 0 }],
                explanation: 'Row 2: 1,_,_,_,0,_,_,1. Column 2: 1,_ — can be 0 or 1. Column 3: 1,_ — can be 0 or 1. Row 2 after 1: placing 0,0 gives 1,0,0 which is valid (capped by the 1). Cross-referencing column counts confirms.',
                highlight: [[1, 0]]
            },
            {
                placements: [{ r: 1, c: 3, v: 1 }],
                explanation: 'Row 2: 1,0,0,_,0,_,_,1. After two 0s (cols 2-3), col 4 must cap → 1.',
                highlight: [[1, 1], [1, 2]]
            },
            {
                placements: [{ r: 1, c: 5, v: 1 }, { r: 1, c: 6, v: 0 }],
                explanation: 'Row 2: 1,0,0,1,0,_,_,1. Count: three 1s, three 0s placed. Need one more 1 and one more 0. Col 6: if 1, then cols 4,6,8 = 0,1,1 — two 1s adjacent at end is ok. But col 7: if also 1, three 1s (cols 6,7,8). So col 6 = 1, col 7 = 0. Row complete: 1,0,0,1,0,1,0,1.',
            },
            {
                placements: [{ r: 2, c: 0, v: 1 }, { r: 2, c: 1, v: 0 }],
                explanation: 'Column 1: 0,1,_ — can be 0 or 1. Column 2: 1,0,_ — can be 0 or 1. Cross-referencing: col 1 has one 0, one 1 so far. Row 3 starts _,_,_,1. Checking col 1 count and row 3 neighbors → col 1 = 1, col 2 = 0.',
            },
            {
                placements: [{ r: 2, c: 2, v: 0 }, { r: 2, c: 4, v: 1 }],
                explanation: 'Row 3: 1,0,_,1,_,_,0,_. Col 3 at row 3: after 1,0 we can place 0 (two 0s, not three). Col 5: row needs balance, col 5 has 1,0 → placing 1 is valid.',
            },
            {
                placements: [{ r: 2, c: 5, v: 0 }, { r: 2, c: 7, v: 1 }],
                explanation: 'Row 3: 1,0,0,1,1,_,0,_. Count: three 1s, three 0s. After two 1s (cols 4-5), col 6 must cap → 0 (already given). Col 8: need one more 1 → must be 1. Row complete: 1,0,0,1,1,0,0,1.',
                highlight: [[2, 3], [2, 4]]
            },
            {
                placements: [{ r: 3, c: 0, v: 0 }, { r: 3, c: 2, v: 1 }, { r: 3, c: 3, v: 0 }],
                explanation: 'Row 4: _,1,_,_,_,1,_,0. Col 1 has 0,1,1 — two 1s already at rows 1-3 but needs balance. Col 1 row 4 = 0. Then row 4: 0,1,_,_. Col 3: 1,0,0 — two 0s, so can be 0 or 1. Place 1 at col 3 (pair cap after 1). Col 4 = 0 (cap after 1,1 at cols 2-3).',
                highlight: [[3, 1], [3, 5]]
            },
            {
                placements: [{ r: 3, c: 4, v: 0 }, { r: 3, c: 6, v: 1 }],
                explanation: 'Row 4: 0,1,1,0,_,1,_,0. Count: two 1s placed beyond givens. Need two more 0s and two more 1s total → wait, recount: 0,1,1,0 = two 1s, two 0s, plus given 1 at col 6 and 0 at col 8 = three 1s, three 0s. Need one more 1 and one more 0. Col 5 = 0 (after 1 at col 6, prevents 1,1). Col 7 = 1. Row: 0,1,1,0,0,1,1,0.',
            },
            {
                placements: [
                    { r: 4, c: 1, v: 1 }, { r: 4, c: 2, v: 0 },
                    { r: 4, c: 4, v: 0 }, { r: 4, c: 5, v: 1 },
                    { r: 4, c: 6, v: 0 }, { r: 4, c: 7, v: 1 }
                ],
                explanation: 'Row 5: 0,_,_,1,_,_,_,_. Using cross-referencing: col 2 has 1,0,0,1 (rows 1-4) — two each, next must avoid three in a row. Col-by-col analysis with row counting resolves to: 0,1,0,1,0,1,0,1.',
            },
            {
                placements: [
                    { r: 5, c: 0, v: 1 }, { r: 5, c: 1, v: 0 },
                    { r: 5, c: 3, v: 0 }, { r: 5, c: 4, v: 1 }, { r: 5, c: 7, v: 0 }
                ],
                explanation: 'Row 6: _,_,1,_,_,0,1,_. Column counts are getting tight — most columns have 3-4 values placed. Cross-referencing each column\'s remaining needs with the row\'s balance requirement resolves to: 1,0,1,0,1,0,1,0.',
            },
            {
                placements: [
                    { r: 6, c: 0, v: 0 }, { r: 6, c: 2, v: 0 },
                    { r: 6, c: 3, v: 1 }, { r: 6, c: 5, v: 0 }, { r: 6, c: 6, v: 1 }
                ],
                explanation: 'Row 7: _,1,_,_,1,_,_,0. Uniqueness check — this row can\'t duplicate any previous row. Combined with column counts (each column nearing its quota), the row resolves to: 0,1,0,1,1,0,1,0.',
            },
            {
                placements: [
                    { r: 7, c: 1, v: 0 }, { r: 7, c: 2, v: 1 },
                    { r: 7, c: 4, v: 0 }, { r: 7, c: 5, v: 1 },
                    { r: 7, c: 6, v: 0 }, { r: 7, c: 7, v: 1 }
                ],
                explanation: 'Row 8 (final): 1,_,_,0,_,_,_,_. Every column now needs exactly one more value to reach its quota of four 0s and four 1s. Each remaining cell is fully determined. Row 8: 1,0,1,0,0,1,0,1. Puzzle solved!',
            },
        ]
    });

    // ========================================
    // PRACTICE PUZZLES
    // ========================================

    // Pre-made puzzles for each size
    const puzzles = {
        4: {
            given: [
                [null, 1,    null, null],
                [null, null, 0,    null],
                [null, null, null, 1   ],
                [1,    null, null, null]
            ],
            solution: [
                [0, 1, 1, 0],
                [1, 0, 0, 1],
                [0, 1, 0, 1],
                [1, 0, 1, 0]
            ]
        },
        6: {
            given: [
                [null, 0,    null, null, null, null],
                [null, null, null, 1,    null, 0   ],
                [null, null, 0,    null, null, null],
                [null, null, null, null, null, 0   ],
                [null, 1,    0,    null, null, null],
                [1,    null, 0,    null, 1,    null]
            ],
            solution: [
                [0, 0, 1, 1, 0, 1],
                [1, 0, 1, 1, 0, 0],
                [0, 1, 0, 0, 1, 1],
                [1, 0, 1, 0, 1, 0],
                [0, 1, 0, 1, 0, 1],
                [1, 1, 0, 0, 1, 0]
            ]
        },
        8: {
            given: [
                [null, null, 1,    null, null, 0,    null, null],
                [1,    null, null, null, 0,    null, null, 1   ],
                [null, null, null, 1,    null, null, 0,    null],
                [null, 1,    null, null, null, 1,    null, 0   ],
                [0,    null, null, 1,    null, null, null, null],
                [null, null, 1,    null, null, 0,    1,    null],
                [null, 1,    null, null, 1,    null, null, 0   ],
                [1,    null, null, 0,    null, null, null, null]
            ],
            solution: [
                [0, 1, 1, 0, 1, 0, 1, 0],
                [1, 0, 0, 1, 0, 1, 0, 1],
                [1, 0, 0, 1, 1, 0, 0, 1],
                [0, 1, 1, 0, 0, 1, 1, 0],
                [0, 1, 0, 1, 0, 1, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 0],
                [0, 1, 0, 1, 1, 0, 1, 0],
                [1, 0, 1, 0, 0, 1, 0, 1]
            ]
        },
        10: {
            given: [
                [null, null, null, 1,    null, null, 0,    null, null, null],
                [null, 1,    null, null, null, 0,    null, null, 1,    null],
                [0,    null, null, null, 1,    null, null, 0,    null, null],
                [null, null, 1,    null, null, null, 1,    null, null, 0   ],
                [null, 0,    null, null, null, 1,    null, null, 0,    null],
                [1,    null, null, 0,    null, null, null, 1,    null, null],
                [null, null, 0,    null, null, null, 0,    null, null, 1   ],
                [null, 1,    null, null, 0,    null, null, null, 1,    null],
                [null, null, null, 1,    null, null, 1,    null, null, null],
                [0,    null, null, null, null, 1,    null, null, null, 0   ]
            ],
            solution: [
                [0, 0, 1, 1, 0, 1, 0, 1, 0, 1],
                [1, 1, 0, 0, 1, 0, 1, 0, 1, 0],
                [0, 1, 0, 0, 1, 1, 0, 0, 1, 1],
                [1, 0, 1, 1, 0, 0, 1, 1, 0, 0],
                [0, 0, 1, 1, 0, 1, 1, 0, 0, 1],
                [1, 1, 0, 0, 1, 0, 0, 1, 1, 0],
                [1, 0, 0, 1, 1, 0, 0, 1, 0, 1],
                [0, 1, 1, 0, 0, 1, 1, 0, 1, 0],
                [1, 0, 0, 1, 0, 0, 1, 0, 1, 1],
                [0, 1, 1, 0, 1, 1, 0, 1, 0, 0]
            ]
        },
        12: {
            given: (() => {
                const g = Array.from({length:12}, () => Array(12).fill(null));
                const hints = [
                    [0,3,0],[0,8,1],[0,9,1],[0,10,0],
                    [1,0,1],[1,4,1],[1,9,0],[1,11,0],
                    [2,4,1],[2,5,0],[2,6,0],[2,11,0],
                    [3,2,1],[3,5,0],[3,6,1],[3,10,0],
                    [4,1,0],[4,5,1],[4,10,0],
                    [5,6,0],[5,7,1],[5,9,0],
                    [6,2,0],[6,4,1],[6,8,0],[6,11,1],
                    [7,6,1],[7,8,1],[7,9,1],
                    [8,2,1],[8,7,1],[8,10,0],
                    [9,2,0],[9,3,1],[9,5,0],
                    [10,2,1],[10,7,1],[10,8,0],[10,9,1],
                    [11,0,1],[11,6,1],[11,8,1]
                ];
                hints.forEach(([r,c,v]) => g[r][c] = v);
                return g;
            })(),
            solution: (() => {
                return [
                    [0,0,1,0,0,1,1,0,1,1,0,1],
                    [1,1,0,0,1,1,0,1,0,0,1,0],
                    [1,1,0,1,1,0,0,1,0,0,1,0],
                    [0,0,1,1,0,0,1,0,1,1,0,1],
                    [1,0,1,0,0,1,1,0,0,1,0,1],
                    [1,1,0,0,1,0,0,1,1,0,1,0],
                    [0,1,0,1,1,0,0,1,0,0,1,1],
                    [0,0,1,1,0,1,1,0,1,1,0,0],
                    [1,0,1,0,1,0,0,1,1,0,0,1],
                    [0,1,0,1,1,0,1,0,0,1,1,0],
                    [0,1,1,0,0,1,0,1,0,1,0,1],
                    [1,0,0,1,0,1,1,0,1,0,1,0]
                ];
            })()
        },
        14: {
            given: (() => {
                const g = Array.from({length:14}, () => Array(14).fill(null));
                const hints = [
                    [0,1,1],[0,5,0],[0,9,1],[0,12,0],
                    [1,0,0],[1,3,1],[1,7,0],[1,11,1],[1,13,0],
                    [2,2,1],[2,6,0],[2,10,1],
                    [3,1,0],[3,4,1],[3,8,0],[3,12,1],
                    [4,0,1],[4,3,0],[4,7,1],[4,11,0],[4,13,1],
                    [5,2,0],[5,5,1],[5,9,0],[5,13,0],
                    [6,1,1],[6,4,0],[6,8,1],[6,12,0],
                    [7,0,0],[7,3,1],[7,6,0],[7,10,1],[7,13,1],
                    [8,2,1],[8,5,0],[8,9,1],[8,11,0],
                    [9,1,0],[9,4,1],[9,7,0],[9,12,1],
                    [10,0,1],[10,3,0],[10,8,0],[10,11,1],[10,13,0],
                    [11,2,0],[11,6,1],[11,10,0],
                    [12,1,1],[12,5,1],[12,9,0],[12,13,1],
                    [13,0,0],[13,3,1],[13,7,0],[13,11,0],[13,12,1]
                ];
                hints.forEach(([r,c,v]) => g[r][c] = v);
                return g;
            })(),
            solution: (() => {
                return [
                    [1,1,0,0,1,0,0,1,0,1,0,1,0,1],
                    [0,1,0,1,0,0,1,0,1,1,0,1,1,0],
                    [1,0,1,1,0,1,0,0,1,0,1,0,0,1],
                    [0,0,1,0,1,0,1,1,0,1,0,1,1,0],
                    [1,1,0,0,1,0,0,1,0,1,1,0,0,1],
                    [1,0,0,1,0,1,1,0,1,0,1,0,1,0],
                    [0,1,1,0,0,1,1,0,1,1,0,1,0,0],
                    [0,1,0,1,1,0,0,1,0,0,1,1,0,1],
                    [1,0,1,1,0,0,1,1,0,1,0,0,1,0],
                    [0,0,1,0,1,1,0,0,1,0,1,0,1,1],
                    [1,1,0,0,1,1,0,1,0,0,1,1,0,0],
                    [1,0,0,1,0,0,1,1,0,1,0,0,1,1],
                    [0,1,1,0,1,1,0,0,1,0,0,1,0,1],
                    [0,0,1,1,0,1,1,0,1,0,1,0,1,0]
                ];
            })()
        }
    };

    // State
    let currentSize = 4;
    let currentPuzzle = null;
    let playerGrid = null;

    function getCellSize(size) {
        const maxWidth = Math.min(window.innerWidth - 80, 600);
        return Math.floor(maxWidth / size) - 4;
    }

    function loadPuzzle(size) {
        currentSize = size;
        currentPuzzle = puzzles[size];
        playerGrid = cloneGrid(currentPuzzle.given);

        const cellSize = getCellSize(size);
        const container = document.getElementById('practiceGrid');
        document.getElementById('practiceSize').textContent = `${size}×${size}`;
        document.getElementById('practiceStatus').textContent = 'Click cells to cycle: empty → 0 → 1';
        hideFeedback();

        renderGrid(container, playerGrid, cellSize, {
            given: currentPuzzle.given,
            onClick: (r, c, cell) => {
                if (currentPuzzle.given[r][c] !== null) return;
                // Cycle: null → 0 → 1 → null
                if (playerGrid[r][c] === null) playerGrid[r][c] = 0;
                else if (playerGrid[r][c] === 0) playerGrid[r][c] = 1;
                else playerGrid[r][c] = null;
                refreshPractice();
            }
        });
    }

    function refreshPractice() {
        const cellSize = getCellSize(currentSize);
        const container = document.getElementById('practiceGrid');
        renderGrid(container, playerGrid, cellSize, {
            given: currentPuzzle.given,
            onClick: (r, c) => {
                if (currentPuzzle.given[r][c] !== null) return;
                if (playerGrid[r][c] === null) playerGrid[r][c] = 0;
                else if (playerGrid[r][c] === 0) playerGrid[r][c] = 1;
                else playerGrid[r][c] = null;
                refreshPractice();
            }
        });
    }

    function showFeedback(msg, type) {
        const fb = document.getElementById('practiceFeedback');
        fb.textContent = msg;
        fb.className = 'practice-feedback show ' + type;
    }

    function hideFeedback() {
        const fb = document.getElementById('practiceFeedback');
        fb.className = 'practice-feedback';
    }

    // Size selector
    document.querySelectorAll('.practice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.practice-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadPuzzle(parseInt(btn.dataset.size));
        });
    });

    // Check solution
    document.getElementById('checkBtn').addEventListener('click', () => {
        if (!currentPuzzle) return;
        const sol = currentPuzzle.solution;
        let correct = true;
        let incomplete = false;

        for (let r = 0; r < currentSize; r++) {
            for (let c = 0; c < currentSize; c++) {
                if (playerGrid[r][c] === null) {
                    incomplete = true;
                    correct = false;
                } else if (playerGrid[r][c] !== sol[r][c]) {
                    correct = false;
                }
            }
        }

        if (correct) {
            showFeedback('Congratulations! Puzzle solved correctly!', 'success');
        } else if (incomplete) {
            showFeedback('Not done yet — some cells are still empty.', 'error');
        } else {
            showFeedback('Some values are incorrect. Keep trying!', 'error');
        }
    });

    // Hint
    document.getElementById('hintBtn').addEventListener('click', () => {
        if (!currentPuzzle) return;
        const sol = currentPuzzle.solution;
        const emptyCells = [];
        for (let r = 0; r < currentSize; r++) {
            for (let c = 0; c < currentSize; c++) {
                if (playerGrid[r][c] === null || playerGrid[r][c] !== sol[r][c]) {
                    emptyCells.push([r, c]);
                }
            }
        }
        if (emptyCells.length === 0) {
            showFeedback('Puzzle is already complete!', 'success');
            return;
        }
        const [hr, hc] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        playerGrid[hr][hc] = sol[hr][hc];
        refreshPractice();
        showFeedback(`Hint: placed ${sol[hr][hc]} at row ${hr+1}, column ${hc+1}.`, 'hint');
    });

    // Reset
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (!currentPuzzle) return;
        playerGrid = cloneGrid(currentPuzzle.given);
        refreshPractice();
        hideFeedback();
    });

    // New puzzle (just reloads the same — for demo purposes)
    document.getElementById('newPuzzleBtn').addEventListener('click', () => {
        loadPuzzle(currentSize);
    });

    // Re-render practice grid on resize for responsive cell sizing
    window.addEventListener('resize', () => {
        if (currentPuzzle) {
            refreshPractice();
        }
    });

    // Initial load
    loadPuzzle(4);

});
