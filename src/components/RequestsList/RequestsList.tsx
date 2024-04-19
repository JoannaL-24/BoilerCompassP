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

export default function RequestsList ({requestList, setRequestList}) {
    const { currentUser } = useAuth();
    const userData: UserData = new RemoteUserdata();
    const [reqRender, setReqRender] = useState([]);

    useEffect(() => {
        console.log("child: ", requestList);
        let newRender = [];
        for (var i = 0; i < requestList.length; i++) {
            newRender.push(
                <div
                    key={i}
                    className='ReqListItem'
                >
                    {requestList[i].email}
                    <CheckIcon className='ReqItemBtn' onClick={() => acceptRequest(requestList[i].id)} />
                    <CloseIcon className='ReqItemBtn' onClick={() => rejectRequest(requestList[i].id)} />
                </div>
            );
        }
        
        setReqRender(newRender);
    }, [requestList]);

    const acceptRequest = (f) => {
        console.log("accept request: ", f);
        // setuserID(id);
        // setOpenScheduleList(true);
    }

    const rejectRequest = (f) => {
        console.log("reject request: ", f);
        // setuserID(id);
        // setOpenScheduleList(true);
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