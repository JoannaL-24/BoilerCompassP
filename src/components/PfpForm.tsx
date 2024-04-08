import React, {
  useState,
  ChangeEvent,
  ChangeEventHandler,
  useRef,
  useEffect,
} from 'react'
import { Button, FormControl, Slider, SliderOwnProps } from '@mui/material'
import { Box } from '@mui/system'
import { useForm } from 'react-hook-form'
import { useAuth } from './contexts/AuthContext'
import AvatarEditor from 'react-avatar-editor'
import { getUserPfpURL, uploadUserPfp } from 'models/firebase'
import { ProfilePicture } from './ProfilePicture'
import axios from 'axios';

export const PfpForm = () => {
  const [currentPfpURL, setCurrentPfpURL] = useState<string>()
  const [pfp, setPfp] = useState<File>()
  const [pfpZoom, setPfpZoom] = useState<number>()
  const avEditorRef = useRef(null)

  const { currentUser } = useAuth()

  const handleFileUploaded: ChangeEventHandler = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.currentTarget.files
    setPfp(file[0])
  }

  const handleSliderChanged = (
    e: Event,
    value: number,
    activeThumb: number,
  ) => {
    setPfpZoom(1.0 + (2 * value) / 100.0)
  }

  const submit = () => {
    if (pfp && avEditorRef.current) {
      const imageCropped = avEditorRef.current.getImage()
      imageCropped.toBlob((blob) => {
        uploadUserPfp(blob, currentUser)
          .then(() => {
            // check if image is good or not
            axios({
              method: 'post',
              url: 'http://127.0.0.1:5001/boilercompass-3135d/us-central1/filter_image',
              // url: 'https://us-central1-boilercompass-3135d.cloudfunctions.net/filter_image',
              data: currentUser.uid,
            })
              .then((response) => {
                if (response.data == "YES") {
                  setCurrentPfpURL((window.URL || window.webkitURL).createObjectURL(blob))
                  alert(
                    'Profile picture successfully uploaded for uid ' +
                    currentUser.uid,
                  )
                } else {
                  alert(
                    'Profile picture contains inappropriate content. Please upload a different image.',
                  )
                }
              })
              .catch((error) => {
                console.error('Filter Error:', error);
              });
          })
          .catch((err) => {
            alert('Profile picture failed to upload!')
            console.log(err)
          })
      })
    } else
      alert(
        'No profile picture was submitted, or the avatar editor failed to initialize!',
      )
  }

  const setEditorRef = (editor) => {
    avEditorRef.current = editor
  }

  useEffect(() => {
    console.log(currentUser)
    if (currentUser)
      getUserPfpURL(currentUser).then((url) => {
        console.log(url)
        setCurrentPfpURL(url)
      }).catch((err) => console.log(err))
  }, [currentUser])

  return (
    <>
      <Box>
        <FormControl
          disabled={currentUser == null}
          display='flex'
          style={{ width: 400 }}
        >
          <ProfilePicture src={currentPfpURL} style={{ margin: "1em", alignSelf: "center" }} />
          <input
            hidden
            accept='image/*'
            id='raised-button-file'
            type='file'
            onChange={handleFileUploaded}
          />
          <label htmlFor='raised-button-file'>
            <Button
              disabled={currentUser == null}
              variant='contained'
              component='span'
            >
              Upload Profile Picture
            </Button>
          </label>{' '}
          {pfp && (
            <>
              <AvatarEditor
                ref={setEditorRef}
                image={pfp}
                width={256}
                height={256}
                border={10}
                scale={pfpZoom}
                style={{ alignSelf: 'center', margin: '2em' }}
              />
              <Slider
                onChange={handleSliderChanged}
                style={{ alignSelf: 'center', margin: '1em' }}
              />
              <Button
                disabled={currentUser == null}
                variant='contained'
                component='span'
                onClick={submit}
              >
                Submit
              </Button>
            </>
          )}
        </FormControl>
      </Box>
    </>
  )
}
