import React from 'react'
import StudentProfile from './Student_profile'
import AdvisorProfile from './Advisor_profle'

const Profile = () => {
  // const firebaseConfig = {
  //   //...
  // };
  
  // const app = initializeApp(firebaseConfig);
  // const db = getFirestore(app);
  // const auth = getAuth();
  // const user = auth.currentUser;
  const user = null;
  if (user) {
    if (user.user_type==="student") {
      const [userinfo, setUserinfo] = useState({
        user_type: "student",
        major: user.prefer_majors,
        minor: user.prefer_minor,
        start_term: user.start_term,
        end_term: user.end_term,
        advisor: user.advisor,
        group: user.group,
      });
    }
    else {
      const [userinfo, setUserinfo] = useState({
        role: "advisor",
        college: user.college,
        department: user.department,
        students: user.students,
      });
    }
  }

  const submit_function = (e) => {
    console.log(userinfo); // for testing purposes
    if (user) {
      const uid = user.uid;
      getAuth()
        .updateUser(uid, {
          prefer_majors: userinfo.major,
          prefer_minor: userinfo.minor,
          user_type: userinfo.user_type,
          advisor: userinfo.advisor,
        })
        .then((userRecord) => {
          // indicate success and bring user to home page
          console.log('Successfully updated user', userRecord.toJSON());
        })
        .catch((error) => {
          console.log('Error updating user:', error);
        });
    }
    else {
      setSignedIn(false);
    }
  };

  return (
    <div>
      <Alert severity="error" sx={{ display: signedIn ? 'none' : 'flex', top: 0, left: 0, width: '100%', height: '4%'}}>
      {"Please sign in to continue setting up profile"}
      </Alert>
      <h1 className="paget">Profile Setup</h1>
      <StudentProfile
      submit_function={submit_function}
      userinfo={userinfo}
      setUserinfo={setUserinfo}/>
    </div>
  )
}

export default Profile
