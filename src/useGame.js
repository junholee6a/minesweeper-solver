// Custom hook to handle Minesweeper game logic

import { useState } from "react";
import {
    createBoard,
    createFrame,
    isGameWon,
    revealCell,
    flagCell,
    unflagCell,
    simpleAlgorithm,
} from "./util.js";

export default function useGame() {
    const size = 9;
    const numMines = 10;
    const [gameWon, setGameWon] = useState(false);
    const [gameLost, setGameLost] = useState(false);
    const [numFlags, setNumFlags] = useState(10);

    // TODO: Get rid of all return values in these functions

    // Represents the true cell values, which may not be visible to the user.
    // 2D array of integers -1 to 8, with -1 being a mine
    const [globalBoard, setGlobalBoard] = useState([]);

    // Represents the grid that is visible to the user.
    // 2D array of integers, -2=flag, -1=hidden, 0-8=number of mines in proximity
    const [globalFrame, setGlobalFrame] = useState(createFrame(size));

    // Call to reset the game.
    // Returns the (all-hidden) frame of the generated game.
    function resetGame() {
        setGameWon(false);
        setGameLost(false);
        setNumFlags(10);
        setGlobalBoard([]); // will be generated on first click
        const frame = createFrame(size);
        setGlobalFrame(frame);
        return frame;
    }

    /*
     * Reveals a cell on the global frame.
     * Returns:
     *     gameLost: Boolean value
     *     frame: New frame array
     */
    function reveal(r, c) {
        // if there is no active game, do nothing
        if (gameWon || gameLost)
            return;

        let board = globalBoard;
        if (board.length == 0) {
            // generate a global board
            board = createBoard(r, c, size, numMines);
            setGlobalBoard(board);
        }
        
        const result = revealCell(globalFrame, board, r, c);
        const frame = JSON.parse(JSON.stringify(result.frame)); // deep copy so that it is not a mere mutation of globalFrame
        setGameLost(result.gameLost);
        setGameWon(isGameWon(board, frame));
        setGlobalFrame(frame);
        return {
            gameLost: result.gameLost,
            frame: frame,
        };
    }

    /*
     * Flags OR unflags a cell on the frame, if applicable.
     * Returns an object with:
     *      frame: New frame array
     *      numFlags: Number of flags remaining
     */
    function flag(r, c) {
        // if there is no active game, do nothing
        if (gameWon || gameLost)
            return;

        if (globalFrame[r][c] == -1) {
            // if hidden cell, flag
            const newNumFlags = numFlags - 1;
            setNumFlags(newNumFlags);
            setGlobalFrame(flagCell(globalFrame, r, c));
            return {
                frame: flagCell(globalFrame, r, c),
                numFlags: newNumFlags,
            };
        } else if (globalFrame[r][c] == -2) {
            // if flagged cell, unflag
            const newNumFlags = numFlags + 1;
            setNumFlags(newNumFlags);
            setGlobalFrame(unflagCell(globalFrame, r, c));
            return {
                frame: unflagCell(globalFrame, r, c),
                numFlags: newNumFlags,
            };
        } else {
            // do nothing
            return {
                frame: globalFrame,
                numFlags: numFlags,
            };
        }
    }

    /*
     * Makes a single move with simpleAlgorithm, if it can be made.
     * Returns:
     *     gameLost: Boolean value
     *     frame: New frame array
     *     numFlags: Number of flags remaining
     */
    function applySimpleAlgo() {
        const { moveType, r, c } = simpleAlgorithm(globalFrame);
        if (moveType === "r") {
            // reveal a cell
            const { gameLost, frame } = reveal(r, c);
            return {
                gameLost: gameLost,
                frame: frame,
                numFlags: numFlags,
            };
        } else if (moveType === "f") {
            // flag a cell
            const { frame, numFlags } = flag(r, c);
            return {
                gameLost: false,
                frame: frame,
                numFlags: numFlags,
            };
        } else {
            // (moveType === "n") make no move
            return {
                gameLost: false,
                frame: globalFrame,
                numFlags: numFlags,
            };
        }
    }

    return [globalFrame, gameWon, gameLost, numFlags, resetGame, reveal, flag, applySimpleAlgo];
}
