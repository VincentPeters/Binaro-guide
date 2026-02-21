/* ================================================
   PRACTICE — Interactive puzzles + puzzle data
   ================================================ */

import { renderGrid, cloneGrid } from './grid.js';

// ========================================
// PUZZLE DATA
// ========================================

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
        solution: [
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
        ]
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
        solution: [
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
        ]
    }
};

// ========================================
// PRACTICE ENGINE
// ========================================

let currentSize = 4;
let currentPuzzle = null;
let playerGrid = null;

function getCellSize(size) {
    const maxWidth = Math.min(window.innerWidth - 80, 600);
    return Math.floor(maxWidth / size) - 4;
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
            if (playerGrid[r][c] === null) playerGrid[r][c] = 0;
            else if (playerGrid[r][c] === 0) playerGrid[r][c] = 1;
            else playerGrid[r][c] = null;
            refreshPractice();
        }
    });
}

export function initPractice() {
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

    // New puzzle
    document.getElementById('newPuzzleBtn').addEventListener('click', () => {
        loadPuzzle(currentSize);
    });

    // Responsive resize
    window.addEventListener('resize', () => {
        if (currentPuzzle) refreshPractice();
    });

    // Initial load
    loadPuzzle(4);
}
