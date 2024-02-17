import React from "react";

interface StudentHomepageActions {
  SettingsButton: () => void;
}

function StudentHomepage({ SettingsButton }: StudentHomepageActions) {
  return (
    <div style={{ position: "relative" }}>
      <h1
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        Schedules
      </h1>
      <button
        onClick={SettingsButton}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
      >
        Settings
      </button>
    </div>
  );
}

export default StudentHomepage;
