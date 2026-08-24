import { useState, useEffect, useRef } from "react";

interface EmojiShownProps {
  maxNumber: number;
  desiredNumber: number;
  setDesiredNumber: (val: number) => void;
  setCounterValue: (callback: (prev: number) => number) => void;
  clearBoard: () => void;
  refreshEverything: () => void;
}

function ControlPanel({
  maxNumber,
  desiredNumber,
  setDesiredNumber,
  setCounterValue,
  clearBoard,
  refreshEverything
}: EmojiShownProps) {
  const [isError, setIsError] = useState<boolean>(false);
  const [tempValue, setTempValue] = useState<number>(desiredNumber);
  const tempValueInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.target === tempValueInput.current) {
        refreshEverything();
        setDesiredNumber(tempValue);
      }
    }
    window.addEventListener('keydown', handleEnter);
    return () => window.removeEventListener('keydown', handleEnter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempValue]);

  const handleClick = () => {
    if (tempValue % 2 === 0 && tempValue <= maxNumber && 6 <= tempValue) {
      setIsError(false);
      clearBoard();
      if (tempValue === desiredNumber) {
        setCounterValue((prev: number) => prev + 1);
      } else {
        setDesiredNumber(tempValue);
      }
    } else {
      setIsError(true);
    }
  };

  return (
    <>
      <input
        className="desired-number-input"
        type="number"
        min="6"
        max={maxNumber}
        value={tempValue}
        onChange={(e) => setTempValue(Number(e.target.value) || 0)}
        ref={tempValueInput}
      />
      <span>Min = 6, Max = {maxNumber}, Must Be Even!</span>

      <button className="start-button" onClick={handleClick}>
        Start Game
      </button>
      {isError && <label>Enter an even number between 6 and {maxNumber}</label>}
    </>
  );
}

export default ControlPanel;
