
/* 
 * Takes frame and the position of a revealed number cell as parameters.
 * Returns a list of (r, c) pairs, for the positions of cells surrounding
 * the given number cell that the number cell constrains to be mines. This occurs
 * when the number of hidden cells around a number cell is equal to the number
 * of unrevealed mines around it. Otherwise, the returned list is empty.
 */
function certainFlags(frame, numR, numC, size) {
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
    size = frame.length // can remove this line for production
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

// testCertainFlags();
testCertainNumCells();