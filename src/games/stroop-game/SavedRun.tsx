interface SavedRunProps {
  score: string;
  unanswered: number;
  timePerRound: number;
  isSelected: boolean;
  toggleSelected: () => void;
}

function SavedRun({ score, unanswered, timePerRound, isSelected, toggleSelected }: SavedRunProps) {
  return (
    <div className="saved-run">
      <div className="run-metric-group">
        <span className="metric-label">Score:</span>
        <span className="saved-run-span">{score}</span>
      </div>
      <div className="run-metric-group">
        <span className="metric-label">Unanswered:</span>
        <span className="saved-run-span">{unanswered}</span>
      </div>
      <div className="run-metric-group">
        <span className="metric-label">Time per round:</span>
        <span className="saved-run-span">{timePerRound} s</span>
      </div>
      <button className={isSelected ? "select-button selected" : "select-button unselected"} onClick={toggleSelected}>
        {isSelected ? "🟢" : "🔴"}
      </button>
    </div>
  );
}

export default SavedRun;
