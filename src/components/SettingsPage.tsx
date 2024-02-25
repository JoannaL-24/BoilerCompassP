import React, { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import SettingsIcon from "@mui/icons-material/Settings";

function GeneralSettings() {
  return <div>{/* Add general settings content here */}</div>;
}

function AppearanceSettings() {
  return <div>{/* Add appearance settings content here */}</div>;
}

function SettingsPage() {
  const [currentSettings, setCurrentSettings] = useState("General");

  const renderSettings = () => {
    switch (currentSettings) {
      case "General":
        return <GeneralSettings />;
      case "Appearance":
        return <AppearanceSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="settingsContainer">
      <div className="settingsColumn">
        <div className="settingstextposition">
          {currentSettings === "General" && (
            <h1 className="settingsTitle">Settings</h1>
          )}
          {currentSettings === "Appearance" && (
            <h1 className="settingsTitle">Appearance</h1>
          )}
        </div>
        <ButtonGroup orientation="vertical" aria-label="Vertical button group">
          <Button onClick={() => setCurrentSettings("General")}>General</Button>
          <Button onClick={() => setCurrentSettings("Appearance")}>
            Appearance
          </Button>
        </ButtonGroup>
        {/* Add more buttons for other settings aspects if needed */}
      </div>
      <div className="settingsContent">{renderSettings()}</div>
    </div>
  );
}

export default SettingsPage;
