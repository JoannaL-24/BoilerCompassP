import React, { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
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
            <div className="closebuttonposition">
              <ButtonGroup
                orientation="vertical"
                aria-label="Vertical button group"
                style={{ alignSelf: "flex-start", marginRight: "1px" }}
              >
                <Button onClick={closeSettings}>Close</Button>
              </ButtonGroup>
            </div>
            <SettingsPage />
          </div>
        </div>
      )}
    </div>
  );
}

export default RunStudentHomepage;
