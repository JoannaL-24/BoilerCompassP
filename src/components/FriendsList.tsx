import React , { useState, useEffect } from 'react'
import { useAuth } from './contexts/AuthContext.tsx'
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion, Timestamp, addDoc, collection } from "firebase/firestore";
import { firestore } from '../models/firebase.ts';
import RemoteUserdata from '../models/RemoteUserData.ts';
import Popup from 'reactjs-popup';
import UserData from "models/UserData.ts";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';

const FriendsList = () => {
// const FriendsList = ({setViewOnly, setFriendSchedule}) => {
    const { currentUser } = useAuth();
    const [friendsList, setfriendsList] = useState([]);
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
        if (currentUser) {
            const user_doc = getDoc(doc(firestore, "users", currentUser.uid))
                .then((docSnapshot) => {
                    let friends = docSnapshot.data().friends;
                    for (let f of friends) {
                        console.log(f);
                        // setfriendsList([...friendsList, f]);
                        let fname = null;
                        const friend_doc = getDoc(doc(firestore, "users", f))
                            .then((userSnapshot) => {
                                fname = userSnapshot.data().name;
                                console.log(fname)
                                const name_id = {
                                  id: f,
                                  name: fname
                                }
                                const updated = friendsList
                                updated.splice(0, 0, name_id);
                                setfriendsList(updated);
                            })
                            .catch((error) => {
                                console.log("friendlist err")
                                console.log(error)
                            })
                        
                    }

                });
        }
    }, [currentUser]);

    console.log(friendsList);
    // const names = [];
    // friendsList.forEach((element) => {
    //   names.push(element.name);
    // });
    // console.log(names)

    const handleClick = (id) => {
      console.log("click")
      console.log(id)
      setOpenScheduleList(true);
      setuserID(id);
    }

  return (
    <div>
      <Button
        id="friends-button"
        aria-controls={friendsOpen ? 'friends-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={friendsOpen ? 'true' : undefined}
        onClick={handleFriendsClick}
        variant="contained"
      >
        Friends
      </Button>
      <FormControl sx={{ m: 1, width: 300 }}>
        <Menu
          id="friends-menu"
          anchorEl={listAnchorEl}
          open={friendsOpen}
          onClose={handleFriendsClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >

            {friendsList.map((friend) => (
              <MenuItem
                key={friend.name}
                value={friend.name}
                onClick={() => handleClick(friend.id)}
              >
                {friend.name}
              </MenuItem>
            ))}
        </Menu>
      </FormControl>
      
    </div>
  )
}

export default FriendsList
