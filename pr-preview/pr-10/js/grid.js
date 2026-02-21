/* ================================================
   GRID — Shared rendering utilities
   ================================================ */

export function cloneGrid(grid) {
    return grid.map(row => [...row]);
}

export function renderGrid(container, grid, cellSize, options = {}) {
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
