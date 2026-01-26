import { Routes, Route } from "react-router-dom";

import LandingPage from "./LandingPage";
import GameSequence from "./GameSequence";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import { GameProvider } from "./GameContext";

function App() {
  return (
    <GameProvider>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/monkeytype" element={<GameSequence />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </GameProvider>
  );
}

export default App;
