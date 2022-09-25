// board contains the true states of each position on the grid (numbers, mines)
// frame represents the grid that the user sees and interacts with (revealed numbers, hidden spaces, flags)

// Global variables
var gameEnded = false;
var size = 9; // length of board
var numMines = 10;
numFlags = 0;
var board = []; // 2D array of integers -1 to 8, with -1 being a mine
var frame = []; // 2D array of integers, -2=flag, -1=hidden, 0-8=number of mines in proximity
var frameContainer = document.getElementById('frameContainer');
var flagCount = document.getElementById('flagCount');

document.addEventListener('DOMContentLoaded', function() {
    resetGame();
});

// Resets board, places mines and numbers. Guarantees that the cell at (clickR, clickC) is a 0 number cell
function createBoard(clickR, clickC) {
    // clear board
    board = [];

    // fill board with zeros
    for (let r = 0; r < size; r++) {
        let row = new Array(size).fill(0);
        board.push(row);
    }

    // returns a random integer, lower bound inclusive, upper bound exclusive
    function randInt(lower, upper) {
        return parseInt(Math.random() * (upper - lower) + lower, 10)
    }

    // increments a number on board, if it is on a valid index and not a mine
    function incrementBoardNum(r, c) {
        if (r >= 0 && c >= 0 && r < size && c < size && board[r][c] > -1) {
            board[r][c]++;
        }
    }

    // randomly add mines
    let minesMade = 0;
    let r = 0;
    let c = 0;
    while (minesMade < numMines) {
        r = randInt(0, size);
        c = randInt(0, size);
        if (board[r][c] != -1
                && !(r >= clickR - 1 && r <= clickR + 1
                    && c >= clickC - 1 && c <= clickC + 1)) { // if space is valid for a new mine
            incrementBoardNum(r - 1, c - 1);
            incrementBoardNum(r - 1, c);
            incrementBoardNum(r - 1, c + 1);
            incrementBoardNum(r, c - 1);
            board[r][c] = -1; // set mine
            incrementBoardNum(r, c + 1);
            incrementBoardNum(r + 1, c - 1);
            incrementBoardNum(r + 1, c);
            incrementBoardNum(r + 1, c + 1);
            minesMade++;
        }
    }
}

// Resets frame
function createFrame() {
    // clear frame
    frame = [];

    // fill board with 'h' (hidden)
    for (let r = 0; r < size; r++) {
        let row = new Array(size).fill(-1);
        frame.push(row);
    }
}

// Clears and initializes the visible dispay
function createDisplay() {
    frameContainer.innerHTML = '';
    let cell = null;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            cell = document.createElement('div');
            cell.addEventListener('click', (e) => {
                leftClickCell(r, c);
            });
            cell.addEventListener('contextmenu', (e) => {
                rightClickCell(r, c);
                e.preventDefault() // prevent right click menu from appearing
            });
            frameContainer.appendChild(cell);
        }
    }
}

// Updates the visible frame to match the 'frame' array
// Should be called whenever the 'frame' array is modified
function updateDisplay() {
    let cells = frameContainer.children;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            let i = r * size + c;
            let cell = cells[i];
            if (frame[r][c] == -2) { // flag
                cell.style.backgroundColor = 'Red';
            } else if (frame[r][c] == -1) { // hidden
                cell.style.backgroundColor = 'Green';
            } else { // number 0-8
                cell.style.backgroundColor = 'LightGrey';
                if (frame[r][c] > 0)
                    cell.innerHTML = String(frame[r][c]);
            }
        }
    }

    // update flagCount
    flagCount.innerHTML = 'Flags left: ' + String(numMines - numFlags);
}

// Called when the Reset button is pushed, and at the start of the game
function resetGame() {
    numFlags = 0;
    gameEnded = false;
    board = [] // board will be generated on first click
    createFrame();
    createDisplay();
    updateDisplay();
}

function loseGame() {
    gameEnded = true;
    alert('Clicked on a mine! End of game');
}

function winGame() {
    gameEnded = true;
    alert('You win!');
}

// Check whether the game is won (all number cells are revealed), trigger winGame if true
function checkGameWin() {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] >= 0 && frame[r][c] != board[r][c]) { // if number cell that is not revealed
                return;
            }
        }
    }
    winGame();
}

// Called when a cell is left-clicked
function leftClickCell(r, c) {
    if (gameEnded || frame[r][c] != -1) { // if game is over or cell is not hidden
        return;
    }
    if (board.length == 0) { // board not generated yet
        createBoard(r, c);
    }
    revealCell(r, c);
    updateDisplay();
    checkGameWin();
}

// Updates frame such that a cell is revealed by the player
function revealCell(r, c) {
    if (board[r][c] == -1) { // cell is a mine
        loseGame();
        return;
    }

    // update cell
    frame[r][c] = board[r][c];

    function revealCellRecursive(r, c) {
        if (r < 0 || c < 0 || r >= size || c >= size
            || board[r][c] == -1 || frame[r][c] != -1) { // if not a valid, hidden number cell
            return;
        }
    
        // update cell
        frame[r][c] = board[r][c];
    
        // recursive, if current cell is zero
        if (board[r][c] == 0) {
            revealCellRecursive(r - 1, c - 1);
            revealCellRecursive(r - 1, c);
            revealCellRecursive(r - 1, c + 1);
            revealCellRecursive(r, c - 1);
            revealCellRecursive(r, c);
            revealCellRecursive(r, c + 1);
            revealCellRecursive(r + 1, c - 1);
            revealCellRecursive(r + 1, c);
            revealCellRecursive(r + 1, c + 1);
        }
    }

    // recursive, if current cell is zero
    if (board[r][c] == 0) {
        revealCellRecursive(r - 1, c - 1);
        revealCellRecursive(r - 1, c);
        revealCellRecursive(r - 1, c + 1);
        revealCellRecursive(r, c - 1);
        revealCellRecursive(r, c);
        revealCellRecursive(r, c + 1);
        revealCellRecursive(r + 1, c - 1);
        revealCellRecursive(r + 1, c);
        revealCellRecursive(r + 1, c + 1);
    }
}

// Called when a cell is right-clicked
function rightClickCell(r, c) {
    if (frame[r][c] == -1) { // if hidden cell
        flagCell(r, c);
    } else if (frame[r][c] == -2) { // if flagged cell
        unflagCell(r, c);
    }
    updateDisplay();
}

function flagCell(r, c) {
    frame[r][c] = -2;
    numFlags++;
}

function unflagCell(r, c) {
    frame[r][c] = -1;
    numFlags--;
}