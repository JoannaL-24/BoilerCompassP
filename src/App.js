import './App.css';
import DarkModeToggle  from './components/DarkModeToggle/DarkModeToggle';
import Sidebar from './components/Sidebar'
import CoursePopup from './components/CoursePopup/CoursePopup'
import "./App.css";
import React from "react";
import ReactDOM from "react-dom";
import { Routes, Route } from "react-router-dom";
import Welcome from "./components/Welcome";
import ProfileSetupStudent from "./components/Profile_setup_student";
import ProfileSetupAdvisor from "./components/Profile_setup_advisor";
import CoverPage from "./pages/CoverPage";
import DegreePlanner from "./pages/DegreePlanner";
import SettingsPage from "./components/SettingsPage";
import StudentHomepage from "./components/StudentHomepage";
import RunStudentHomepage from "./components/RunStudentHomepage";
import AdvisorHomepage from "./components/AdvisorHomepage";
import AdvisorHomepageFilter from "./components/AdvisorHomepageFilter";
import DeleteAccount from "./components/DeleteAccount";

function App() {
  //return <AdvisorHomepage />;
  // return <DeleteAccount />;
  return (
    
    <div className="App">
      <header className="App-header">
        <DarkModeToggle />
        <Sidebar/>
        <CoursePopup/>
      </header>
      <Routes>
        <Route path="/" element={<DegreePlanner />} />
        <Route path="/Welcome" element={<Welcome />} />
        <Route
          path="/profile-setup-student"
          element={<ProfileSetupStudent />}
        />
        <Route
          path="/profile-setup-advisor"
          element={<ProfileSetupAdvisor />}
        />
      </Routes>
    </div>
    
    
  );
  // return (
  //   <div>
  //     {/* <DarkModeToggle/> */}
  //     <DegreePlanner/>
  //   </div>
  // );
}

export default App;
