import { Box, Modal, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import RemoteUserdata from 'models/RemoteUserData'
import { getSatisfied } from 'models/BoilerCompass'
import { CalcReq, courses, CS, CSCoreReq, LinAlgReq, StatReq, TracksReq } from 'models/CS'
import LocalUserData from 'models/LocalUserData'
import UserData from 'models/UserData'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}
export default function ReqModal({ open, handleClose }) {
  const { currentUser } = useAuth()
  const [userData, setUserData] = useState<UserData>(new LocalUserData())
  const [majorSet, setMajorSet] = useState(new Set())
  const [completed, setCompleted] = useState({
    core: [0, 1],
    calc: [0, 1],
    stat: [0, 1],
    linalg: [0, 1],
    tracks: [0, 1],
  })
  const remote = new RemoteUserdata();
  useEffect(() => {
    userData.get('completed_courses').then((s) => {
      let set = new Set<string>(s)
      console.log(s)
      console.log(set)
      setCompleted({
        core: getSatisfied(CSCoreReq, set),
        calc: getSatisfied(CalcReq, set),
        stat: getSatisfied(StatReq, set),
        linalg: getSatisfied( LinAlgReq, set),
        tracks: getSatisfied(TracksReq, set),
      })
    })
    userData.get("prefer_majors").then((data) => {
      console.log(data)
      if (data[0].name == "Computer Science")
        setMajorSet(new Set<string>(["Computer Science"]))
    })
  }, [userData])
  useEffect(() => {
    if (currentUser) setUserData(remote)
  }, [currentUser])
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Typography id='modal-modal-title' variant='h4' component='h2'>
          Requirements Summary
        </Typography>

          {majorSet.has("Computer Science") ?
        <>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            CS Core Requirements: {completed.core[0] / completed.core[1] * 100}%
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            Calculus Requirement: {completed.calc[0] / completed.calc[1] * 100}%
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            Statistics Requirement: {completed.stat[0] / completed.stat[1] * 100}%
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            Linear Algebra Requirement: {completed.linalg[0] / completed.linalg[1] * 100}%
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            CS Tracks Requirement: {completed.core[0] / completed.core[1] * 100}%
          </Typography>
        </>
        : <></>
        }

      </Box>
    </Modal>
  )
}
