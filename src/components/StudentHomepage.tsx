import React from "react";
import Button from "@mui/material/Button";

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
      <Button
        onClick={SettingsButton}
        variant="contained"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
      >
        Settings
      </Button>
    </div>
  );
}

export default StudentHomepage;
