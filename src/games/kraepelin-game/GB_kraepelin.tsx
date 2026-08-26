import GlobalFooter from "../../components/GlobalFooter"
import GlobalNav from "../../components/GlobalNav"
import { useState } from "react"

function GB_kraepelin() {
    const [gameState, setGameState] = useState<"active" | "finished" | "idle" | "erred">("idle")
    const [chosenTotalTime, setChosenTotalTime] = useState<number>(60)

    const handleStart = () => {
        if (chosenTotalTime < 5 || chosenTotalTime > 1000000) {
            setGameState("erred");
            return
        }
        setGameState("active")
    }
    const handleReset = () => {
        setGameState("idle")
    }

    return (
        <div className="game-board">
            <h1 className="mainTitle-h1">Kraepelin</h1>
            <fieldset className="control-panel" disabled={gameState === "active"}>
                <label>Total Time (seconds): </label>
                <input type="text" defaultValue="60" onChange={(e) => setChosenTotalTime(Number(e.target.value))} />
                <span>min = 5 | max = 1 million</span>
                <button className="start-button" onClick={handleStart}>Start Game</button>
                {gameState === "erred" && <p className="fieldset-warning-p">The input(s) are problematic. Please fix them.</p>}
                {gameState === "active" && <p className="fieldset-warning-p">Fieldset is disabled when game is running.</p>}
            </fieldset>

            {gameState === "active" && (
                <div>temp, game is starting
                    <button onClick={handleReset}>Reset Game</button>
                </div>
            )}

            <GlobalNav />
            <GlobalFooter />
        </div>
    )
}

export default GB_kraepelin