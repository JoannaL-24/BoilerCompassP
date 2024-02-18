import React, { useState } from "react";

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
        {currentSettings === "General" && (
          <h1 className="settingsTitle">Settings</h1>
        )}
        {currentSettings === "Appearance" && (
          <h1 className="settingsTitle">Appearance</h1>
        )}
        <button onClick={() => setCurrentSettings("General")}>General</button>
        <button onClick={() => setCurrentSettings("Appearance")}>
          Appearance
        </button>
        {/* Add more buttons for other settings aspects if needed */}
      </div>
      <div className="settingsContent">{renderSettings()}</div>
    </div>
  );
}

export default SettingsPage;
