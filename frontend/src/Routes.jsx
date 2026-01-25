import { Routes, Route } from "react-router-dom";

import WordleClone from "./games/Wordle";
import Emoji from "./games/Emoji";
import MemeDecoder from "./games/MemeDecoder/App";
import MonkeyType from "./games/MonkeyType/App";
import Pacman from "./games/Pacman/App";
import LandingPage from "./LandingPage";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/wordle" element={<WordleClone />} />
      <Route path="/Emoji" element={<Emoji />} />
      <Route path="/MemeDecoder" element={<MemeDecoder />} />
      <Route path="/MonkeyType" element={<MonkeyType />} />
      <Route path="/pacman" element={<Pacman />} />
    </Routes>
  );
}

export default App;
