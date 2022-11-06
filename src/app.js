import useGame from "./useGame.js";

export default function App() {
    const [
        frame,
        gameWon,
        gameLost,
        numFlags,
        resetGame,
        reveal,
        flag,
        applySimpleAlgo,
    ] = useGame();

    let gameStatus = "";
    if (gameWon) gameStatus = "You win!";
    else if (gameLost) gameStatus = "You lost!";

    return (
        <>
            <GameDisplay frame={frame} reveal={reveal} flag={flag} />
            <div id="controlPanel">
                <span id="flagCount">Flags left: {numFlags}</span>
                <input
                    id="applyAlgoButton"
                    type="button"
                    value="Apply Algorithm"
                    onClick={applySimpleAlgo}
                />
                <input
                    id="resetButton"
                    type="button"
                    value="Reset"
                    onClick={resetGame}
                />
                <p id="gameStatusMessage">{gameStatus}</p>
            </div>
            <script src="script.js"></script>
        </>
    );
}

function GameDisplay(props) {
    const frame = props.frame;
    const reveal = props.reveal;
    const flag = props.flag;

    const size = frame.length;
    const cells = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            function handleLeftClick(e) {
                reveal(r, c);
            }

            function handleRightClick(e) {
                flag(r, c);
                e.preventDefault();
            }

            const key = r + "-" + c;

            if (frame[r][c] === -2) {
                // flag
                cells.push(
                    <div
                        style={{ backgroundColor: "red" }}
                        onClick={handleLeftClick}
                        onContextMenu={handleRightClick}
                        key={key}
                    ></div>
                );
            } else if (frame[r][c] === -1) {
                // hidden
                cells.push(
                    <div
                        style={{ backgroundColor: "green" }}
                        onClick={handleLeftClick}
                        onContextMenu={handleRightClick}
                        key={key}
                    ></div>
                );
            } else {
                // number 0-8
                let text = "";
                if (frame[r][c] > 0) text = String(frame[r][c]);
                cells.push(
                    <div
                        style={{ backgroundColor: "lightGrey" }}
                        onClick={handleLeftClick}
                        onContextMenu={handleRightClick}
                        key={key}
                    >
                        {text}
                    </div>
                );
            }
        }
    }
    return <div id="frameContainer">{cells}</div>;
}
