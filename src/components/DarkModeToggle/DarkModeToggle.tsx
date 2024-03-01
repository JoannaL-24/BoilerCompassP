import React from "react";
import useState from "react";
// @ts-ignore
import { ReactComponent as Sun } from "./Sun.svg";
// @ts-ignore
import { ReactComponent as Moon } from "./Moon.svg";
import "./DarkModeToggle.css"
// firebase imports
import { useAuth } from '../contexts/AuthContext.tsx'
import { doc, updateDoc, Timestamp,getDoc } from "firebase/firestore";
import { firestore } from '../../models/firebase.ts';

type Props = {
    darkmode:boolean;
    setDarkmode: React.Dispatch<React.SetStateAction<boolean>>;
}

const DarkModeToggle = ({darkmode, setDarkmode}: Props) => {

    const { currentUser } = useAuth();
    console.log(darkmode)

    const toggleTheme = (e) => {
        // if (e.target.checked) {setDarkmode(false);}
        // else {setDarkmode(true);}
        console.log("mode: "+ darkmode)
        console.log("checked: " + e.target.checked)
        // if (e.target.checked === true) {setDarkmode(true);}
        // else {setDarkmode(false);}
        setDarkmode(e.target.checked)
        console.log(darkmode)
        console.log("set")
        if (currentUser) {
            const user_doc = doc(firestore, "users", currentUser.uid);
            updateDoc(user_doc, {
                dark_mode: darkmode
            });
        }
         console.log("after doc update");
         console.log(darkmode);
         if (darkmode) {
            document.querySelector("body").setAttribute("data-theme", "light")
         }
         else {document.querySelector("body").setAttribute("data-theme", "dark")}
    }

    return (
        <div className='dark_mode'>
            <input
                checked = {darkmode}
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                onChange = {toggleTheme}
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
    );
};

export default DarkModeToggle;