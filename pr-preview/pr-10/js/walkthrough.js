/* ================================================
   WALKTHROUGH — Engine + puzzle configurations
   ================================================ */

import { renderGrid, cloneGrid } from './grid.js';

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
// WALKTHROUGH DATA
// ========================================

export function initWalkthroughs() {
    // ---------- Walkthrough 1: 4×4 ----------
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

    // ---------- Walkthrough 2: 6×6 ----------
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

    // ---------- Walkthrough 3: 8×8 ----------
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
}
