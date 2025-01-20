import React from "react";
import ReactDOM from "react-dom";
import App from './components/App';
import { PlayerProvider } from "./components/PlayerContext";

ReactDOM.render(
  <React.StrictMode>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </React.StrictMode>,
  document.getElementById("root")
);