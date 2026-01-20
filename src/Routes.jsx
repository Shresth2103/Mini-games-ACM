import { Routes, Route } from "react-router-dom";

import WordleClone from "./games/Wordle";
import Emoji from "./games/Emoji";
import MemeDecoder from "./games/MemeDecoder";
import MonkeyType from "./games/Monkeytype";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}

      <Route path="/wordle" element={<WordleClone />} />
      <Route path="/Emoji" element={<Emoji />} />
      <Route path="/MemeDecoder" element={<MemeDecoder />} />
      <Route path="/wordle" element={<WordleClone />} />
      <Route path="/MonkeyType" element={<MonkeyType />} />
    </Routes>
  );
}

export default App;
