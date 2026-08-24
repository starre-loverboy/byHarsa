/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
interface ControlPanelProps {
    setDesiredNumber: (e: any) => void;
    setTimePerRound: (e: any) => void;
    setHasStarted: (e: boolean) => void;
    setMatchType: (e: string) => void;
    hasStarted: boolean;
}

function ControlPanel({
    setDesiredNumber,
    setTimePerRound,
    setHasStarted,
    setMatchType,
    hasStarted,
}: ControlPanelProps) {
    const [showError, setShowError] = useState<boolean>(false);
    const [tempRounds, setTempRounds] = useState<number>(10);
    const [tempTPR, setTempTPP] = useState<number>(2);
    const [tempMatchType, setTempMatchType] = useState<string>("nil");

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                const roundIsValid = tempRounds >= 1
                const tprIsValid = tempTPR >= 0.1;
                const matchTypeIsValid = tempMatchType !== "nil";
                if (!roundIsValid || !tprIsValid || !matchTypeIsValid) {
                    setShowError(true);
                    return;
                };
                setShowError(false);
                setDesiredNumber(tempRounds);
                setTimePerRound(tempTPR);
                setMatchType(tempMatchType);
                setHasStarted(true);
            }}
        >
            <fieldset disabled={hasStarted} className="fieldsetClass control-panel">
                <label className="stroop-label-cp">Number of rounds:</label>
                <input
                    type="number"
                    min="1"
                    onChange={(e) => setTempRounds(Number(e.target.value))}
                    defaultValue="10"
                />
                <p>min is 1</p>
                <label className="stroop-label-cp">Time per round (seconds):</label>
                <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    onChange={(e) => setTempTPP(Number(e.target.value))}
                    defaultValue="2"
                />
                <p>min is 0.1 s</p>
                <label className="stroop-label-cp">Match type:</label>
                <select id="select-stroop" onChange={(e) => setTempMatchType(e.target.value)} defaultValue="nil">
                    <option value="nil">--match type--</option>
                    <option value="text">match text</option>
                    <option value="color">match color</option>
                    <option value="both">include both</option>
                </select>
                <button type="submit" className="start-button">Start Game</button>
                {showError && (
                    <h2 className="error-h2-stroop">Some inputs are problematic, please fix them.</h2>
                )}
            </fieldset>
        </form>
    );
}

export default ControlPanel;
