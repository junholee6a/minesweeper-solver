import useGame from "./useGame.js";

export default function App() {
    const [getFrame, resetGame, reveal, flag, applySimpleAlgo] = useGame();

    return (
        <>
            <div id="frameContainer"></div>
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
    const size = frame.length;
    const cells = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            let i = r * size + c;
            let cell = cells[i];
            if (frame[r][c] == -2) {
                // flag
                cells.push(<></>); // need to handle clicks too. Consider making a cell component
                cell.style.backgroundColor = "Red";
            } else if (frame[r][c] == -1) {
                // hidden
                cell.style.backgroundColor = "Green";
            } else {
                // number 0-8
                cell.style.backgroundColor = "LightGrey";
                if (frame[r][c] > 0)
                    cell.innerHTML = String(globalFrame[r][c]);
            }
        }
    }
    return (

    );

}
