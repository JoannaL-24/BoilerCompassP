import './App.css';
// import {Routes, Route} from 'react-router-dom';
import Welcome from './components/Welcome'
import Profile from './components/Profile_setup'

function App() {
  return (
    <div className="App">
      {/* <Routes>
        <Route path='/' element={<Welcome/>}/>
      </Routes> */}
      {/* <Welcome/> */}
      <Profile/>
    </div>
  );
}

export default App;
