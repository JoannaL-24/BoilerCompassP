import './App.css';
// import {Routes, Route} from 'react-router-dom';
import Welcome from './components/Welcome'
import Profile_student from './components/Profile_setup_student'

function App() {
  return (
    <div className="App">
      {/* <Routes>
        <Route path='/' element={<Welcome/>}/>
      </Routes> */}
      {/* <Welcome/> */}
      <Profile_student/>
    </div>
  );
}

export default App;
