interface SavedRunProps {
    fastest: number;
    slowest: number;
    avg: number;
    total: number;
    count: number;
    date: string;
    isSelected: boolean;
    toggleSelected: () => void;
}

function SavedRun({ fastest, slowest, avg, total, count, date, isSelected, toggleSelected }: SavedRunProps) {
    return (
        <div className="saved-run">
            <div className="run-metric-group">
                <span className="metric-label">fastest:</span>
                <span className="saved-run-span">{fastest} ms</span>
            </div>
            <div className="run-metric-group">
                <span className="metric-label">slowest:</span>
                <span className="saved-run-span">{slowest} ms</span>
            </div>
            <div className="run-metric-group">
                <span className="metric-label">avg:</span>
                <span className="saved-run-span">{avg} ms</span>
            </div>
            <div className="run-metric-group">
                <span className="metric-label">total time:</span>
                <span className="saved-run-span">{total.toFixed(1)} s</span>
            </div>
            <div className="run-metric-group">
                <span className="metric-label">count:</span>
                <span className="saved-run-span">{count}</span>
            </div>
            <div className="run-metric-group">
                <span className="saved-run-span">{date}</span>
            </div>
            <button className={isSelected ? "select-button selected" : "select-button unselected"} onClick={toggleSelected}>
                {isSelected ? "🟢" : "🔴"}
            </button>
        </div>
    );
}

export default SavedRun;
