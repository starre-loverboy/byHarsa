/* eslint-disable react-hooks/purity */
import { useState, useMemo, useEffect, useRef } from "react";
import IndividualCards from "./IndividualCards";
import EMOJI_LIST from "./EMOJI_LIST";
import ControlPanel from "./ControlPanel";
import SavedRun from "./SavedRun";
import GlobalFooter from "../../components/GlobalFooter";
import GlobalNav from "../../components/GlobalNav";

function GB_memoryCard() {
  const [counterValue, setCounterValue] = useState<number>(0);
  const [desiredNumber, setDesiredNumber] = useState<number>(6);
  const [clickedIndex, setClickedIndex] = useState<number[]>([]);
  const [allOpenIndex, setAllOpenIndex] = useState<number[]>([]);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [isTicking, setIsTicking] = useState<boolean>(false);
  const [savedList, setSavedList] = useState<SavedRunData[]>(() => {
    const savedJSONList = localStorage.getItem("savedRunsList-memoryCard");
    return savedJSONList ? (JSON.parse(savedJSONList) as SavedRunData[]) : [];
  });
  const [sortValue, setSortValue] = useState<
    "fastest" | "slowest" | "unsorted"
  >("unsorted");
  //saving mechanism
  const [selectedList, setSelectedList] = useState<number[]>([]);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: string }[]>([]);

  const showToast = (message: string, type: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1500);
  };

  const toggleSelected = (index: number) => {
    if (selectedList.includes(index)) {
      setSelectedList(selectedList.filter((i) => i !== index));
    } else {
      setSelectedList([...selectedList, index]);
    }
  };

  const deleteSelected = () => {
    setSavedList(savedList.filter((_, index) => !selectedList.includes(index)));
    setSelectedList([]);
    showToast("Your saved run(s) have been deleted.", 'delete');
  };

  const refreshButton = useRef<HTMLButtonElement>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // saved runs localStorage
  useEffect(() => {
    localStorage.setItem("savedRunsList-memoryCard", JSON.stringify(savedList));
  }, [savedList]);

  // timer mechanism
  useEffect(() => {
    if (isTicking) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTicking]);

  const clearBoard = () => {
    setIsTicking(false);
    setClickedIndex([]);
    setAllOpenIndex([]);
    setIsDone(false);
    setAttempts(0);
    setTime(0);
    showToast("Your board has been reshuffled.", 'refresh');
  };
  const refreshEverything = () => {
    clearBoard();
    setCounterValue((prev) => prev + 1);
  };

  const dupeEmojis = useMemo(() => {
    const chosenEmojis: number[] = [];
    while (chosenEmojis.length < desiredNumber / 2) {
      const emojiId = Math.floor(Math.random() * EMOJI_LIST.length);
      if (!chosenEmojis.includes(emojiId)) {
        chosenEmojis.push(emojiId);
      }
    }
    return [...chosenEmojis, ...chosenEmojis].sort(() => Math.random() - 0.5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desiredNumber, counterValue]);

  const onCardClick = (currentIndex: number) => {
    if (allOpenIndex.includes(currentIndex)) return;
    if (clickedIndex.includes(currentIndex)) return;
    if (clickedIndex.length >= 2) return;

    setAttempts((prev) => prev + 1);

    const newIndexList: number[] = [...clickedIndex, currentIndex];
    setClickedIndex([...newIndexList]);

    if (newIndexList.length === 1 && !isTicking) setIsTicking(true);
    if (newIndexList.length === 2) {
      const firstEmoji = EMOJI_LIST[dupeEmojis[newIndexList[0]]].form;
      const secondEmoji = EMOJI_LIST[dupeEmojis[newIndexList[1]]].form;

      if (firstEmoji === secondEmoji) {
        const newAllOpen = [...allOpenIndex, ...newIndexList];
        setAllOpenIndex([...newAllOpen]);
        setClickedIndex([]);
        setIsDone(newAllOpen.length === dupeEmojis.length);
        if (newAllOpen.length === dupeEmojis.length) {
          setIsTicking(false);
        }
      } else {
        setTimeout(() => {
          setClickedIndex([]);
          setAllOpenIndex([]);
        }, 1000);
      }
    }
  };

  interface SavedRunData {
    time: number;
    attempts: number;
    boardSize: number;
    date: string;
  }
  // time, attempts, board size, date
  const onSave = () => {
    const savedInfo = {
      time: time,
      attempts: attempts,
      boardSize: desiredNumber,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }),
    };
    setSavedList((prev) => [savedInfo, ...prev]);
    showToast("You have saved a run.", 'save');
  };

  // keyboard event
  useEffect(() => {
    const handleResetShortcut = (e: KeyboardEvent) => {
      if (e.key === "r" && (e.target === document.body || e.target === refreshButton.current)) refreshEverything();
    };
    window.addEventListener("keydown", handleResetShortcut);
    return () => window.removeEventListener("keydown", handleResetShortcut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedList = [...savedList].sort((a, b) => {
    if (sortValue === "fastest") return a.time - b.time;
    else if (sortValue === "slowest") return b.time - a.time;
    else return 0;
  });

  return (
    <div className="game-board">
      <h1 className="mainTitle-h1">Memory Card Game</h1>
      <div className="control-panel">
        <label>Current Board Size: {desiredNumber}</label>

        <ControlPanel
          maxNumber={EMOJI_LIST.length * 2}
          desiredNumber={desiredNumber}
          setDesiredNumber={setDesiredNumber}
          setCounterValue={setCounterValue}
          clearBoard={clearBoard}
          refreshEverything={refreshEverything}
        />
      </div>
      <div className="current-stats-section">
        <h2 className="attempts-text">Attempts: {attempts}</h2>
        <h2 className="timer-text">Time: {(time / 1000).toFixed(2)} s</h2>
      </div>
      <div className="grid-emojis">
        {dupeEmojis.map((id, index) => (
          <IndividualCards
            index={index}
            key={`${id}-${index}`}
            id={id}
            form={EMOJI_LIST[id].form}
            isOpen={
              clickedIndex.includes(index) || allOpenIndex.includes(index)
            }
            onCardClick={onCardClick}
          />
        ))}
      </div>
      <div className="sec-control-panel">
        {!isDone && (
          <>
            <button
              className="refresh-board-button"
              onClick={refreshEverything}
              ref={refreshButton}
            >
              Refresh Board
            </button>
          </>
        )}
      </div>
      {isDone && (
        <div className="finished-section">
          <h2 className="finished-notif">The game is done!</h2>
          <h2>YOUR SCORE: {((desiredNumber / attempts) * 100).toFixed(2)}%</h2>
          <div className="saved-run-temp">
            <p>Time: <span className="saved-run-temp-span">{(time / 1000).toFixed(2)} s</span></p>
            <p>Attempts: <span className="saved-run-temp-span">{attempts}</span></p>
            <p>Board Size: <span className="saved-run-temp-span">{desiredNumber}</span></p>
          </div>
          <button className="play finished-related-interactibles" onClick={refreshEverything}>
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
          <select
            onChange={(e) =>
              setSortValue(e.target.value as "unsorted" | "fastest" | "slowest")
            }
          >
            <option value="unsorted">-- unsorted --</option>
            <option value="fastest">fastest time</option>
            <option value="slowest">slowest time</option>
          </select>
        )}
        {sortedList.map((run, index) => (
          <SavedRun
            key={index}
            time={run.time}
            attempts={run.attempts}
            boardSize={run.boardSize}
            date={run.date}
            isSelected={selectedList.includes(index)}
            onSelect={() => toggleSelected(index)}
          />
        ))}
        {selectedList.length > 0 && (
          <button className="delete-saved-button finished-related-interactibles" onClick={deleteSelected}>Delete Selected</button>
        )}
        {sortedList.length === 0 && <p>--Currently Empty--</p>}
      </div>
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-notif toast-notif-${toast.type}`}>{toast.message}</div>
        ))}
      </div>
      <GlobalNav />
      <GlobalFooter />
    </div>
  );
}

export default GB_memoryCard;
