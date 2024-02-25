import './App.css';
import CourseList from "./components/CourseList";
import DarkModeToggle  from './components/DarkModeToggle';
import Sidebar from './components/Sidebar'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DarkModeToggle />
        <Sidebar/>
      </header>
    </div>
  );
}

export default App;
