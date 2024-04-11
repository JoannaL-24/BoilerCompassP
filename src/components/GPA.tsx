import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LocalUserData from 'models/LocalUserData'
import RemoteUserdata from 'models/RemoteUserData'
import UserData from 'models/UserData'
import React, { useState, useEffect } from 'react'
import { useAuth } from './contexts/AuthContext'

type GPAProps = {
  completed_courses: string[]
  course_grades: Map<string, number>
}

const getCreditHours = (id: string) => {
  // TODO fix this
  return 3;
}

export function GPA({ completed_courses, course_grades }: GPAProps) {
  const completed_set = new Set(completed_courses)
  let total_weighted = 0.0
  let cumu_weighted = 0.0
  let total_credits = 0
  let completed_credits = 0
  course_grades.forEach((points, id) => {
    let credits = getCreditHours(id)
    total_credits += credits
    total_weighted += points * credits

    if (completed_set.has(id)) {
      completed_credits += credits
      cumu_weighted += points * credits
    }
  })

  let cumu_str = completed_credits == 0 ? "N/A" : `Cumul. GPA: ${(cumu_weighted / completed_credits).toFixed(2)}`;
  let exp_str = total_credits == 0 ? "N/A" : `Expected GPA: ${(total_weighted / total_credits).toFixed(2)}`;
    
  return (
    <Box sx={{ marginLeft: '0.3em', display: 'flex', minWidth: 250 }}>
      <Typography
        className='label'
        variant='body2'
        color='#CEB888'
      >{cumu_str}</Typography>
      <Typography
        className='label'
        variant='body2'
        color='#CEB888'
        marginLeft='1em'
      >{exp_str}</Typography>
    </Box>
  )
}
