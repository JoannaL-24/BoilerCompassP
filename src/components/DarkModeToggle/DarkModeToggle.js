import React from "react";
import useState from "react";
// @ts-ignore
import { ReactComponent as Sun } from "./Sun.svg";
// @ts-ignore
import { ReactComponent as Moon } from "./Moon.svg";
import "./DarkModeToggle.css"

const DarkModeToggle = () => {
    // const [theme, setTheme] = useState({
        
    // });
    const setDarkMode = () => {
        // @ts-ignore
        document.querySelector("body").setAttribute('data-theme', 'dark')
        localStorage.setItem("selectedTheme", "dark")
    }
    const setLightMode = () => {
        // @ts-ignore
        document.querySelector("body").setAttribute('data-theme', 'light')
        localStorage.setItem("selectedTheme", "light")
    }

    const selectedTheme = localStorage.getItem("selectedTheme");
    if (selectedTheme === "dark") {
        setDarkMode();
    }
    const toggleTheme = (/** @type {{ target: { checked: any; }; }} */ e) => {
        if (e.target.checked) setDarkMode();
        else setLightMode();
    }
    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                onChange = {toggleTheme}
                defaultChecked = {selectedTheme === "dark"}
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
    );
};

export default DarkModeToggle;