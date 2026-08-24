import { useState, useEffect, useRef } from "react";
import ControlPanel from "./ControlPanel";
import COLORPOOL, { type COLORPOOLPROPS } from "./COLORPOOL";
import SavedRun from "./SavedRun"
import GlobalNav from "../../components/GlobalNav";
import GlobalFooter from "../../components/GlobalFooter";

function GB_stroop() {
    const [desiredNumber, setDesiredNumber] = useState<number>(10);
    const [timePerRound, setTimePerRound] = useState<number>(2);
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [currentRound, setCurrentRound] = useState<COLORPOOLPROPS>({ text: "", value: [] });
    const [isReset, setIsReset] = useState<boolean>(false);
    const [matchType, setMatchType] = useState<string>("");
    const [roundCount, setRoundCount] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [combinedMatchType, setCombinedMatchType] = useState<string>("");
    const [isDone, setIsDone] = useState<boolean>(false);
    const [correctTotal, setCorrectTotal] = useState<number>(0);
    const [wrongTotal, setWrongTotal] = useState<number>(0);
    const [timer, setTimer] = useState<number>(timePerRound);
    const [savedList, setSavedList] = useState<SavedRunData[]>(() => {
        const savedData = localStorage.getItem("savedRunsList-stroop");
        return savedData ? JSON.parse(savedData) : []
    });
    const [selectedList, setSelectedList] = useState<number[]>([]);
    const [toasts, setToasts] = useState<
        { id: number; message: string; type: string }[]
    >([]);
    const [isWrong, setIsWrong] = useState<boolean | null>(null)

    const showToast = (message: string, type: string) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((i) => i.id !== id));
        }, 1500);
    };

    useEffect(() => {
        if (!hasStarted || !matchType || isReset) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setScore(0);
            setRoundCount(0);
            setCurrentRound({ text: "", value: [] })
            setIsReset(false)
            setIsWaiting(false);
            setIsDisabled(false);
            setTimer(0)
            if (isReset || !matchType) {
                setHasStarted(false);
                return
            }
            return;
        }
        if (hasStarted) {
            setCorrectTotal(0)
            setWrongTotal(0)
        }

        setIsDone(false);
        setIsReset(false);

        setCombinedMatchType(Math.random() <= 0.5 ? "text" : "color");
        const firstTextObj = COLORPOOL[Math.floor(Math.random() * COLORPOOL.length)];
        const firstColorObj = COLORPOOL[Math.floor(Math.random() * COLORPOOL.length)];
        setCurrentRound({ text: firstTextObj.text, value: firstColorObj.value })
        setRoundCount(1);
        setTimer(timePerRound);
        setIsWrong(null)

        const id2 = setInterval(() => {
            setTimer((prev) => prev - 0.1)
        }, 100)

        const id = setInterval(() => {
            setRoundCount((prevCount) => {
                if (prevCount >= desiredNumber) {
                    clearInterval(id);
                    clearInterval(id2);
                    setCurrentRound({ text: "", value: [] })
                    setHasStarted(false);
                    setRoundCount(0)
                    setIsDone(true);
                    return 0
                }
                setIsWrong(null)
                setTimer(timePerRound)
                setCombinedMatchType(Math.random() <= 0.5 ? "text" : "color");
                const textObj = COLORPOOL[Math.floor(Math.random() * COLORPOOL.length)];
                const colorObj = COLORPOOL[Math.floor(Math.random() * COLORPOOL.length)];
                setCurrentRound({ text: textObj.text, value: colorObj.value });
                setIsWaiting(false);
                setIsDisabled(false);
                return prevCount + 1
            });
        }, timePerRound * 1000)

        return () => {
            clearInterval(id)
            clearInterval(id2)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasStarted, isReset]);

    useEffect(() => {
        localStorage.setItem(
            "savedRunsList-stroop",
            JSON.stringify(savedList),
        );
    }, [savedList]);

    const doIfState = (state: boolean) => {
        if (state) {
            setScore((prev) => prev + 1)
            setIsWaiting(true)
            setCorrectTotal((prev) => prev + 1)
            setIsWrong(false)
        } else if (!state) {
            setIsWaiting(true);
            setWrongTotal((prev) => prev + 1)
            setIsWrong(true)
        }
    }

    const handleClick = (color: string) => {
        if (isWaiting) return;
        if (matchType === "text") {
            if (color === currentRound.text) doIfState(true)
            else doIfState(false)
        } else if (matchType === "color") {
            if (color === currentRound.value[1]) doIfState(true)
            else doIfState(false)
        } else if (matchType === "both") {
            if (combinedMatchType === "text") {
                if (color !== currentRound.text) doIfState(false);
                else doIfState(true)
            } else if (combinedMatchType === "color") {
                if (color !== currentRound.value[1]) doIfState(false);
                else doIfState(true)
            }
        }
        setIsDisabled(true);
    }

    interface SavedRunData {
        score: string;
        unanswered: number;
        timePerRound: number;
        date: string;
    }

    const handleSave = () => {
        const savedInfo: SavedRunData = {
            score: `${correctTotal} / ${desiredNumber}`,
            unanswered: desiredNumber - correctTotal - wrongTotal,
            timePerRound: timePerRound,
            date: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }),
        }
        setSavedList((prev) => [savedInfo, ...prev])
        showToast("You've saved a run.", "save");
    }

    const toggleSelected = (index: number) => {
        if (selectedList.includes(index)) {
            setSelectedList(selectedList.filter((i) => i !== index))
        } else {
            setSelectedList((prev) => [...prev, index])
        }
    }

    const deleteSelected = () => {
        setSavedList(savedList.filter((_, index) => !selectedList.includes(index)))
        setSelectedList([])
        showToast("You've deleted saved run(s).", "delete");
    }

    const gameBoxRef = useRef<HTMLDivElement>(null)
    const mainTitleRef = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        if (hasStarted && matchType && roundCount !== 0) {
            gameBoxRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        } 
        if (isReset) {
            mainTitleRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }
    }, [hasStarted, matchType, roundCount, isReset])

    return (
        <div className="game-board">
            <h1 className="mainTitle-h1" ref={mainTitleRef}>Stroop</h1>
            <ControlPanel
                setDesiredNumber={setDesiredNumber}
                setTimePerRound={setTimePerRound}
                setHasStarted={setHasStarted}
                setMatchType={setMatchType}
                hasStarted={hasStarted}
            />
            {hasStarted && matchType && roundCount !== 0 && (
                <div className="stroop-container" ref={gameBoxRef}>
                    <h2>{roundCount}/{desiredNumber}</h2>
                    <h2>{matchType}</h2>
                    <div className="stroop-ground">
                        <h2 style={{ color: currentRound.value[0] }}>{currentRound.text}</h2>
                        <h2 className="timer-h2">{timer.toFixed(1)} s</h2>
                        {matchType === "both" && <h2 className="combinedMatch-h2">{combinedMatchType}</h2>}
                        <div className="color-grid">
                            {COLORPOOL.map((colorObj, index) => (
                                <button disabled={isDisabled} key={index} style={{ backgroundColor: colorObj.value[0] }} onClick={() => handleClick(colorObj.text)} />
                            ))}
                        </div>
                    </div>
                    <h2 className={isWrong && isWrong !== null ? "visible-result-stroop" : "result-stroop"}>Incorrect ❌</h2>
                    <h2 className={!isWrong && isWrong !== null ? "visible-result-stroop" : "result-stroop"}>Correct ✔️</h2>
                    <h2>score: {score}</h2>
                    <button className="resetButton-btn" onClick={() => setIsReset(true)}>Reset Game</button>
                </div>
            )}
            {isDone && (
                <div className="finished-section">
                    <h2 className="finished-notif">You've finished!</h2>
                    <div className="saved-run-temp stroop">
                        <p>Score: <span className="saved-run-temp-span">{correctTotal} / {desiredNumber}</span></p>
                        <p>Unanswered: <span className="saved-run-temp-span">{desiredNumber - correctTotal - wrongTotal}</span></p>
                        <p>Time per round: <span className="saved-run-temp-span">{timePerRound}</span></p>
                    </div>
                    <button className="finished-related-interactibles play" onClick={() => setHasStarted(true)}>Play again</button>
                    <button className="finished-related-interactibles save" onClick={handleSave}>Save Run</button>
                </div>
            )}
            <div className="saved-runs-section">
                <h2 className="saved-runs-title">Saved Runs:</h2>
                {savedList.map((run, index) => (
                    <SavedRun
                        key={index}
                        score={run.score}
                        unanswered={run.unanswered}
                        timePerRound={run.timePerRound}
                        isSelected={selectedList.includes(index)}
                        toggleSelected={() => toggleSelected(index)}
                    />
                ))}
                {savedList.length < 1 && (
                    <h2>--currently empty--</h2>
                )}
                {selectedList.length > 0 && (
                    <button className="delete-saved-button finished-related-interactibles" onClick={deleteSelected}>Delete Selected</button>
                )}
            </div>
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast-notif toast-notif-${toast.type}`}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
            <GlobalNav />
            <GlobalFooter />
        </div>
    );
}

export default GB_stroop;
