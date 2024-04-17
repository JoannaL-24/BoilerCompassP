import "./FriendsList.css"
import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.tsx'
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion, Timestamp, addDoc, collection } from "firebase/firestore";
import { firestore } from '../../models/firebase.ts';
import RemoteUserdata from '../../models/RemoteUserData.ts';
import Popup from 'reactjs-popup';
import UserData from "models/UserData.ts";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import SharedSchedule from '../SharedSchedules/SharedSchedule.js';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// const FriendsList = () => {
const FriendsList = ({ setFriendSchedule }) => {
  const { currentUser } = useAuth();
  const [friendsList, setFriendsIdList] = useState([]);
  const [friendsNameList, setFriendsNameList] = useState([]);
  const [listAnchorEl, setListAnchorEl] = useState<null | HTMLElement>(null);
  const userData: UserData = new RemoteUserdata();

  const [userID, setuserID] = useState(null); // this will be passed in
  const [openScheduleList, setOpenScheduleList] = useState(false);

  const friendsOpen = Boolean(listAnchorEl);
  const handleFriendsClick = (event: React.MouseEvent<HTMLElement>) => {
    setListAnchorEl(event.currentTarget);
  };
  const handleFriendsClose = () => {
    setListAnchorEl(null);
  };

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
    console.log(friendsList);
  }, [friendsList]);

  // useEffect(() => {
  //   console.log(friendsNameList);
  // }, [friendsNameList]);

  // const names = [];
  // friendsList.forEach((element) => {
  //   names.push(element.name);
  // });
  // console.log(names)

  const handleClick = (id) => {
    console.log("friend click: ", id);
    setuserID(id);
    setOpenScheduleList(true);
  }

  return (
    <div className="list">
      {friendsList.map((friend, index) => (
        <div
          key={index}
          className='listItem'
          onClick={() => handleClick(friend.id)}
        >
          {friend.name}
          <NavigateNextIcon/>
        </div>
      ))}
      <SharedSchedule setFriendSchedule={setFriendSchedule} userID={userID} openScheduleList={openScheduleList} setOpenScheduleList={setOpenScheduleList}/>

    </div>
  )
}

export default FriendsList
