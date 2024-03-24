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
        console.log("mode: " + darkmode)
        var dark_state = e.target.checked;
        setDarkmode(dark_state);
        if (currentUser) {
            const user_doc = doc(firestore, "users", currentUser.uid);
            //TODO: fix guest user
            updateDoc(user_doc, {
                dark_mode: !darkmode
            });
        }
         console.log("after doc update");
         console.log(darkmode);
         if (darkmode) {
            document.querySelector("body").setAttribute("data-theme", "dark");
            console.log("dark");
         }
         else {
            document.querySelector("body").setAttribute("data-theme", "light")
            console.log("light");
        }
    }

    if (darkmode) {
        document.querySelector("body").setAttribute("data-theme", "dark");
        console.log("dark-out");
     }
     else {
        document.querySelector("body").setAttribute("data-theme", "light")
        console.log("light-out");
    }

    return (
        <div className='dark_mode'>
            <input
                defaultChecked = {darkmode}
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                onClick = {toggleTheme}
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
    );
};

export default DarkModeToggle;
