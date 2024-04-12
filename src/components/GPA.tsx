import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LocalUserData from 'models/LocalUserData'
import { purdueApiUrl } from 'models/purdueapi'
import RemoteUserdata from 'models/RemoteUserData'
import UserData from 'models/UserData'
import { o } from 'odata'
import React, { useState, useEffect } from 'react'
import { useAuth } from './contexts/AuthContext'

type GPAProps = {
  completed_courses: string[]
  course_grades: Object
}

const getCreditHours = async (id: string) => {
  const oHandler = o(purdueApiUrl)
  let course = await oHandler.get('Courses').query({
    $top: 1,
    $expand: `Classes($filter=Campus/Code eq 'PWL';$top=1)`,
    $filter: `id eq ${id}`,
  })
  return course.CreditHours
}

export function GPA({ completed_courses, course_grades }: GPAProps) {
  const completed_set = new Set(completed_courses)
  let total_weighted = 0.0
  let cumu_weighted = 0.0
  let total_credits = 0
  let completed_credits = 0
  let a =new Map<string, number>()
  a.set("salkjdlkasjd", 1337.69420)
  Object.keys(course_grades).forEach(id => {
    let points = course_grades[id]
    getCreditHours(id).then((credits) => {
      total_credits += credits
      total_weighted += points * credits

      if (completed_set.has(id)) {
        completed_credits += credits
        cumu_weighted += points * credits
      }
    })
  })

  let cumu_str = "Cumul. GPA: " + (
    completed_credits == 0
      ? 'N/A'
      : `${(cumu_weighted / completed_credits).toFixed(2)}`)
  let exp_str = "Expected GPA: " + (
    total_credits == 0
      ? 'N/A'
      : `${(total_weighted / total_credits).toFixed(2)}`)

  return (
    <Box sx={{ marginLeft: '0.3em', marginRight: '5em', display: 'flex', minWidth: 100 }}>
      <Typography className='label' variant='body2' color='#CEB888'>
        {cumu_str}
      </Typography>
      <Typography
        className='label'
        variant='body2'
        color='#CEB888'
        marginLeft='1em'
      >
        {exp_str}
      </Typography>
    </Box>
  )
}
