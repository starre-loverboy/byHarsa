/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
import { useState, useEffect, useRef } from "react";
import SavedRun from "./SavedRun";
import GlobalFooter from "../../components/GlobalFooter";
import GlobalNav from "../../components/GlobalNav";

function GB_reactionSpeed() {
  const [isError, setIsError] = useState<boolean>(false);
  const [desiredNumber, setDesiredNumber] = useState<number>(5);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [isBlue, setIsBlue] = useState<boolean>(false);
  const [isGreen, setIsGreen] = useState<boolean>(false);
  const [isRed, setIsRed] = useState<boolean>(false);
  const [isGrey, setIsGrey] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [savedList, setSavedList] = useState<SavedRunData[]>(() => {
    const savedRun = localStorage.getItem("savedRunsList-reactionTest");
    return savedRun ? (JSON.parse(savedRun) as SavedRunData[]) : [];
  });
  const [greenTotalState, setGreenTotalState] = useState<number>(0);
  const [redTotalState, setRedTotalState] = useState<number>(0);
  const [reactionTimeList, setReactionTimeList] = useState<number[]>([]);
  const [selectedList, setSelectedList] = useState<number[]>([]);
  const [toasts, setToasts] = useState<
    { id: number; message: string; type: string }[]
  >([]);
  const [orderField, setOrderField] = useState<string>("unsorted");
  const [isDescending, setIsDescending] = useState<boolean>(false);

  const rounds: number[] = [];

  const gameBoxRef = useRef<HTMLDivElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null)

  for (let i = 1; i <= desiredNumber; i++) {
    rounds.push(i);
  }

  const resetEverything = () => {
    setIsDone(false);
    setIsActive(false);
    setCurrentRound(0);
    setGreenTotalState(0);
    setRedTotalState(0);
    setReactionTimeList([]);
    setIsBlue(false);
    setIsRed(false);
    setIsGreen(false);
    setIsGrey(false);
  };
  const startGame = () => {
    resetEverything();
    if (desiredNumber < 1) {
      setIsError(true);
      return;
    }
    setIsActive(true);
    setCurrentRound(1);
    setIsError(false);
  };

  const showToast = (message: string, type: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((i) => i.id !== id));
    }, 1500);
  };

  const startTimeRef = useRef<number>(0);
  const isWaitingRef = useRef<boolean>(false);

  // basically everything
  useEffect(() => {
    if (!isActive) return;
    if (currentRound > desiredNumber) {
      setIsDone(true);
      setIsActive(false);
      return;
    }

    setIsGrey(true);
    setIsDone(false);
    setReactionTime(0);
    setIsGreen(false);
    setIsRed(false);
    setIsBlue(false);
    isWaitingRef.current = false;

    const randomNum = Math.random() * 2 + 2;

    const greenTimer = setTimeout(() => {
      setIsGreen(true);
      startTimeRef.current = Date.now();
    }, randomNum * 1000);

    return () => {
      clearTimeout(greenTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound, isActive]);

  // saving mechanism
  useEffect(() => {
    localStorage.setItem(
      "savedRunsList-reactionTest",
      JSON.stringify(savedList),
    );
  }, [savedList]);

  const onBoxClick = () => {
    if (isGrey) setIsGrey(true);
    if (isWaitingRef.current) return;
    if (!isGreen) {
      isWaitingRef.current = true;
      setIsRed(true);
      setReactionTime(0);
      setTimeout(() => {
        setCurrentRound((prev) => prev + 1);
      }, 750);
      setRedTotalState((prev) => prev + 1);
      return;
    }
    if (!isActive) return;

    isWaitingRef.current = true;
    const newGap = Date.now() - startTimeRef.current;
    setReactionTime(newGap);
    setGreenTotalState((prev) => prev + 1);
    setReactionTimeList((prev) => [...prev, newGap]);
    setIsBlue(true);
    setTimeout(() => {
      setCurrentRound((prev) => prev + 1);
    }, 1500);
  };

  interface SavedRunData {
    fastest: number;
    slowest: number;
    average: number;
    redTotal: number;
    greenTotal: number;
    date: string;
  }

  const sortedReactionTimeList = [...reactionTimeList].sort((a, b) => b - a);
  const summedReactionTime = [...reactionTimeList].reduce(
    (sum, t) => sum + t,
    0,
  );

  const onSave = () => {
    const savedInfo = {
      fastest: sortedReactionTimeList.at(-1) ?? 0,
      slowest: sortedReactionTimeList[0] ?? 0,
      average: (summedReactionTime / greenTotalState).toFixed(0),
      redTotal: redTotalState,
      greenTotal: greenTotalState,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    };
    setSavedList((prev) => [savedInfo, ...prev] as SavedRunData[]);
    showToast("You've saved a run.", "save");
  };

  const toggleSelected = (index: number) => {
    if (selectedList.includes(index)) {
      setSelectedList(selectedList.filter((i) => i !== index));
    } else {
      setSelectedList((prev) => [...prev, index]);
    }
  };

  const deleteSelected = () => {
    setSavedList(savedList.filter((_, index) => !selectedList.includes(index)));
    setSelectedList([]);
    showToast("You've deleted saved run(s).", "delete");
  };

  const sortedList = [...savedList].sort((a, b) => {
    if (orderField === "time") return b.fastest - a.fastest;
    else if (orderField === "average") return (b.average - a.average) as number;
    else if (orderField === "greens") return b.greenTotal - a.greenTotal;
    else return 0;
  });

  if (!isDescending) sortedList.reverse();

  return (
    <div className="game-board">
      <h1 className="mainTitle-h1" ref={mainTitleRef}>Reaction Speed Test</h1>
      <div className="control-panel">
        <label>Rounds Per Session:</label>
        <input
          type="number"
          defaultValue="5"
          onChange={(e) => setDesiredNumber(Math.floor(Number(e.target.value)))}
          min="1"
        />
        <button onClick={() => {
          startGame()
          gameBoxRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          })
        }} className="start-button">Start Game</button>
        {isError && <p>Input a number above 0!</p>}
      </div>
      <div className="reaction-ground" ref={gameBoxRef}>
        {!isActive && (
          <div className="reaction-placeholder">
            <h2>--The game will play here!--</h2>
          </div>
        )}
        {isActive && !isError && (
          <>
            {rounds.map(
              (num) =>
                num === currentRound && (
                  <div
                    key={num}
                    className={`reaction-box green-${isGreen} red-${isRed} blue-${isBlue}`}
                    onClick={onBoxClick}
                  >
                    <h2 id="reaction-box-info">
                      {!isGreen && !isRed && isGrey && "Wait for green..."}
                      {isGreen && !isBlue && !isRed && "Click!"}
                      {isBlue && !isRed
                        ? reactionTime === 0
                          ? ""
                          : `${reactionTime} ms`
                        : ""}
                      {isRed && "TOO EARLY!"}
                    </h2>
                  </div>
                ),
            )}
          </>
        )}
      </div>
      {isActive && (
        <div className="sec-control-panel">
          <button
            className="refresh-board-button reset"
            onClick={() => {
              resetEverything()
              mainTitleRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center"
              })
            }}
          >
            Reset Game
          </button>
        </div>
      )}
      {isDone && (
        <div className="finished-section">
          <h2 className="finished-notif">Congrats, you've finished!</h2>
          <div className="saved-run-temp reaction-speed">
            <p>Fastest: <span className="saved-run-temp-span">{sortedReactionTimeList.at(-1) ?? 0} ms</span></p>
            <p>Slowest: <span className="saved-run-temp-span">{sortedReactionTimeList[0] ?? 0} ms</span></p>
            <p>
              Avg:{" "}
              <span className="saved-run-temp-span">
                {greenTotalState === 0
                  ? "---"
                  : `${(summedReactionTime / greenTotalState).toFixed(0)} ms`}
              </span>
            </p>
            <p>Greens: <span className="saved-run-temp-span">{greenTotalState}</span></p>
            <p>Total: <span className="saved-run-temp-span">{redTotalState + greenTotalState}</span></p>
          </div>
          <button className="finished-related-interactibles play" onClick={startGame}>
            Play Again
          </button>
          <button className="save finished-related-interactibles" onClick={onSave}>
            Save Run
          </button>
        </div>
      )}
      <div className="saved-runs-section">
        <h2 className="saved-runs-title">Saved Runs:</h2>
        {savedList.length > 1 && (
          <div>
            <select onChange={(e) => setOrderField(e.target.value)}>
              <option value="unsorted">--unsorted--</option>
              <option value="time">time</option>
              <option value="average">average</option>
              <option value="greens">greens</option>
            </select>
            {orderField !== "unsorted" && (
              <select
                onChange={(e) => setIsDescending(e.target.value === "true")}
              >
                <option value="false">ascending</option>
                <option value="true">descending</option>
              </select>
            )}
          </div>
        )}
        {sortedList.map((run, index) => (
          <SavedRun
            key={index}
            fastest={run.fastest}
            slowest={run.slowest}
            avg={run.average}
            redTotal={run.redTotal}
            greenTotal={run.greenTotal}
            date={run.date}
            isSelected={selectedList.includes(index)}
            onSelect={() => toggleSelected(index)}
            summedReactionTime={summedReactionTime}
          />
        ))}
        {savedList.length === 0 && <p>--currently empty--</p>}
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

export default GB_reactionSpeed;
