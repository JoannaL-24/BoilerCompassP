import './App.css';
import CourseList from "./components/CourseList";
import DarkModeToggle from './components/DarkModeToggle';
import Sidebar from './components/Sidebar'
import CoursePopup from './components/CoursePopup/CoursePopup'
import "./App.css";
import React from "react";
import ReactDOM from "react-dom";
import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import ProfileSetupStudent from "./pages/ProfileSetupStudent";
import ProfileSetupAdvisor from "./pages/ProfileSetupAdvisor";
import CoverPage from "./pages/CoverPage";
import DegreePlanner from "./pages/DegreePlanner";
import SettingsPage from "./components/SettingsPage";
import StudentHomepage from "./components/StudentHomepage";
import RunStudentHomepage from "./components/RunStudentHomepage";
import AdvisorHomepage from "./components/AdvisorHomepage";
import AdvisorHomepageFilter from "./components/AdvisorHomepageFilter";
import DeleteAccount from "./components/DeleteAccount";
import DraggableCourse from "./components/DraggableCourse";
import { ODataProvider } from "./components/contexts/ODataContext"

function App() {
  //return <AdvisorHomepage />;
  //return <DeleteAccount />;
  // return <DraggableCourse />;

  // return <DeleteAccount />;
  return (
    <ODataProvider >
      <div className="App">
        <header className="App-header">
          <DarkModeToggle />
          <Sidebar />
          <CoursePopup />
        </header>
        <Routes>
          <Route path="/DegreePlanner" element={<DegreePlanner />} />
          <Route path="/" element={<DegreePlanner />} />
          <Route path="/Welcome" element={<Welcome />} />
          <Route path="/profile-setup-student" element={<ProfileSetupStudent />}
          />
          <Route
            path="/profile-setup-advisor"
            element={<ProfileSetupAdvisor />}
          />
        </Routes>
      </div>
    </ODataProvider>
  );

  // return <RunStudentHomepage></RunStudentHomepage>;
  // return <DegreePlanner/>
}

export default App;
