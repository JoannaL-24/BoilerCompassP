import React, { useState } from "react";

const CoverPage = () => {
    // state

    return (
        <div className="pageWide">
            <div className="nav"></div>
            <div className="horizontalCenter" style={{margin: "calc(60px + 60px) 0px 0px"}}>
                <img src='/tempLogo.PNG' alt='Boiler Compass' className="coverLogo coverComponent"></img>
                <div className="coverComponent">
                    <h1>Start Your Journey</h1>
                    <p style={{width: "70%"}}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum is simply
                    </p>
                    <br/>
                    <button className="goldBtn mediumBtn"><h3>Get Start</h3></button>
                    <button className="mediumBtn"><h3>Sign in</h3></button>
                </div>
            </div>
        </div>
    )
}

export default CoverPage;

