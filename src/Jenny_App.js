import './App.css';
import {Routes, Route} from 'react-router-dom';
import Welcome from './components/Welcome'
import ProfileSetupStudent from './components/Profile_setup_student'
import ProfileSetupAdvisor from './components/Profile_setup_advisor'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Welcome/>}/>
        <Route path='/profile-setup-student' element={<ProfileSetupStudent/>}/>
        <Route path='/profile-setup-advisor' element={<ProfileSetupAdvisor/>}/>
      </Routes>
    </div>
  );
}

export default App;
