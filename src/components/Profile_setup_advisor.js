import React, { useState } from 'react';
import AdvisorProfile from './Advisor_profile'
import '../css/Profile.css';

const Profile_setup_advisors = () => {
  const [userinfo, setUserinfo] = useState({
    role: "advisor",
    college: "",
    department: "",

  });

  const handleSubmit = (e) => {
    console.log(userinfo);
  };

  return (
    <div>
      <h1 className="paget">Profile Setup</h1>
      <AdvisorProfile userinfo={userinfo} setUserinfo={setUserinfo} handleSubmit={handleSubmit} />
    </div>
  )
}

export default Profile_setup_advisors