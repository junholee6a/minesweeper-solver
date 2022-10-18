
/* 
 * Takes frame and the position of a revealed number cell as parameters.
 * Returns a list of (r, c) pairs, for the positions of cells surrounding
 * the given number cell that the number cell constrains to be mines. This occurs
 * when the number of hidden cells around a number cell is equal to the number
 * of unrevealed mines around it. Otherwise, the returned list is empty.
 */
function certainFlags(frame, numR, numC, size) {
    const numFlags = frame[numR][numC];
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

    if (numCellsHidden + numFlagsFound == numFlags)
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
        }
    ];

    for (test of tests) {
        let positions = certainFlags(test.frame, test.numR, test.numC, test.frame.length)
        if (JSON.stringify(positions.sort()) == JSON.stringify(test.key.sort()))
            console.log("Passed");
        else
            console.log("Failed");
    }
}

testCertainFlags();