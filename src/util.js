// Returns a new board, placing mines and numbers. Guarantees that the
// cell at (clickR, clickC) is a 0 number cell
export function createBoard(clickR, clickC, size, numMines) {
    // initialize board
    board = [];

    // fill board with zeros
    for (let r = 0; r < size; r++) {
        let row = new Array(size).fill(0);
        board.push(row);
    }

    // returns a random integer, lower bound inclusive, upper bound exclusive
    function randInt(lower, upper) {
        return parseInt(Math.random() * (upper - lower) + lower, 10);
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
        if (
            board[r][c] != -1 &&
            !(
                r >= clickR - 1 &&
                r <= clickR + 1 &&
                c >= clickC - 1 &&
                c <= clickC + 1
            )
        ) {
            // if space is valid for a new mine
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

    return board;
}

// Returns a new frame, all hidden
export function createFrame(size) {
    // initialize frame
    frame = [];

    // fill board with 'h' (hidden)
    for (let r = 0; r < size; r++) {
        let row = new Array(size).fill(-1);
        frame.push(row);
    }
    return frame;
}

// Check whether the game is won (all number cells are revealed).
// Returns boolean value.
export function isGameWon(board, frame) {
    const size = frame.length;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] >= 0 && frame[r][c] != board[r][c]) {
                // if number cell that is not revealed
                return false;
            }
        }
    }
    return true;
}

// Reveals a cell on the frame.
// Returns an object with:
//      gameLost: Boolean value; true if game is lost (revealed a mine)
//      frame: An updated frame such that a cell is revealed by the player
export function revealCell(frame, board, r, c) {
    const size = frame.length;
    if (board[r][c] == -1) {
        // cell is a mine
        return {
            gameLost: true,
            frame: frame,
        };
    }

    // update cell
    frame[r][c] = board[r][c];

    function revealCellRecursive(r, c) {
        if (
            r < 0 ||
            c < 0 ||
            r >= size ||
            c >= size ||
            board[r][c] == -1 ||
            frame[r][c] != -1
        ) {
            // if not a valid, hidden number cell
            return {
                gameLost: false,
                frame: frame,
            };
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

    return {
        gameLost: false,
        frame: frame,
    };
}

// Returns an updated frame such that a cell is flagged
export function flagCell(frame, r, c) {
    const size = frame.length;
    frame[r][c] = -2;
    numFlags++;
    return frame;
}

//Returns an updated frame such that a cell is unflagged
export function unflagCell(frame, r, c) {
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
    const size = frame.length;
    const numCloseMines = frame[numR][numC];
    if (numCloseMines < 0) return [];
    const surroundingPositions = [
        [numR - 1, numC - 1],
        [numR - 1, numC],
        [numR - 1, numC + 1],
        [numR, numC - 1],
        [numR, numC + 1],
        [numR + 1, numC - 1],
        [numR + 1, numC],
        [numR + 1, numC + 1],
    ];
    let numFlagsFound = 0;
    let numCellsHidden = 0;
    const flagPositions = [];
    for (let [r, c] of surroundingPositions) {
        if (r >= 0 && r < size && c >= 0 && c < size) {
            if (frame[r][c] == -1) {
                // hidden
                numCellsHidden++;
                flagPositions.push([r, c]);
            } else if (frame[r][c] == -2) {
                // flag
                numFlagsFound++;
            }
        }
    }

    if (numCellsHidden + numFlagsFound == numCloseMines) return flagPositions;
    else return [];
}

/*
 * Takes frame and the position of a revealed number cell as parameters.
 * Returns a list of (r, c) pairs, for the positions of cells surrounding
 * the given number cell that the number cell constrains to be number cells.
 * This occurs when all of the mines around that number cell have been
 * flagged.
 */
function certainNumCells(frame, numR, numC) {
    const size = frame.length;
    const numCloseMines = frame[numR][numC];
    if (numCloseMines < 0)
        // (numR, numC) is not a number cell
        return [];
    const surroundingPositions = [
        [numR - 1, numC - 1],
        [numR - 1, numC],
        [numR - 1, numC + 1],
        [numR, numC - 1],
        [numR, numC + 1],
        [numR + 1, numC - 1],
        [numR + 1, numC],
        [numR + 1, numC + 1],
    ];
    const hiddenCells = [];
    let numFlags = 0;
    for (let [r, c] of surroundingPositions) {
        if (r >= 0 && r < size && c >= 0 && c < size) {
            if (frame[r][c] == -1)
                // hidden
                hiddenCells.push([r, c]);
            else if (frame[r][c] == -2)
                // flag
                numFlags++;
        }
    }
    if (numFlags == numCloseMines) return hiddenCells;
    else return [];
}

/*
 * A simple minesweeper-solving algorithm. Applies a single move, either
 * revealing or flagging a cell. Only makes a move if it is certain that the
 * move is correct, and does not consider possible frames more than one move
 * into the future. Returns an object of structure {moveType, r, c}:
 *      moveType: String, either "r" for reveal, "f" for flag, or "n" for none
 *      r, c: numbers representing row and column
 */
export function simpleAlgorithm(frame) {
    const size = frame.length;

    // if frame is all-hidden (no cells revealed yet)
    if (
        frame.every(function (row) {
            return row.every(function (value) {
                return value == -1; // whether hidden cell
            });
        })
    ) {
        // Reveal middle cell and return
        mid = Math.trunc(size / 2);
        return {
            moveType: "r",
            r: mid,
            c: mid,
        };
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
            if (frame[r][c] > 0) {
                // if number cell
                const certainFlagsList = certainFlags(frame, r, c);
                const certainNumCellsList = certainNumCells(frame, r, c);
                if (certainFlagsList.length > 0) {
                    const [certR, certC] = certainFlagsList[0];
                    return {
                        moveType: "f",
                        r: certR,
                        c: certC,
                    };
                } else if (certainNumCellsList.length > 0) {
                    const [certR, certC] = certainNumCellsList[0];
                    return {
                        moveType: "r",
                        r: certR,
                        c: certC,
                    };
                }
            }
        }
    }

    // no move was found
    return {
        moveType: "n",
        r: -1,
        c: -1,
    };
}
