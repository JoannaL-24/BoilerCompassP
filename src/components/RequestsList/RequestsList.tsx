import "./RequestsList.css"
import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.tsx'
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion, Timestamp, addDoc, collection } from "firebase/firestore";
import { firestore } from '../../models/firebase.ts';
import RemoteUserdata from '../../models/RemoteUserData.ts';
import Popup from 'reactjs-popup';
import UserData from "models/UserData.ts";
import SharedSchedule from '../SharedSchedules/SharedSchedule.js';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function RequestsList({ requestList, setRequestList }) {
    const { currentUser } = useAuth();
    const userData: UserData = new RemoteUserdata();
    const [reqRender, setReqRender] = useState([]);

    useEffect(() => {
        console.log("child: ", requestList);
        let newRender = [];
        for (let i = 0; i < requestList.length; i++) {
            newRender.push(
                <div
                    key={i}
                    className='ReqListItem'
                >
                    {requestList[i].email}
                    <CheckIcon className='ReqItemBtn' onClick={() => acceptRequest(requestList[i])} />
                    <CloseIcon className='ReqItemBtn' onClick={() => rejectRequest(requestList[i])} />
                </div>
            );
        }

        setReqRender(newRender);
    }, [requestList]);

    const acceptRequest = (user) => {
        // console.log("accept request: ", f);
        console.log("user", user);

        const ref = doc(firestore, "users", currentUser.uid);
        getDoc(ref)
            .then(async (docSnapshot) => {
                let friends = docSnapshot.data().friends || [];
                friends.push(user.id);

                await updateDoc(ref, {
                    friends: friends
                });

                let requests = docSnapshot.data().requests || [];
                requests = requests.filter(function(item) {
                    return item !== user.id
                })

                await updateDoc(ref, {
                    requests: requests
                });
            })
            .catch((error) => {
                console.log("send request err");
                console.log(error);
            });
        // setuserID(id);
        // setOpenScheduleList(true);
    }

    const rejectRequest = (user) => {
        const ref = doc(firestore, "users", currentUser.uid);
        getDoc(ref)
            .then(async (docSnapshot) => {
                let requests = docSnapshot.data().requests || [];
                requests = requests.filter(function(item) {
                    return item !== user.id
                })

                await updateDoc(ref, {
                    requests: requests
                });
            })
            .catch((error) => {
                console.log("send request err");
                console.log(error);
            });
    }

    return (
        <div className="list">
            {/* {requestList.map((friend, index) => (
                <div
                    key={index}
                    className='ReqListItem'
                >
                    {friend.email}
                    <CheckIcon className='ReqItemBtn' onClick={() => acceptRequest(friend.id)} />
                    <CloseIcon className='ReqItemBtn' onClick={() => rejectRequest(friend.id)} />
                </div>
            ))} */}
            {reqRender}
        </div>
    )
}
