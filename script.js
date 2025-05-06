document.addEventListener('DOMContentLoaded', () => {
    const cells = Array.from(document.getElementsByClassName('grid-cell'));
    const scoreDisplay = document.getElementById('score');
    const restartBtn = document.getElementById('restart-btn');
    let grid = [];
    let score = 0;

    function startGame() {
        grid = Array(16).fill(0);
        score = 0;
        scoreDisplay.textContent = score;
        spawnTile();
        spawnTile();
        updateUI();
    }

    function spawnTile() {
        const emptyIndices = grid.map((v, i) => v === 0 ? i : null).filter(i => i !== null);
        if (emptyIndices.length === 0) return;
        const randIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        grid[randIndex] = Math.random() < 0.9 ? 2 : 4;
    }


    function updateUI() {
        grid.forEach((value, i) => {
            const cell = cells[i];
            cell.textContent = value === 0 ? '' : value;
            cell.className = 'grid-cell';
            if (value) {
            cell.classList.add('tile', `tile-${value}`);
            }
        });
        scoreDisplay.textContent = score;
    }

    function operate(row) {
        row = row.filter(v => v !== 0);
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row.splice(i + 1, 1);
            }
        }
        while (row.length < 4) row.push(0);
        return row;
    }

    function moveLeft() {
        let moved = false;
        for (let r = 0; r < 4; r++) {
            const row = grid.slice(r*4, r*4 + 4);
            const newRow = operate(row);
            for (let c = 0; c < 4; c++) {
                if (grid[r*4 + c] !== newRow[c]) moved = true;
                grid[r*4 + c] = newRow[c];
            }
        }
        return moved;
    }

    function moveRight() {
        grid.reverse();
        const moved = moveLeft();
        grid.reverse();
        return moved;
    }

    function moveUp() {
        grid = rotateLeft(grid);
        const moved = moveLeft();
        grid = rotateRight(grid);
        return moved;
    }

    function moveDown() {
        grid = rotateLeft(grid);
        const moved = moveRight();
        grid = rotateRight(grid);
        return moved;
    }

    function rotateLeft(arr) {
        const newArr = [];
        for (let c = 3; c >= 0; c--) {
            for (let r = 0; r < 4; r++) {
                newArr.push(arr[r*4 + c]);
            }
        }
        return newArr;
    }
    function rotateRight(arr) {
        const newArr = [];
        for (let c = 0; c < 4; c++) {
            for (let r = 3; r >= 0; r--) {
                newArr.push(arr[r*4 + c]);
            }
        }
        return newArr;
    }

    function isGameOver() {
        if (grid.includes(0)) return false;
        for (let i = 0; i < 16; i++) {
            const x = i % 4;
            const y = Math.floor(i / 4);
            const v = grid[i];
            if (x < 3 && grid[i+1] === v) return false;
            if (y < 3 && grid[i+4] === v) return false;
        }
        return true;
    }

    document.addEventListener('keydown', e => {
        let moved = false;
        switch(e.key) {
            case 'ArrowLeft':  moved = moveLeft();  break;
            case 'ArrowRight': moved = moveRight(); break;
            case 'ArrowUp':    moved = moveUp();    break;
            case 'ArrowDown':  moved = moveDown();  break;
        }
        if (moved) {
            spawnTile();
            updateUI();
            if (isGameOver()) {
                setTimeout(() => {
                    //alert('게임 오버! 점수: ' + score), 
                    Swal.fire({
                        title: '게임 오버!',
                        text: `점수: ${score}`,
                        icon: 'info',
                        confirmButtonText: '다시 시작'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            startGame();
                        }
                    });
                },  100);
            }
        }
    });

    restartBtn.addEventListener('click', startGame);

    startGame();
});
