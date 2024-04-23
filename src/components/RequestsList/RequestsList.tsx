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

export default function RequestsList({ requestList, addFromReq, deleteFromReq }) {
    const { currentUser } = useAuth();
    const userData: UserData = new RemoteUserdata();
    const [reqRender, setReqRender] = useState([]);

    const acceptRequest = (user) => {

        const ref = doc(firestore, "users", currentUser.uid);
        getDoc(ref)
            .then(async (docSnapshot) => {
                let friends = docSnapshot.data().friends || [];
                friends.push(user.id);

                await updateDoc(ref, {
                    friends: friends
                });

                let requests = docSnapshot.data().requests || [];
                requests = requests.filter(function (item) {
                    return item !== user.id
                })

                await updateDoc(ref, {
                    requests: requests
                });
                await updateDoc(doc(firestore, "users", user.id), {
                    friends: arrayUnion(currentUser.uid),
                });

                addFromReq(user.id);
            })
            .catch((error) => {
                console.log("send request err");
                console.log(error);
            });
    }

    const rejectRequest = (user) => {
        const ref = doc(firestore, "users", currentUser.uid);
        getDoc(ref)
            .then(async (docSnapshot) => {
                let requests = docSnapshot.data().requests || [];
                requests = requests.filter(function (item) {
                    return item !== user.id
                })

                await updateDoc(ref, {
                    requests: requests
                });
                deleteFromReq(user.id);
            })
            .catch((error) => {
                console.log("send request err");
                console.log(error);
            });
    }

    return (
        <div className="list">
            {requestList.map((friend, index) => (
                <div
                    key={index}
                    className='ReqListItem'
                >
                    {friend.email}
                    <CheckIcon className='ReqItemBtn' onClick={() => acceptRequest(friend)} />
                    <CloseIcon className='ReqItemBtn' onClick={() => rejectRequest(friend)} />
                </div>
            ))}
            {/* {reqRender} */}
        </div>
    )
}
