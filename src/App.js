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
import Profile from "./pages/Profile";
import ProgressBarTesting from './components/ProgressBar';
import { AuthProvider } from './components/contexts/AuthContext';

function App() {
  //return <AdvisorHomepage />;
  // return <DeleteAccount />;
  return (
    
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/DegreePlanner" element={<DegreePlanner />} />
          <Route path="/" element={<Welcome />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/profile-setup-student" element={<ProfileSetupStudent />}/>
          <Route path="/profile-setup-advisor" element={<ProfileSetupAdvisor />}/>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
