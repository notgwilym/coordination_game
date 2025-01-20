import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./HomePage";
import WaitingPage from "./WaitingPage";
import HostPage from "./HostPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/waiting/:roomCode" element={<WaitingPage />} />
        <Route path="/host/:roomCode" element={<HostPage />} />
      </Routes>
    </Router>
  );
}

export default App;