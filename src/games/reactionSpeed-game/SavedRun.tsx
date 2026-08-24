interface SavedRunProps {
  fastest: number;
  slowest: number;
  avg: number;
  redTotal: number;
  greenTotal: number;
  date: string;
  isSelected: boolean;
  onSelect: () => void;
  summedReactionTime: number;
}

function SavedRun({
  fastest,
  slowest,
  avg,
  redTotal,
  greenTotal,
  date,
  isSelected,
  onSelect,
}: SavedRunProps) {
  return (
    <div className="saved-run">
      <div className="run-metric-group">
        <span className="metric-label">Fastest:</span>
        <span className="saved-run-span">{fastest} ms</span>
      </div>
      <div className="run-metric-group">
        <span className="metric-label">Slowest:</span>
        <span className="saved-run-span">{slowest} ms</span>
      </div>
      <div className="run-metric-group">
        <span className="metric-label">Avg:</span>
        <span className="saved-run-span">
          {greenTotal === 0 ? "---" : `${avg} ms`}
        </span>
      </div>
      <div className="run-metric-group">
        <span className="metric-label">Reds:</span>
        <span className="saved-run-span">{redTotal}</span>
      </div>
      <div className="run-metric-group">
        <span className="metric-label">Greens:</span>
        <span className="saved-run-span">{greenTotal}</span>
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
