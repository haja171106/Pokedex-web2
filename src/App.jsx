import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pokedex from "./components/Pokedex.jsx";
import PokemonState from "./pages/PokemonState.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/pokemon/:name" element={<PokemonState />} />
      </Routes>
    </Router>
  );
}

export default App;
