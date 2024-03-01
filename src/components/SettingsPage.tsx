import React, { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link, useLocation } from "react-router-dom";
import DeleteAccount from "./DeleteAccount";
import { useAuth } from "../components/contexts/AuthContext";
import { PfpForm } from "./PfpForm";

function GeneralSettings() {
  return <div>{/* Add general settings content here */}</div>;
}

function AppearanceSettings() {
  return <div>{/* Add appearance settings content here */}</div>;
}

function SettingsPage() {
  const [currentSettings, setCurrentSettings] = useState("General");
  const location = useLocation();
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

  const previousPage = location.state ? location.state.previousPage : "/";

  return (
    <div className="settingsContainer">
      <div className="settingsColumn">
        <div className="settingstextposition">
          {currentSettings === "General" && (
            <h1 className="settingsTitle">Settings</h1>
          )}
          {/* {currentSettings === "Appearance" && (
            <h1 className="settingsTitle">Appearance</h1>
          )} */}
        </div>
        <div style={{ marginLeft: "800px" }}>
          {" "}
          <Link to={previousPage} style={{ textDecoration: "none" }}>
            <Button>Close</Button>
          </Link>
        </div>

        <div style={{ position: "relative", top: "100px", left: "-380px" }}>
          <DeleteAccount />
        </div>

        {/* Add more buttons for other settings aspects if needed */}
      </div>
      <div className="settingsContent">{renderSettings()}</div>
    </div>
  );
}

export default SettingsPage;
