import useGame from "./useGame.js";

export default function App() {
    const [frame, gameWon, gameLost, numFlags, resetGame, reveal, flag, applySimpleAlgo] = useGame();

    return (
        <>
            <GameDisplay id="frameContainer" frame={frame} reveal={reveal} flag={flag} />
            <div id="controlPanel">
                <span id="flagCount">Flags left: </span>
                <input
                    id="applyAlgoButton"
                    type="button"
                    value="Apply Algorithm"
                    onClick="applySimpleAlgo()"
                />
                <input
                    id="resetButton"
                    type="button"
                    value="Reset"
                    onClick="resetGame()"
                />
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
            let i = r * size + c;
            let cell = cells[i];

            function handleLeftClick(e) {
                reveal(r, c);
            }

            function handleRightClick(e) {
                flag(r, c);
                e.preventDefault()
            }

            if (frame[r][c] == -2) {
                // flag
                cells.push(<div backgroundColor="Red" onClick={handleLeftClick} onContextMenu={handleRightClick}></div>);
            } else if (frame[r][c] == -1) {
                // hidden
                cells.push(<div backgroundColor="Green" onClick={handleLeftClick} onContextMenu={handleRightClick}></div>);
            } else {
                // number 0-8
                const text = "";
                if (frame[r][c] > 0)
                    text = String(frame[r][c]);
                cells.push(<div backgroundColor="LightGrey" onClick={handleLeftClick} onContextMenu={handleRightClick}>{text}</div>);
                
            }
        }
    }
    return (<>{cells}</>);

}
