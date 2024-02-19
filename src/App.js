import logo from "./logo.svg";
import "./App.css";
import ReactDOM from "react-dom";
import React, { useState } from "react";
import SettingsPage from "./components/SettingsPage";
import StudentHomepage from "./components/StudentHomepage";
import CoverPage from "./components/CoverPage";

function App() {
  const [showSettings, setShowSettings] = useState(false);

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  return (
    <div>
      <CoverPage></CoverPage>
      {/* <StudentHomepage SettingsButton={openSettings} />
      {showSettings && (
        <div className="centersettings">
          <div
            className="settingswindow"
            style={{ width: "20%", height: "60" }}
          >
            <SettingsPage />
            <button onClick={closeSettings}>Close</button>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default App;
