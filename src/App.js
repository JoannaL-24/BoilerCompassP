import './App.css';
import CourseList from "./components/CourseList";
import DarkModeToggle  from './components/DarkModeToggle';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DarkModeToggle />
      </header>
    </div>
  );
}

export default App;
