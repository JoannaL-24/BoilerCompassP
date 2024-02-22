import "./App.css";
import ReactDOM from "react-dom";
import React, { useState } from "react";
import SettingsPage from "./components/SettingsPage";
import StudentHomepage from "./components/StudentHomepage";
import RunStudentHomepage from "./components/RunStudentHomepage";
import AdvisorHomepage from "./components/AdvisorHomepage";
import AdvisorHomepageFilter from "./components/AdvisorHomepageFilter";

function App() {
  //return <RunStudentHomepage></RunStudentHomepage>;
  return <AdvisorHomepage></AdvisorHomepage>;
}

export default App;
