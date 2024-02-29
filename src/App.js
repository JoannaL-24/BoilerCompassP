import './App.css';
import CourseList from "./components/CourseList";
import DarkModeToggle  from './components/DarkModeToggle';
import Sidebar from './components/Sidebar'
import CoursePopup from './components/CoursePopup'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DarkModeToggle />
        <Sidebar/>
        <CoursePopup/>
      </header>
    </div>
  );
}

export default App;
