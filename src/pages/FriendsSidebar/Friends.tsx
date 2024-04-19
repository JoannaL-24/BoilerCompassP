import React, { useEffect, useState } from "react";
import "./Friends.css";
import ScheduleView from "components/ScheduleView/ScheduleView";
import { getSatisfied } from "models/BoilerCompass";
import { CS } from "models/CS";
import FriendsList from "components/FriendsList/FriendsList";
import { TextField, Autocomplete, CircularProgress } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "models/firebase";

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
  const [schedule, setSchedule] = useState(SCHEDULE_DATA);
  const [userSend, setUserSend] = useState("");
  const [openSearchFriend, setOpenSearchFriend] = useState(false);
  const [searchFriendOpt, setSearchFriendOpt] = useState([]);
  const loading = open && searchFriendOpt.length === 0;

  React.useEffect(() => {
    let active = true;
    if (!loading)
      return undefined;

    // (async () => {
    //   await sleep(1e3); // For demo purposes.

    //   if (active) {
    //     setSearchFriendOpt([...topFilms]);
    //   }
    // })();
    const studentUsers = [];
    getDocs(collection(firestore, "users"))
      .then ((docsSnapshot) => {
        docsSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.user_type === "student") {
            studentUsers.push({
              id: doc.id,
              email: userData.purdue_email
            });
          }
        });
        if (active)
          console.log(studentUsers);
          // setSearchFriendOpt([...topFilms]);
          setSearchFriendOpt(studentUsers);
      })
    
    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setSearchFriendOpt([]);
    }
  }, [open]);

  const sentFriendRequest = () => {
    event.preventDefault();
    console.log("submit");
    if (userSend === null) return;
    console.log(userSend.id);
    // TODO: add the request in firebase
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
          <FriendsList setFriendSchedule={setSchedule}></FriendsList>
        </div>
        <br />
        <div className="listWindow">
          <h3>Requests</h3>
          <form
            style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}
            onSubmit={sentFriendRequest}
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
          
        </div>
      </div>
    </>
  )
}

export default Friends

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
];