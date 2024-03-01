import React from "react";
import useState from "react";
// @ts-ignore
import { ReactComponent as Sun } from "./Sun.svg";
// @ts-ignore
import { ReactComponent as Moon } from "./Moon.svg";
import "./DarkModeToggle.css"
// firebase imports
import { useAuth } from '../contexts/AuthContext.tsx'
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { firestore } from '../../models/firebase.ts';

type Props = {
    darkmode:boolean;
    setDarkmode: React.Dispatch<React.SetStateAction<boolean>>;
}

const DarkModeToggle = ({darkmode, setDarkmode}: Props) => {

    const { currentUser } = useAuth();

    const toggleTheme = (e) => {
        if (e.target.checked) {
            setDarkmode(true)
        }
        else {
            setDarkmode(false)
        }
        if (currentUser) {
            const user_doc = getDoc(doc(firestore, "users", currentUser.uid));
            updateDoc(user_doc, {
                dark_mode: darkmode
            });
        }
        console.log(darkmode)
    }

    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                onChange = {toggleTheme}
                defaultChecked = {darkmode}
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
    );
};

export default DarkModeToggle;