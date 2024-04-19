import React, { useEffect, useState } from "react";
import "./Friends.css";
import { useAuth } from 'components/contexts/AuthContext'
import ScheduleView from "components/ScheduleView/ScheduleView";
import { getSatisfied } from "models/BoilerCompass";
import { CS } from "models/CS";
import FriendsList from "components/FriendsList/FriendsList";
import { TextField, Autocomplete, CircularProgress } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "models/firebase";
import RequestsList from "components/RequestsList/RequestsList";

const SCHEDULE_DATA = {
  id: "12345",
  name: "Friend Schedule",
  completed: 0,
  planned: 0,
  total: 1,
  start_term: new Date("2022-08-19T24:00:00.000Z"),
  end_term: new Date("2026-05-03T24:00:00.000Z"),
  semester_blocks: [
    {
      id: 0,
      year: 2022,
      term: "Fall",
      credit: 4,
      course_list: [
        // {
        // id: "24508954-e0bc-407f-a823-ff348a51ac99",
        // classId: "1842e869-5d34-410a-b3e5-3ca3de853edf",
        // course: "CS18000",
        // description: "something",
        // credit: 4,
        // meeting: null
        // },
      ],
    },
    {
      id: 1,
      year: 2023,
      term: "Spring",
      course_list: [],
    },
    {
      id: 2,
      year: 2023,
      term: "Summer",
      course_list: [],
    },
    {
      id: 3,
      year: 2023,
      term: "Fall",
      course_list: [],
    },
    {
      id: 4,
      year: 2024,
      term: "Spring",
      course_list: [],
    },
    {
      id: 5,
      year: 2024,
      term: "Summer",
      course_list: [],
    },
    {
      id: 6,
      year: 2024,
      term: "Fall",
      course_list: [],
    },
    {
      id: 7,
      year: 2025,
      term: "Spring",
      course_list: [],
    },
    {
      id: 8,
      year: 2025,
      term: "Summer",
      course_list: [],
    },
    {
      id: 9,
      year: 2025,
      term: "Fall",
      course_list: [],
    },
    {
      id: 10,
      year: 2026,
      term: "Spring",
      course_list: [],
    },
    {
      id: 11,
      year: 2026,
      term: "Summer",
      course_list: [],
    },
  ],
  majors: [
    {
      name: "Computer Science",
    },
  ],
  minors: [],
  completed_courses: ["24508954-e0bc-407f-a823-ff348a51ac99"],
  planned_courses: []
}

const Friends = (scheduleList, setSchedulesList) => {
  const { currentUser } = useAuth();
  const [schedule, setSchedule] = useState(SCHEDULE_DATA);
  const [userSend, setUserSend] = useState({ id: null, email: "", name: "" });
  const [friendsList, setFriendsIdList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [openSearchFriend, setOpenSearchFriend] = useState(false);
  const [searchFriendOpt, setSearchFriendOpt] = useState([]);
  const loading = open && searchFriendOpt.length === 0;

  React.useEffect(() => {
    let active = true;
    if (!loading)
      return undefined;

    const studentUsers = [];
    getDocs(collection(firestore, "users"))
      .then((docsSnapshot) => {
        docsSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.user_type === "student") {
            studentUsers.push({
              id: doc.id,
              name: userData.name,
              email: userData.purdue_email
            });
          }
        });
        if (active)
          // console.log(studentUsers);
          // setSearchFriendOpt([...topFilms]);
          setSearchFriendOpt(studentUsers);
      })

    return () => {
      active = false;
    };
  }, [loading, open]);

  React.useEffect(() => {
    if (!open) {
      setSearchFriendOpt([]);
    }
  }, [open]);

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(firestore, "users", currentUser.uid))
      .then((docSnapshot) => {
        let friends = docSnapshot.data().friends;
        const friendPromises = friends.map(f => getDoc(doc(firestore, "users", f)));
        Promise.all(friendPromises)
          .then(friendSnapshots => {
            const newFriendsList = friendSnapshots.map((friendSnap, index) => ({
              id: friends[index],
              name: friendSnap.data().name
            }));
            setFriendsIdList(newFriendsList);
          })
      })
      .catch((error) => {
        console.log("friendlist err");
        console.log(error);
      });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(firestore, "users", currentUser.uid))
      .then((docSnapshot) => {
        let friends = docSnapshot.data().requests;
        const friendPromises = friends.map(f => getDoc(doc(firestore, "users", f)));
        Promise.all(friendPromises)
          .then(friendSnapshots => {
            const newRequestList = friendSnapshots.map((friendSnap, index) => ({
              id: friends[index],
              name: friendSnap.data().name,
              email: friendSnap.data().purdue_email
            }));
            setRequestList(newRequestList);
          })
      })
      .catch((error) => {
        console.log("requestList err");
        console.log(error);
      });
  }, [currentUser]);


  const sendFriendRequest = async () => {
    event.preventDefault();
    console.log("submit");

    console.log(userSend);

    if (userSend === null || userSend.id === null) {
      alert("No such user");
      return;
    }

    // first check if user is in own requests, if so, add each other to friends
    if (!currentUser) return;
    const userRef = doc(firestore, "users", currentUser.uid);

    getDoc(userRef)
      .then(async (docSnapshot) => {
        let requests = docSnapshot.data().requests || [];
        let addedFriend = false;

        if (requests.includes(userSend.id)) {
          // add to friends
          let newFriends = docSnapshot.data().friends || [];
          newFriends.push(userSend.id);

          // remove from requests
          const newRequests = requests.filter((id) => id !== userSend.id);

          // update user
          await updateDoc(userRef, {
            friends: newFriends,
            requests: newRequests
          });
          // update friend list state
          const newFriendList = [...friendsList];
          newFriendList.push({
            id: userSend.id,
            name: userSend.name
          });
          setFriendsIdList(newFriendList);
          // update request state
          const dup = [...requestList];
          const isId = (f) => f.id === userSend.id;
          const index = dup.findIndex(isId);
          console.log("delete request: ", index);
          dup.splice(index, 1);
          console.log(dup);
          setRequestList(dup);
          alert("Friend added");
          addedFriend = true;
        }

        return addedFriend;
      })
      .then((addedFriend) => {
        if (addedFriend) return;

        // else add request to other user
        const otherUserRef = doc(firestore, "users", userSend.id);
        getDoc(otherUserRef)
          .then(async (docSnapshot) => {
            let requests = docSnapshot.data().requests || [];
            let friends = docSnapshot.data().friends || [];

            // check if request already exists
            if (!requests.includes(currentUser.uid) && !friends.includes(currentUser.uid)) {
              requests.push(currentUser.uid);
              await updateDoc(otherUserRef, {
                requests: requests
              });
              alert("Request sent");
            } else {
              alert("Request already exists");
            }
          })
          .catch((error) => {
            console.log("send request err");
            console.log(error);
          });
      })
      .catch((error) => {
        console.log("send request err");
        console.log(error);
      });
  }


  return (
    <>
      <ScheduleView
        id={schedule.id}
        name={schedule.name}
        semesterBlocks={schedule.semester_blocks}
        setParentSemesterBlocks={null}
        viewOnly={true}
        completed={schedule.completed}
        planned={schedule.planned}
        total={schedule.total}
        scheduleList={scheduleList}
        setscheduleList={setSchedulesList}
        deleteSchedule={undefined}
        changeScheduleName={undefined}
      />
      <div className="friendsSide">
        <div className="listWindow">
          <h3>Friends</h3>
          <FriendsList friendsList={friendsList} setFriendSchedule={setSchedule}></FriendsList>
        </div>
        <br />
        <div className="listWindow">
          <h3>Requests</h3>
          <div>Send Friend Request</div>
          <br />
          <form
            style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", margin: "0px 0px 30px" }}
            onSubmit={sendFriendRequest}
          >
            <Autocomplete
              id="searchUser"
              sx={{
                // TODO: change color
                width: "75%"
              }}
              open={openSearchFriend}
              onOpen={() => {
                setOpenSearchFriend(true);
              }}
              onClose={() => {
                setOpenSearchFriend(false);
              }}
              onChange={(event: any, newValue) => {
                setUserSend(newValue);
              }}
              isOptionEqualToValue={(option, value) => option.email === value.email}
              getOptionLabel={(option) => option.email}
              options={searchFriendOpt}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search User"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
            <button style={{ width: "20%", margin: "0px" }} className="mediumBtn goldBtn" type="submit">
              <SendIcon />
            </button>
          </form>
          <RequestsList requestList={requestList} setRequestList={setRequestList} />
        </div>
      </div>
    </>
  )
}

export default Friends