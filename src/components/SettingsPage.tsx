import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link, useLocation } from "react-router-dom";
import DeleteAccount from "./DeleteAccount";
import { useAuth } from "../components/contexts/AuthContext";
import { PfpForm } from "./PfpForm";
import DegreePlanner from "pages/DegreePlanner";
import "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../models/firebase.ts";
import { getFirestore, collection, getDoc } from "firebase/firestore";

function GeneralSettings() {
  return <div>{/* Add general settings content here */}</div>;
}

function AppearanceSettings() {
  return <div>{/* Add appearance settings content here */}</div>;
}

function SettingsPage() {
  const [currentSettings, setCurrentSettings] = useState("General");
  const location = useLocation();
  const { currentUser } = useAuth();
  const [userTypeValue, setUserTypeValue] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const uid = currentUser.uid;

        const db = getFirestore();

        const userDocRef = doc(db, "users", uid);

        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData && userData.user_type) {
            const userTypeValue = userData.user_type;
            setUserTypeValue(userTypeValue);
          } else {
            console.log("User document does not contain user_type field.");
          }
        } else {
          console.log("User document does not exist.");
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

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
        {userTypeValue === "student" ? (
          <div style={{ marginLeft: "700px" }}>
            <Link to="/DegreePlanner" style={{ textDecoration: "none" }}>
              <Button>Close</Button>
            </Link>
          </div>
        ) : userTypeValue === "advisor" ? (
          <div style={{ marginLeft: "700px" }}>
            <Link to="/AdvisorHomepage" style={{ textDecoration: "none" }}>
              <Button>Close</Button>
            </Link>
          </div>
        ) : (
          <div style={{ marginLeft: "700px" }}>
            <Link to="/DegreePlanner" style={{ textDecoration: "none" }}>
              <Button>Close</Button>
            </Link>
          </div>
        )}

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
