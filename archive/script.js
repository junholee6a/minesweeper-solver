// board contains the true states of each position on the grid (numbers, mines)
// frame represents the grid that the user sees and interacts with (revealed numbers, hidden spaces, flags)

// Global variables
let gameEnded = false;
let size = 9; // length of board
let numMines = 10;
let numFlags = 0;
let globalBoard = []; // 2D array of integers -1 to 8, with -1 being a mine
let globalFrame = []; // 2D array of integers, -2=flag, -1=hidden, 0-8=number of mines in proximity
let frameContainer = document.getElementById('frameContainer');
let flagCount = document.getElementById('flagCount');
const moves = { // enum of move types that can be made on a frame
    REVEAL: "reveal",
    FLAG: "flag"
}
Object.freeze(moves);

document.addEventListener('DOMContentLoaded', function() {
    resetGame();
});

// Returns a new board, placing mines and numbers. Guarantees that the cell at (clickR, clickC) is a 0 number cell
function createBoard(clickR, clickC) {
    // initialize board
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

    return board
}

// Returns a new frame, all hidden
function createFrame() {
    // initialize frame
    frame = [];

    // fill board with 'h' (hidden)
    for (let r = 0; r < size; r++) {
        let row = new Array(size).fill(-1);
        frame.push(row);
    }
    return frame
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

// Updates the visible frame to match the 'global_frame' array
// Should be called whenever the 'global_frame' array is modified
function updateDisplay() {
    let cells = frameContainer.children;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            let i = r * size + c;
            let cell = cells[i];
            if (globalFrame[r][c] == -2) { // flag
                cell.style.backgroundColor = 'Red';
            } else if (globalFrame[r][c] == -1) { // hidden
                cell.style.backgroundColor = 'Green';
            } else { // number 0-8
                cell.style.backgroundColor = 'LightGrey';
                if (globalFrame[r][c] > 0)
                    cell.innerHTML = String(globalFrame[r][c]);
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
    globalBoard = [] // board will be generated on first click
    globalFrame = createFrame();
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
            if (globalBoard[r][c] >= 0 && globalFrame[r][c] != globalBoard[r][c]) { // if number cell that is not revealed
                return;
            }
        }
    }
    winGame();
}

// Called when a cell is left-clicked (reveals a cell)
function leftClickCell(r, c) {
    if (gameEnded || globalFrame[r][c] != -1) { // if game is over or cell is not hidden
        return;
    }
    if (globalBoard.length == 0) { // board not generated yet
        globalBoard = createBoard(r, c);
    }
    globalFrame = revealCell(globalFrame, r, c);
    updateDisplay();
    checkGameWin();
}

// Returns an updated frame such that a cell is revealed by the player
function revealCell(frame, r, c) {
    if (globalBoard[r][c] == -1) { // cell is a mine
        loseGame();
        return frame;
    }

    // update cell
    frame[r][c] = globalBoard[r][c];

    function revealCellRecursive(r, c) {
        if (r < 0 || c < 0 || r >= size || c >= size
            || globalBoard[r][c] == -1 || frame[r][c] != -1) { // if not a valid, hidden number cell
            return;
        }
    
        // update cell
        frame[r][c] = globalBoard[r][c];
    
        // recursive, if current cell is zero
        if (globalBoard[r][c] == 0) {
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
    if (globalBoard[r][c] == 0) {
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

    return frame
}

// Called when a cell is right-clicked (flags/unflags a cell)
function rightClickCell(r, c) {
    if (globalFrame[r][c] == -1) { // if hidden cell
        globalFrame = flagCell(globalFrame, r, c);
    } else if (globalFrame[r][c] == -2) { // if flagged cell
        globalFrame = unflagCell(globalFrame, r, c);
    }
    updateDisplay();
}

// Returns an updated frame such that a cell is flagged
function flagCell(frame, r, c) {
    frame[r][c] = -2;
    numFlags++;
    return frame
}

//Returns an updated frame such that a cell is unflagged
function unflagCell(frame, r, c) {
    frame[r][c] = -1;
    numFlags--;
    return frame;
}

/* 
 * Takes frame and the position of a revealed number cell as parameters.
 * Returns a list of (r, c) pairs, for the positions of cells surrounding
 * the given number cell that the number cell constrains to be mines. This occurs
 * when the number of hidden cells around a number cell is equal to the number
 * of unrevealed mines around it. Otherwise, the returned list is empty.
 */
function certainFlags(frame, numR, numC) {
    const numMines = frame[numR][numC];
    if (numMines < 0)
        return [];
    const surroundingPositions = [[numR - 1, numC - 1],
                                    [numR - 1, numC],
                                    [numR - 1, numC + 1],
                                    [numR, numC - 1],
                                    [numR, numC + 1],
                                    [numR + 1, numC - 1],
                                    [numR + 1, numC],
                                    [numR + 1, numC + 1]];
    let numFlagsFound = 0;
    let numCellsHidden = 0;
    const flagPositions = [];
    for (let [r, c] of surroundingPositions) {
        if (r >= 0 && r < size && c >= 0 && c < size) {
            if (frame[r][c] == -1) { // hidden
                numCellsHidden++;
                flagPositions.push([r, c]);
            } else if (frame[r][c] == -2) { // flag
                numFlagsFound++;
            }
        }
    }

    if (numCellsHidden + numFlagsFound == numMines)
        return flagPositions;
    else
        return [];

}

/*
 * Takes frame and the position of a revealed number cell as parameters.
 * Returns a list of (r, c) pairs, for the positions of cells surrounding
 * the given number cell that the number cell constrains to be number cells.
 * This occurs when all of the mines around that number cell have been
 * flagged.
 */
function certainNumCells(frame, numR, numC) {
    const numMines = frame[numR][numC];
    if (numMines < 0) // (numR, numC) is not a number cell
        return [];
    const surroundingPositions = [[numR - 1, numC - 1],
        [numR - 1, numC],
        [numR - 1, numC + 1],
        [numR, numC - 1],
        [numR, numC + 1],
        [numR + 1, numC - 1],
        [numR + 1, numC],
        [numR + 1, numC + 1]
    ];
    const hiddenCells = [];
    let numFlags = 0;
    for (let [r, c] of surroundingPositions) {
        if (r >= 0 && r < size && c >= 0 && c < size) {
            if (frame[r][c] == -1) // hidden
                hiddenCells.push([r, c]);
            else if (frame[r][c] == -2) // flag
                numFlags++;
        }
    }
    if (numFlags == numMines)
        return hiddenCells;
    else
        return [];
}

/* 
 * A simple minesweeper-solving algorithm. Applies a single move, either
 * revealing or flagging a cell. Only makes a move if it is certain that the
 * move is correct, and does not consider possible frames more than one move
 * into the future. If no such move can be found, returns null. Returns an
 * object with format (moveType, r, c}, where moveType = moves.REVEAL or
 * moves.FLAG.
 */
function simpleAlgorithm(frame) {
    // if frame is all-hidden (no cells revealed yet)
    if (frame.every(function(row){
        return row.every(function(value) {
            return value == -1; // whether hidden cell
        });
    })) {
        // Reveal middle cell and return
        mid = Math.trunc(size / 2);
        const move = {
            moveType: moves.REVEAL,
            r: mid,
            c: mid
        }
        return move;
    }

    // Simplified description of simpleAlgorithm:
    //
    // For each revealed number cell on the frame:
    //     If the cell guarantees a mine placement in a nearby cell:
    //         Flag the suspected mine
    //         return
    //     Else if the cell’s nearby mines have all been revealed, but not all of its nearby number cells have been revealed:
    //         Reveal a nearby number cells
    //         return

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (frame[r][c] > 0) { // if number cell
                const certainFlagsList = certainFlags(frame, r, c);
                const certainNumCellsList = certainNumCells(frame, r, c);
                if (certainFlagsList.length > 0) {
                    const [certR, certC] = certainFlagsList[0];
                    const move = {
                        moveType: moves.FLAG,
                        r: certR,
                        c: certC
                    }
                    return move;
                } else if (certainNumCellsList.length > 0) {
                    const [certR, certC] = certainNumCellsList[0];
                    const move = {
                        moveType: moves.REVEAL,
                        r: certR,
                        c: certC
                    }
                    return move;
                }
            }
        }
    }
    
    // no move was found
    return null;
}

// Called when the applyAlgo button is clicked
function applySimpleAlgo() {
    const move = simpleAlgorithm(globalFrame);
    if (move === null) {
        return;
    } else if (move.moveType == moves.REVEAL) {
        leftClickCell(move.r, move.c);
    } else if (move.moveType == moves.FLAG) {
        rightClickCell(move.r, move.c);
    }
    updateDisplay();
}