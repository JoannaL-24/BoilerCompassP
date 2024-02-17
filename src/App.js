import './App.css';
// import {Routes, Route} from 'react-router-dom';
import Welcome from './components/Welcome'

function App() {
  return (
    <div className="App">
      {/* <Routes>
        <Route path='/' element={<Welcome/>}/>
      </Routes> */}
      <Welcome/>
    </div>
  );
}

export default App;
