import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import GB_memoryCard from "./games/memoryCard-game/GB_memoryCard";
import GB_reactionSpeed from "./games/reactionSpeed-game/GB_reactionSpeed";
import GB_stroop from "./games/stroop-game/GB_stroop";
import GB_aimTrainer from "./games/aimTrainer-game/GB_aimTrainer";
import GB_programmerClicker from "./games/programmerClicker-game/GB_programmerClicker";

function App() {
  return (
    <div className="real-body">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/memoryCard" element={<GB_memoryCard />} />
        <Route path="/reactionSpeed" element={<GB_reactionSpeed />} />
        <Route path="/stroop" element={<GB_stroop />} />
        <Route path="/aimTrainer" element={<GB_aimTrainer />} />
        <Route path="/programmerClicker" element={<GB_programmerClicker />} />
      </Routes>
    </div>
  );
}

export default App;
