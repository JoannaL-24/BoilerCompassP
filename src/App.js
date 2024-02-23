import "./App.css";
import ReactDOM from "react-dom";
import React, { useState } from "react";
import CoverPage from "./pages/CoverPage";
import DegreePlanner from "./pages/DegreePlanner";
import SettingsPage from "./components/SettingsPage";
import StudentHomepage from "./components/StudentHomepage";
import RunStudentHomepage from "./components/RunStudentHomepage";

function App() {
  // return <RunStudentHomepage></RunStudentHomepage>;
  return <DegreePlanner/>
}

export default App;
