import { useEffect } from "react";

interface SavedRunProps {
  time: number;
  attempts: number;
  boardSize: number;
  date: string;
  isSelected: boolean;
  onSelect: () => void;
}

function SavedRun({ time, attempts, boardSize, date, isSelected, onSelect }: SavedRunProps) {

  useEffect(() => {
    if (isSelected) console.log("The item is selected");
  }, [isSelected]);

  return (
    <div className="saved-run">
      <div className="run-metric-group">
        <span className="metric-label">time:</span>
        <span className="saved-run-span">{(time / 1000).toFixed(2)} s</span>
      </div>
      <div className="run-metric-group">
        <span className="metric-label">Attempts:</span>
        <span className="saved-run-span">{attempts}</span>
      </div>
      <div className="run-metric-group">
        <span className="metric-label">Board Size:</span>
        <span className="saved-run-span">{boardSize}</span>
      </div>
      <div className="run-metric-group">
        <span className="saved-run-span">{date}</span>
      </div>
      <button className={isSelected ? "select-button selected" : "select-button unselected"} onClick={onSelect}>
        {isSelected ? "🟢" : "🔴"}
      </button>
    </div>
  );
}

export default SavedRun;
