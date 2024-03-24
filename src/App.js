import "./App.css";
// import CourseList from "./components/CourseList";
import CoursePopup from './components/CoursePopup/CoursePopup'
import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import ProfileSetupStudent from "./pages/ProfileSetupStudent";
import ProfileSetupAdvisor from "./pages/ProfileSetupAdvisor";
import Profile from "./pages/Profile";
import CoverPage from "./pages/CoverPage";
import DegreePlanner from "./pages/DegreePlanner";
import SettingsPage from "./components/SettingsPage";
import StudentHomepage from "./components/StudentHomepage";
import RunStudentHomepage from "./components/RunStudentHomepage";
import AdvisorHomepage from "./components/AdvisorHomepage";
import AdvisorHomepageFilter from "./components/AdvisorHomepageFilter";
import DeleteAccount from "./components/DeleteAccount";
import DraggableCourse from "./components/DraggableCourse/DraggableCourse";
import { AuthProvider } from "./components/contexts/AuthContext";

function App() {
  const [darkmode, setDarkmode] = useState(null);
  return (
    <AuthProvider>
      <div className="App">
        {/* <header className="App-header">
          <DarkModeToggle />
          <CoursePopup />
        </header> */}
        <Routes>
          <Route path="/" element={<CoverPage />} />
          <Route path="/DegreePlanner" element={<DegreePlanner 
            darkmode={darkmode}
            setDarkmode={setDarkmode}/>} />
          <Route path="/Welcome" element={<Welcome />} />
          <Route path="/Profile" element={<Profile 
            darkmode={darkmode}/>} />
          <Route
            path="/ProfileSetupStudent"
            element={<ProfileSetupStudent />}
          />
          <Route
            path="/ProfileSetupAdvisor"
            element={<ProfileSetupAdvisor />}
          />
          <Route path="/AdvisorHomePage" element={<AdvisorHomepage />} />
          <Route path="/Settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
