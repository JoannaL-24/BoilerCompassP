import Popup from 'reactjs-popup'
import { Box, Modal, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import RemoteUserdata from 'models/RemoteUserData'
import { getSatisfied } from 'models/BoilerCompass'
import { CS } from 'models/CS'
import LocalUserData from 'models/LocalUserData'
import UserData from 'models/UserData'
import RecursiveTreeView from './RecursiveTreeView'
import './ScheduleView/ScheduleView.css'
import './Semester/Semester.css'
import './CoursePopup/CoursePopup.css'

const style = {
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'scroll',
}
export default function ReqModal({ open, handleClose, onReqSearch }) {
  const { currentUser } = useAuth()
  const [userData, setUserData] = useState<UserData>(new LocalUserData())
  const [completedCourses, setCompletedCourses] = useState([])
  const remote = new RemoteUserdata()
  useEffect(() => {
    userData.get('completed_courses').then((c) => {
      setCompletedCourses(c)
    })
  }, [])

  useEffect(() => {
    userData.get('completed_courses').then((c) => {
      setCompletedCourses(c)
    })
  }, [open])

  useEffect(() => {
    if (currentUser) {
      setUserData(remote)
      remote.get('completed_courses').then((c) => {
        setCompletedCourses(c)
      })
    }
  }, [currentUser])

  return (
    <Popup open={open} onClose={handleClose}>
      <div
        className='popupModal'
        style={{ minHeight: '400px', padding: '10px 20px' }}
      >
        <Typography id='modal-modal-title' variant='h4' component='h2'>
          Requirements Summary
        </Typography>

        <RecursiveTreeView req={CS} completedCourses={completedCourses} onReqSearch={onReqSearch} />
      </div>
    </Popup>
  )
}
