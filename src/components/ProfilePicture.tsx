import React from 'react'
import { height, width } from "@mui/system"
import { Person } from '@mui/icons-material';

export const ProfilePicture = ({ src, style }) => {
  return (
    <> 
      {src ?
        <img src={src} style={{...style, width: "128px", height: "128px" }} /> :
        <Person style={{...style, width: "128px", height: "128px" }}/>}
    </>
  )
}
