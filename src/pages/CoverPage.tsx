import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../components/contexts/AuthContext';
import { auth } from '../models/firebase';
import "./CoverPage.css"
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

export default function CoverPage () {
    // const { currentUser } = useAuth();
    const [user, setUser] =useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    }

    const submitHandler = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert(user.email + "\n" + user.password);
        // check input
        signInWithEmailAndPassword(auth, user.email, user.password)
            .then((useCredential) => {
                console.log(useCredential)
            }).catch((error) => {
                console.log(error);
                switch (error.code) {
                  case "auth/invalid-email":
                    // setError("Invalid Email!");
                    break;
                  case "auth/wrong-password":
                    // setError("Invalid Password!");
                    break;
                  case "auth/user-not-found":
                    // setError("User Not Found!");
                    break;
                  case "auth/too-many-requests":
                    // setError("Failed too Many Times, Try Again Later!");
                    break;
                  default:
                    console.log("Error Code: " + error.code);
                    // setError("");
                    break;
            }
        });
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("have user");
            // navigate("/Welcome");
        } else {
            console.log("no user");
        }
    });

    const userSignOut = () => {
        signOut(auth)
          .then(() => {
            console.log("sign out successful");
          })
          .catch((error) => console.log(error));
      };

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
                    <button className="mediumBtn" onClick={userSignOut}>Logout</button>
                    <br/>
                </div>
            </div>
        </div>
    )
}



