// // class that stores information about a move that can be
// // made in Minesweeper. For moves where the true cell value
// // is unknown, set cellValue to null.
// class Move {
//     constructor(r, c, moveType, cellValue) {
//         this.moveType = moveType;
//         this.r = r;
//         this.c = c;

//         // Value of this cell on the board. -1 is a mine.
//         this.cellValue = cellValue;
//     }

//     // values that moveType can be set to
//     static REVEAL = "reveal";
//     static FLAG = "flag";
//     static GAMEOVER = "gameOver";
//     static NONE = "none";
// }

// export default Move;

// values that moveType can be set to
const moveTypes = {
    // enum of move types that can be made on a frame
    REVEAL: "reveal",
    FLAG: "flag",
    GAMEOVER: "gameOver",
    NONE: "none",
};
Object.freeze(moveTypes);

export default moveTypes;