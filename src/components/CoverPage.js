import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import { colors } from "@mui/material";
import { red } from "@mui/material/colors";

export default function CoverPage () {
    // state

    const signIn = (e) => {
        alert("sign process");
    }

    return (
        <div className="pageWide">
            <div className="nav">
                <button className="mediumBtn"><h3>Sign in</h3></button>
                <button className="goldBtn mediumBtn"><h3>Get Start</h3></button>
            </div>
            <div className="horizontalCenter">
                <img src='/tempLogo.PNG' alt='Boiler Compass' className="coverLogo coverComponent"></img>
                <div className="coverComponent verticalLeft">
                    <h1>Start Your Journey</h1>
                    <form id="signInForm" onSubmit={signIn}>
                        <FormTextInput id="standard-basic" label="Email" type="email" variant="standard" />
                        <FormTextInput id="standard-basic" label="Password" type="password" variant="standard" />
                        <button className="mediumBtn" type="submit"><h3>Sign in</h3></button>
                    </form>
                    <h2>Don't Have an Account?</h2>
                    <button className="goldBtn mediumBtn"><h3>Get Start</h3></button>
                    {/* dropbox */}
                </div>
            </div>
        </div>
    )
}

const FormTextInput = styled(TextField)({
    '& input:valid + fieldset': {
      borderColor: '#E0E3E7',
      borderWidth: 1,
    },
    '& input:invalid + fieldset': {
      borderColor: 'red',
      borderWidth: 1,
    },
    '& input:valid:focus + fieldset': {
      borderLeftWidth: 4,
      padding: '4px !important', // override inline-style
    },
  });