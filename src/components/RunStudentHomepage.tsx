import React, { useState } from "react";
import SettingsPage from "./SettingsPage";
import StudentHomepage from "./StudentHomepage";
import "./RunStudentHomepage.css";
function RunStudentHomepage() {
  const [showSettings, setShowSettings] = useState(false);

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  return (
    <div>
      <StudentHomepage SettingsButton={openSettings} />
      {showSettings && (
        <div className="centersettings">
          <div className="settingswindow">
            <button className="closeButton" onClick={closeSettings}>
              Close
            </button>

            <SettingsPage />
          </div>
        </div>
      )}
    </div>
  );
}

export default RunStudentHomepage;
