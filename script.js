document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const selectedNumbersContainer = document.getElementById('selected-numbers');
    const totalSumElement = document.getElementById('total-sum');
    let selectedCells = new Set();
    let lastSelectedCell = null;

    // Create 4x4 grid with numbers 1-16
    for (let i = 1; i <= 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-item';
        cell.textContent = i;
        cell.dataset.row = Math.ceil(i / 4);
        cell.dataset.col = ((i - 1) % 4) + 1;
        cell.dataset.value = i;
        
        cell.addEventListener('click', () => handleCellClick(cell));
        grid.appendChild(cell);
    }

    function updateDisabledCells() {
        // Reset all cells
        document.querySelectorAll('.grid-item').forEach(cell => {
            cell.classList.remove('disabled', 'highlighted');
        });

        // If there's a last selected cell, highlight its row and column
        if (lastSelectedCell) {
            const row = lastSelectedCell.dataset.row;
            const col = lastSelectedCell.dataset.col;

            document.querySelectorAll('.grid-item').forEach(cell => {
                if (cell !== lastSelectedCell && 
                    (cell.dataset.row === row || cell.dataset.col === col)) {
                    cell.classList.add('highlighted');
                }
            });
        }

        // Disable cells in same row or column as any selected cell
        selectedCells.forEach(selectedCell => {
            const row = selectedCell.dataset.row;
            const col = selectedCell.dataset.col;

            document.querySelectorAll('.grid-item').forEach(cell => {
                if (!selectedCells.has(cell) && 
                    (cell.dataset.row === row || cell.dataset.col === col)) {
                    cell.classList.add('disabled');
                }
            });
        });
    }

    function updateSelectedNumbersDisplay() {
        selectedNumbersContainer.innerHTML = '';
        let sum = 0;

        selectedCells.forEach(cell => {
            const value = parseInt(cell.dataset.value);
            sum += value;

            const numberElement = document.createElement('div');
            numberElement.className = 'selected-number';
            numberElement.innerHTML = `
                ${value}
                <button onclick="removeSelectedNumber(${value})">&times;</button>
            `;
            selectedNumbersContainer.appendChild(numberElement);
        });

        totalSumElement.textContent = sum;
    }

    function handleCellClick(clickedCell) {
        // If cell is disabled, do nothing
        if (clickedCell.classList.contains('disabled')) {
            return;
        }

        // If cell is already selected, deselect it
        if (selectedCells.has(clickedCell)) {
            selectedCells.delete(clickedCell);
            clickedCell.classList.remove('selected');
            
            // Update last selected cell
            if (lastSelectedCell === clickedCell) {
                lastSelectedCell = selectedCells.size > 0 ? 
                    Array.from(selectedCells).pop() : null;
            }
        } else {
            // Add new selection
            selectedCells.add(clickedCell);
            clickedCell.classList.add('selected');
            lastSelectedCell = clickedCell;
        }

        updateDisabledCells();
        updateSelectedNumbersDisplay();
    }

    // Make removeSelectedNumber function available globally
    window.removeSelectedNumber = function(value) {
        const cellToRemove = Array.from(selectedCells).find(
            cell => parseInt(cell.dataset.value) === value
        );
        if (cellToRemove) {
            handleCellClick(cellToRemove);
        }
    };
}); 