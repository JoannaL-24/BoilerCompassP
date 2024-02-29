import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import "./CoverPage.css"

export default function CoverPage () {
    const [user, setUser] =useState({
        email: '',
        password: ''
    });

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    }

    const submitHandler = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(user.email + " " + user.password);
    }

    return (
        <div className="CoverPage">
            {/* <div className="nav">
                <button className="mediumBtn"><h3>Sign in</h3></button>
                <button className="goldBtn mediumBtn"><h3>Get Start</h3></button>
            </div> */}
            <div className="horizontalCenter">
                <div className="coverComponent" style={{width: "55%"}}>
                    <img src='/logo/BoilerCompass Logo v2.png' alt='Boiler Compass' className="coverLogo"></img>
                </div>
                <div className="coverComponent coverInputs" style={{width: "45%"}}>
                    <h1>Start Your Journey</h1>
                    <br/><br/>
                    <form id="signInForm" onSubmit={submitHandler}>
                        <div className="inputGroup">
                            <input id="email" name="email" className="inputField" placeholder="Email" type="email" onChange={changeHandler}required/>
                            <label htmlFor="email" className="inputLabel">Email</label>
                        </div>
                        <div className="inputGroup">
                            <input id="password" name="password" className="inputField" placeholder="Password" type="password" onChange={changeHandler}required/>
                            <label htmlFor="password" className="inputLabel">Password</label>
                        </div>
                        <br/>
                        <button className="mediumBtn gradient" type="submit"><h3>Sign in</h3></button>
                    </form>
                    <br/><br/>
                    <div className="divider">OR</div>
                    <br/><br/> 
                    <h2>Don't Have an Account?</h2>
                    <button className="gradient mediumBtn"><h3>Get Start</h3></button>
                    {/* dropbox */}
                    <br/>
                </div>
            </div>
        </div>
    )
}



