import "./CoverPage.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/contexts/AuthContext";
import { auth, firestore } from "../models/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import Popup from "reactjs-popup";
import UserData from "models/UserData";
import RemoteUserdata from "models/RemoteUserData";
import { User } from "models/BoilerCompass";
import LocalUserData from "models/LocalUserData";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function CoverPage() {
  const navigate = useNavigate();
  const { signUserIn, createUser, sendPassResetEmail } = useAuth();
  const remoteUserData: UserData = new RemoteUserdata();
  const localUserData: UserData = new LocalUserData();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errLogin, setErrLogin] = useState({
    flag: 0,
    errDetail: "",
  });
  const [errSignUp, seterrSignUp] = useState({
    flag: 0,
    errDetail: "",
  });
  const [errResetPassword, setErrResetPassword] = useState({
    flag: 0,
    errDetail: "",
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const submitLogin = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // alert(user.email + "\n" + user.password);
    // check input
    if (!signUserIn) return;
    signUserIn(user.email, user.password)
      .then(async (useCredential) => {
        console.log(useCredential);
        const userRef = doc(firestore, `/users/${useCredential.user.uid}/`);
        const userSnapshot = await getDoc(userRef);
        setErrLogin({ flag: 0, errDetail: "" });
        const userData = userSnapshot.data();
        if (userData.user_type === "student") {
          navigate("/DegreePlanner");
        } else {
          navigate("/AdvisorHomepage");
        }
      })
      .catch((error) => {
        console.log(error);
        switch (error.code) {
          case "auth/invalid-email":
            setErrLogin({ flag: 1, errDetail: "Invalid Email!" });
            break;
          case "auth/wrong-password":
            setErrLogin({ flag: 2, errDetail: "Invalid Password!" });
            break;
          case "auth/invalid-credential":
            setErrLogin({ flag: 3, errDetail: "Invalid Credentail!" });
            break;
          case "auth/user-not-found":
            setErrLogin({ flag: 3, errDetail: "User Not Found" });
            break;
          default:
            console.log("Error Code: " + error.code);
            setErrLogin({ flag: 0, errDetail: "" });
            break;
        }
      });
  };

  const submitSignUp = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // alert(user.name + "\n" + user.email + "\n" + user.password);
    if (!user.email.includes("@purdue.edu")) {
      seterrSignUp({
        flag: 1,
        errDetail: "Please use email from Purdue email domain",
      });
    } else {
      createUser(user.email, user.password)
        .then((userCredential) => {
          const signedUpUser = userCredential.user;
          console.log(signedUpUser);
          seterrSignUp({ flag: 0, errDetail: "" });
          setDoc(doc(firestore, `/users/${signedUpUser.uid}/`), {
            name: user.name,
            purdue_email: user.email,
            dark_mode: true,
            groups: [],
          })
            .then(() => {
              console.log("New User Signed Up");
              sendEmailVerification(signedUpUser, {
                url: "http://localhost:3000/Welcome",
              })
                .then(() => {
                  console.log("email sent");
                  seterrSignUp({
                    flag: 4,
                    errDetail: "Email Sent, Please Verify Your Email",
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
          switch (error.code) {
            case "auth/email-already-in-use":
              seterrSignUp({
                flag: 1,
                errDetail: "Used Email! Login With the Email",
              });
              break;
            case "auth/invalid-email":
              seterrSignUp({ flag: 1, errDetail: "Invalid Email!" });
              break;
            case "auth/weak-password":
              seterrSignUp({ flag: 2, errDetail: "Weak Password!" });
              break;
            default:
              console.log("Error Code: " + error.code);
              seterrSignUp({ flag: 0, errDetail: "" });
              break;
          }
        });
    }
  };

  const resetPassword = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // alert(user.email);
    if (!user.email.includes("@purdue.edu")) {
      setErrResetPassword({
        flag: 1,
        errDetail: "Please use email from Purdue email domain",
      });
    } else {
      sendPassResetEmail(user.email)
        .then(() => {
          setErrResetPassword({
            flag: 4,
            errDetail: "Password Reset Email Sent",
          });
        })
        .catch((error) => {
          if (error.code === "auth/user-not-found") {
            setErrResetPassword({ flag: 1, errDetail: "User Not Found" });
          } else {
            console.log(error);
            setErrResetPassword({ flag: 0, errDetail: "" });
          }
        });
    }
  };

  const guestSignUp = () => {
    let newUser: User = {
      name: "",
      purdue_email: "",
      dark_mode: false,
      groups: [],
    };
    localUserData
      .init(newUser)
      .then(() => {
        console.log("Guest User Signed In");
        navigate("/ProfileSetupStudent");
      })
      .catch((error: unknown) => {
        console.log(error);
      });
  };

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign Out Successful");
      })
      .catch((error) => console.log(error));
  };

  const styleErr = (e, field, type) => {
    if (e === 4) {
      return;
    } else if (e !== 2 && e !== 3 && field === "password") {
      return;
    } else if (e !== 1 && e !== 3 && field === "email") {
      return;
    } else {
      if (e !== 0 && type === "input") {
        return {
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          borderColor: "var(--error)",
        };
      }
      if (e !== 0 && type === "label") {
        return {
          color: "var(--error)",
        };
      }
    }
  };

  return (
    <div className="CoverPage">
      {/* <div className="nav">
                <button className="mediumBtn"><h3>Sign in</h3></button>
                <button className="goldBtn mediumBtn"><h3>Get Start</h3></button>
            </div> */}
      <div className="horizontalCenter">
        <div className="coverComponent" style={{ width: "55%" }}>
          <img
            src="/logo/BoilerCompass Logo v2.png"
            alt="Boiler Compass"
            className="coverLogo"
          ></img>
        </div>
        <div className="coverComponent coverInputs" style={{ width: "45%" }}>
          <h1>Start Your Journey</h1>
          <br />
          <br />
          <form id="signInForm" onSubmit={submitLogin}>
            <div className="inputGroup">
              <input
                id="email"
                name="email"
                className="inputField"
                placeholder="Email"
                type="email"
                onChange={changeHandler}
                style={styleErr(errLogin.flag, "email", "input")}
                required
              />
              <label
                htmlFor="email"
                className="inputLabel"
                style={styleErr(errLogin.flag, "email", "label")}
              >
                Email
              </label>
            </div>
            <div className="inputGroup">
              <input
                id="password"
                name="password"
                className="inputField"
                placeholder="Password"
                type="password"
                onChange={changeHandler}
                style={styleErr(errLogin.flag, "password", "input")}
                required
              />
              <label
                htmlFor="password"
                className="inputLabel"
                style={styleErr(errLogin.flag, "password", "label")}
              >
                Password
              </label>
            </div>
            <p className="errMsg">&nbsp;{errLogin.errDetail}</p>
            <button className="mediumBtn goldBtn" type="submit">
              <h3>Log in</h3>
            </button>
          </form>
          <Popup
            trigger={
              <button className="forgetPasswordLink">Forget Password?</button>
            }
            onClose={() => setErrResetPassword({ flag: 0, errDetail: "" })}
            modal
            nested
          >
            <div className="modal fadeIn" style={{ minHeight: "300px" }}>
              <form id="signUpForm" onSubmit={resetPassword}>
                <div className="inputGroup">
                  <input
                    id="email"
                    name="email"
                    className="inputField"
                    placeholder="Email"
                    type="email"
                    onChange={changeHandler}
                    style={styleErr(errResetPassword.flag, "email", "input")}
                    required
                  />
                  <label
                    htmlFor="email"
                    className="inputLabel"
                    style={styleErr(errResetPassword.flag, "email", "label")}
                  >
                    Email
                  </label>
                </div>
                <p className="errMsg">&nbsp;{errResetPassword.errDetail}</p>
                <button className="goldBtn" type="submit">
                  <h3>
                    Send Email For Reset
                    <br />
                    Password
                  </h3>
                </button>
              </form>
            </div>
          </Popup>
          <br />
          <br />
          <div className="divider">OR</div>
          <br />
          <br />
          <h2>Don't Have an Account?</h2>
          <div className="getStartMenu">
            <Popup
              trigger={
                <button className="mediumBtn goldBtn">
                  <h3>Create Account</h3>
                </button>
              }
              onClose={() => {
                seterrSignUp({ flag: 0, errDetail: "" });
              }}
              modal
              nested
            >
              <div className="modal fadeIn">
                <form id="signUpForm" onSubmit={submitSignUp}>
                  <div className="inputGroup">
                    <input
                      id="name"
                      name="name"
                      className="inputField"
                      placeholder="Name"
                      type="text"
                      onChange={changeHandler}
                      required
                    />
                    <label htmlFor="name" className="inputLabel">
                      Name
                    </label>
                  </div>
                  <div className="inputGroup">
                    <input
                      id="email"
                      name="email"
                      className="inputField"
                      placeholder="Email"
                      type="email"
                      onChange={changeHandler}
                      style={styleErr(errSignUp.flag, "email", "input")}
                      required
                    />
                    <label
                      htmlFor="email"
                      className="inputLabel"
                      style={styleErr(errSignUp.flag, "email", "label")}
                    >
                      Email
                    </label>
                  </div>
                  <div className="inputGroup">
                    <input
                      id="password"
                      name="password"
                      className="inputField"
                      placeholder="Password"
                      type="password"
                      onChange={changeHandler}
                      style={styleErr(errSignUp.flag, "password", "input")}
                      required
                    />
                    <label
                      htmlFor="password"
                      className="inputLabel"
                      style={styleErr(errSignUp.flag, "password", "label")}
                    >
                      Password
                    </label>
                  </div>
                  <p className="errMsg">&nbsp;{errSignUp.errDetail}</p>
                  <button className="goldBtn" type="submit">
                    <h3>Sign Up!</h3>
                  </button>
                </form>
              </div>
            </Popup>
            <button className="mediumBtn goldBtn" onClick={guestSignUp}>
              <h3>Start Without Account</h3>
            </button>
          </div>
          {/* <button className="mediumBtn" onClick={userSignOut}>
            Logout
          </button> */}
          <br />
        </div>
      </div>
    </div>
  );
}
