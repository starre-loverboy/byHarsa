/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react"
import GlobalNav from "../../components/GlobalNav"
import GlobalFooter from "../../components/GlobalFooter"
import SavedRun from "./SavedRun"

function AimTrainer() {
    const [gameState, setGameState] = useState<"active" | "finished" | "idle" | "erred">("idle");
    //all targets here
    const [round, setRound] = useState<number>(0);
    const [targetCount, setTargetCount] = useState<number>(10);
    const [timeLimit, setTimeLimit] = useState<number>(30); //seconds
    const [targetSize, setTargetSize] = useState<string>("--size--")
    const [targetCoords, setTargetCoords] = useState({ x: 0, y: 0 })
    //all temps here
    const [tempSize, setTempSize] = useState<string>(targetSize)
    const [tempTime, setTempTime] = useState<number>(timeLimit)
    const [tempCount, setTempCount] = useState<number>(targetCount)
    //misc here
    const [timer, setTimer] = useState<number>(timeLimit);
    const [timeGapList, setTimeGapList] = useState<number[]>([]);
    const [savedList, setSavedList] = useState<SavedRunData[]>(() => {
        const newSavedList = localStorage.getItem("savedRunsList-aimTrainer")
        return newSavedList ? JSON.parse(newSavedList) as SavedRunData[] : []
    });
    const [selectedList, setSelectedList] = useState<number[]>([])
    const [toasts, setToasts] = useState<{ id: number; message: string; type: string }[]>([]);

    const gameBoxRef = useRef<HTMLDivElement>(null);
    const mainTitleRef = useRef<HTMLHeadingElement>(null);

    const showToast = (message: string, type: string) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 1500);
    };

    const newTimeGapList = timeGapList.slice(1).map((item, index) => {
        return item - timeGapList[index]
    })

    useEffect(() => {
        localStorage.setItem("savedRunsList-aimTrainer", JSON.stringify(savedList))
    }, [savedList])

    useEffect(() => {
        if (gameState !== "active") return
        if (targetCount < 5) {
            setGameState("idle")
            return
        } else {
            if (round === targetCount) {
                setGameState("finished")
                return
            }
        }

        const id = setTimeout(() => {
            setGameState("finished");
        }, timeLimit * 1000)

        const id2 = setInterval(() => {
            setTimer((prev) => prev - 0.1)
        }, 100)

        return () => {
            clearTimeout(id)
            clearInterval(id2)
        }
    }, [gameState])

    useEffect(() => {
        console.log(timeGapList)
        console.log(newTimeGapList)
        if (round > targetCount) return;
        const newTargetCoords = {
            x: Math.floor(Math.random() * 90),
            y: Math.floor(Math.random() * 90)
        }
        setTargetCoords(newTargetCoords)
    }, [round])

    const handleStart = () => {
        if (gameState === "active") return
        const isCountValid = tempCount > 0 && tempCount <= 1000000
        const isTimeValid = tempTime >= 2 && tempCount <= 1000000
        const isSizeValid = tempSize !== "--size--"
        if (!isTimeValid || !isCountValid || !isSizeValid) {
            setGameState("erred");
            return;
        }
        setTimer(tempTime)
        setTargetCount(tempCount)
        setTargetSize(tempSize)
        setTimeLimit(tempTime)
        setGameState("active");
        setRound(1)
        setTimeGapList([])
    }

    const handleClick = () => {
        if (gameState !== "active") return

        const now = Date.now()
        setTimeGapList((prev) => {
            if (prev) return [...prev, now]
            return [now]
        })
        setRound((prev) => prev + 1)
        if (round === targetCount) setGameState("finished")
    }

    const handleReset = () => {
        setRound(0)
        setGameState("idle")
        setTimer(timeLimit)
        setTimeGapList([])
    }

    interface SavedRunData {
        fastest: number
        slowest: number;
        avg: number
        totalTime: number
        count: number
        date: string;
    }

    const handleSave = () => {
        const savedInfo = {
            fastest: Math.min(...newTimeGapList),
            slowest: Math.max(...newTimeGapList),
            avg: ((newTimeGapList.reduce((a, b) => a + b, 0)) / newTimeGapList.length).toFixed(0),
            totalTime: timeLimit - timer,
            count: targetCount,
            date: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }),
        }
        setSavedList((prev) => [savedInfo, ...prev] as SavedRunData[])
        showToast("You have saved a run.", 'save');

    }

    const toggleSelected = (index: number) => {
        if (selectedList.includes(index)) {
            setSelectedList(selectedList.filter((i) => i !== index))
        } else {
            setSelectedList((prev) => [...prev, index])
        }
    }
    const handleDelete = () => {
        setSavedList(savedList.filter((_, i) => !selectedList.includes(i)))
        setSelectedList([])
        showToast("You have deleted selected runs.", 'delete');

    }

    useEffect(() => {
        if (gameState === "active") {
            setTimeout(() => {
                gameBoxRef.current?.scrollIntoView({
                block: "center",
                behavior: "smooth"
            })  
            }, 100)
        }
        if (gameState === "idle") {
            mainTitleRef.current?.scrollIntoView({
                block: "center",
                behavior: "smooth"
            })
        }
    }, [gameState])

    return (
        <div className="game-board">
            <h1 className="mainTitle-h1" ref={mainTitleRef}>Aim Trainer</h1>
            <fieldset className={gameState === "active" ? "fieldsetClass true-disabled control-panel" : "fieldsetClass control-panel"} disabled={gameState === "active"}>
                <label>Target Count:</label>
                <input type="number" defaultValue="10" min="5" onChange={(e) => setTempCount(Number(e.target.value))} />
                <span>Min is 5 | Max is 1 million</span>
                <label>Target Size:</label>
                <select onChange={(e) => setTempSize(e.target.value)}>
                    <option>--size--</option>
                    <option value="large">Large</option>
                    <option value="medium">Medium</option>
                    <option value="small">Small</option>
                </select>
                <label>Time Limit:</label>
                <input type="number" defaultValue="30" min="2" onChange={(e) => setTempTime(Number(e.target.value))} />
                <span>Min is 2 secs | Max is 1 million secs</span>
                <button onClick={() => handleStart()} className="start-button">Start Game</button>
                {gameState === "erred" && <p className="fieldset-warning-p">Some inputs are problematic, please fix them.</p>}
                {gameState === "active" && <p className="fieldset-warning-p">Fieldset is disabled when playing.</p>}
            </fieldset>
            {gameState === "active" && targetCount > 4 && (
                <div className="aimTrainer-container game-container" ref={gameBoxRef}>
                    <>
                        <div className="aimTrainer-info-ground game-info-ground">
                            <h2>{round - 1} / {targetCount}</h2>
                            <h2>{timer.toFixed(1)} s</h2>
                        </div>
                        <button className="reset-button" onClick={handleReset}>Reset Game</button>

                        <div className="aimTrainer-ground game-ground">
                            <div onClick={handleClick} className={`current-target-stroop ${targetSize}`} style={{ top: `${targetCoords.y}%`, left: `${targetCoords.x}%` }}></div>
                        </div>
                    </>
                </div>
            )}
            {/* fastest slowest avg time targetCount */}
            {gameState === "finished" && (
                <div className="finished-section">
                    <h2 className="finished-notif">You've finished!</h2>
                    <div className="saved-run-temp">
                        <p>fastest: <span className="saved-run-temp-span">{Math.min(...newTimeGapList)} ms</span></p>
                        <p>avg: <span className="saved-run-temp-span">{((newTimeGapList.reduce((a, b) => a + b, 0)) / newTimeGapList.length).toFixed(0)} ms</span></p>
                        <p>count: <span className="saved-run-temp-span">{targetCount}</span></p>
                    </div>
                    <button className="finished-related-interactibles play" onClick={handleStart}>Play again</button>
                    <button className="finished-related-interactibles save" onClick={handleSave}>Save run</button>
                </div>
            )}
            <div className="saved-runs-section">
                <h2 className="saved-runs-title">Saved Runs:</h2>
                {savedList.length < 1 && <h2>--currently empty--</h2>}
                {savedList.map((run, index) => (
                    <SavedRun
                        key={index}
                        fastest={run.fastest}
                        slowest={run.slowest}
                        avg={run.avg}
                        total={run.totalTime}
                        count={run.count}
                        date={run.date}
                        isSelected={selectedList.includes(index)}
                        toggleSelected={() => toggleSelected(index)}
                    />
                ))}
                {selectedList.length > 0 && (
                    <button className="delete-saved-button finished-related-interactibles" onClick={handleDelete}>Delete Selected</button>
                )}
            </div>
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast-notif toast-notif-${toast.type}`}>{toast.message}</div>
                ))}
            </div>
            <GlobalFooter />
            <GlobalNav />
        </div>
    )
}

export default AimTrainer
