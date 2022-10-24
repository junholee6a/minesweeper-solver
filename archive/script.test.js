
/* 
 * Takes frame and the position of a revealed number cell as parameters.
 * Returns a list of (r, c) pairs, for the positions of cells surrounding
 * the given number cell that the number cell constrains to be mines. This occurs
 * when the number of hidden cells around a number cell is equal to the number
 * of unrevealed mines around it. Otherwise, the returned list is empty.
 */
function certainFlags(frame, numR, numC) {
    const size = frame.length // can remove this line for production
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

function testCertainFlags() {
    tests = [
        {
            frame: [
                [1, -1],
                [1, 1]
            ],
            numR: 0,
            numC: 0,
            key: [[0, 1]]
        },
        {
            frame: [
                [2, -1],
                [-1, 2]
            ],
            numR: 1,
            numC: 1,
            key: [[0, 1], [1, 0]]
        },
        {
            frame: [
                [3, -1, -1],
                [-1, -2, -1],
                [-1, -1, -1]
            ],
            numR: 0,
            numC: 0,
            key: [[0, 1], [1, 0]]
        },
        {
            frame: [
                [-1, -2, -1],
                [5, -1, -1],
                [-1, -1, -1]
            ],
            numR: 1,
            numC: 0,
            key: [[0, 0], [1, 1], [2, 0], [2, 1]]
        },
        {
            frame: [
                [-1, -1, -1],
                [-1, 8, -1],
                [-1, -1, -1]
            ],
            numR: 1,
            numC: 1,
            key: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]
        }
    ];

    for (test of tests) {
        let positions = certainFlags(test.frame, test.numR, test.numC, test.frame.length)
        if (JSON.stringify(positions.sort()) == JSON.stringify(test.key.sort()))
            console.log('Passed ' + JSON.stringify(test));
        else
            console.log('Failed ' + JSON.stringify(test));
    }
}

/*
 * Takes frame and the position of a revealed number cell as parameters.
 * Returns a list of (r, c) pairs, for the positions of cells surrounding
 * the given number cell that the number cell constrains to be number cells.
 * This occurs when all of the mines around that number cell have been
 * flagged.
 */
function certainNumCells(frame, numR, numC) {
    const size = frame.length // can remove this line for production
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

function testCertainNumCells() {
    tests = [
        {
            frame: [
                [2, -1],
                [-2, -2]
            ],
            numR: 0,
            numC: 0,
            key: [[0, 1]]
        },
        {
            frame: [
                [2, -1],
                [-2, -2]
            ],
            numR: 1,
            numC: 0,
            key: []
        },
        {
            frame: [
                [1, -1],
                [-2, -1]
            ],
            numR: 0,
            numC: 0,
            key: [[0, 1], [1, 1]]
        },
        {
            frame: [
                [-2, -1, -1],
                [-1, 8, -1],
                [-1, -1, -1]
            ],
            numR: 1,
            numC: 1,
            key: []
        },
        {
            frame: [
                [-1, -1, -1],
                [-2, 5, -2],
                [-2, -2, -2]
            ],
            numR: 1,
            numC: 1,
            key: [[0, 0], [0, 1], [0, 2]]
        },
        {
            frame: [
                [-2, -2, -2],
                [-2, 8, -2],
                [-2, -2, -2]
            ],
            numR: 1,
            numC: 1,
            key: []
        },
        {
            frame: [
                [-1, -1, -1],
                [-1, 1, -2],
                [-1, -1, -1]
            ],
            numR: 1,
            numC: 1,
            key: [[0, 0], [0, 1], [0, 2], [1, 0], [2, 0], [2, 1], [2, 2]]
        }
    ]
    for (test of tests) {
        let minePositions = certainNumCells(test.frame, test.numR, test.numC);
        if (JSON.stringify(minePositions.sort()) == JSON.stringify(test.key.sort()))
            console.log("Passed " + JSON.stringify(test));
        else
            console.log("Failed " + JSON.stringify(test));
    }
}

/*
 * Helper method for testing simpleAlgorithm. Unlike the real
 * revealCell, replaces the num cell to reveal with value -3. In the
 * future, consider making the board a parameter of revealCell so that
 * it does not depend on the global board variable.
 */
function revealCell(frame, r, c) {
    newFrame = JSON.parse(JSON.stringify(frame));
    newFrame[r][c] = -3;
    return newFrame;
}

/* 
 * A simple minesweeper-solving algorithm. Applies a single move, either
 * revealing or flagging a cell. Only makes a move if it is certain that the
 * move is correct, and does not consider possible frames more than one move
 * into the future. If no such move can be found, no move is made. Returns a
 * copy of the frame with the move made.
 */
function simpleAlgorithm(frame) {
    const size = frame.length // can remove this line for production
    // if frame is all-hidden (no cells revealed yet)
    if (frame.every(function(row){
        return row.every(function(value) {
            return value == -1; // whether hidden cell
        });
    })) {
        // Reveal middle cell and return
        mid = Math.trunc(size / 2);
        return revealCell(frame, mid, mid);

    }

    let newFrame = JSON.parse(JSON.stringify(frame)); // deep copy of frame

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
                    newFrame[certR][certC] = -2; // set a flag
                    return newFrame;
                } else if (certainNumCellsList.length > 0) {
                    const [certR, certC] = certainNumCellsList[0];
                    newFrame = revealCell(frame, certR, certC); // reveal a cell
                    return newFrame;
                }
            }
        }
    }
    
    // no move was found
    return newFrame;
}

function testSimpleAlgorithm() {
    const tests = [ // list of frames
        [ // 0: should place a flag
            [3, -1],
            [-1, -1]
        ],
        [ // 1: should make no move
            [2, -1],
            [-1, -1]
        ],
        [ // 2: should make no move
            [1, -1],
            [1, -1]
        ],
        [ // 3: should place a flag
            [2, -1],
            [-2, 2]
        ],
        [ // 4: should reveal a number space
            [1, -2],
            [-1, -1]
        ],
        [ // 5: should reveal a number space
            [2, -1],
            [-2, -2]
        ],
        [ // 6: should reveal one cell (in "middle")
            [-1, -1],
            [-1, -1]
        ],
        [ // 7: should make no move
            [2, -2],
            [-2, 2]
        ]
    ];

    for (let i = 0; i < tests.length; i++) {
        const frame = tests[i];
        const newFrame = simpleAlgorithm(frame);
        console.log(`----Test ${i}----`);
        console.log("Input:");
        for (let row of frame) {
            console.log(JSON.stringify(row));
        }
        console.log("Output:");
        for (let row of newFrame) {
            console.log(JSON.stringify(row));
        }
    }
}

// testCertainFlags();
// testCertainNumCells();
testSimpleAlgorithm();