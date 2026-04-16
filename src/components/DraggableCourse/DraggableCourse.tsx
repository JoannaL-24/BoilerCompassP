import React, { useState, useEffect } from 'react'
import Popup from 'reactjs-popup'
import { Draggable } from 'react-beautiful-dnd'
import './DraggableCourse.css'
import '../CoursePopup/CoursePopup.css'
import { purdueApiUrl } from 'models/purdueapi'
import { o } from 'odata'
import { Autocomplete, TextField } from '@mui/material'
import { display } from '@mui/system'
import { useAuth } from 'components/contexts/AuthContext'
import UserData from 'models/UserData'
import RemoteUserdata from 'models/RemoteUserData'
import LocalUserdata from 'models/LocalUserData'
import LocalUserData from 'models/LocalUserData'

type Meeting = {
  instructors: Array<string>
  building: string
  room: number
  daysOfWeek: string
  startTime: string

  // for example - PT50M
  // means period of time 50 minutes
  // https://stackoverflow.com/questions/51168022/what-does-pt-prefix-stand-for-in-duration
  duration: string
}

type DraggableCourseProps = {
  index: number
  id: string
  draggableId?: string
  course: string
  description: string
  credit: number
  classId: string // use this to query meetings info when opening popup
  meetings?: Array<Meeting>
  viewOnly: boolean
  onCourseGradeChange: (id: string, credits: number, points: number) => void
}

const pointOptions = [
  { label: 'N/A', val: null },
  { label: 'A+/A (4.0)', val: 4.0 },
  { label: 'A- (3.7)', val: 3.7 },
  { label: 'B+ (3.3)', val: 3.3 },
  { label: 'B (3.0)', val: 3.0 },
  { label: 'B- (2.7)', val: 2.7 },
  { label: 'C+ (2.3)-', val: 2.3 },
  { label: 'C (2.0)-', val: 2.0 },
  { label: 'C- (1.7)-', val: 1.7 },
  { label: 'D+ (1.3)-', val: 1.3 },
  { label: 'D (1.0)-', val: 1.0 },
  { label: 'D- (0.7)-', val: 0.7 },
  { label: 'F (0.0)-', val: 0.0 },
  { label: 'P, W, etc. (N/A)', val: null },
]

async function queryMeetings(classId: string): Promise<Meeting[]> {
  const oHandler = o(purdueApiUrl)
  try {
    const entities = await oHandler.get('Classes').query({
      $expand: `Sections($filter=Type eq 'Lecture';$expand=Meetings($expand=Instructors,Room($expand=Building)))`,
      $filter: `id eq ${classId}`,
    })
    // console.log("Entities: ", entities);

    const meetings: Array<Meeting> = entities[0].Sections[0].Meetings.map(
      (meeting) => ({
        instructors: meeting.Instructors.map((instructor) => instructor.Name),
        building: meeting.Room.Building.ShortCode,
        room: meeting.Room.Number,
        daysOfWeek: meeting.DaysOfWeek,
        startTime: meeting.StartTime,
        duration: meeting.Duration,
        classId: classId,
      }),
    )

    return meetings
  } catch (error) {
    console.error(error)
    return null
  }
}

const gradeToOption = (grade) => {
  switch (grade) {
    case 4.0:
      return 1
    case 3.7:
      return 2
    case 3.3:
      return 3
    case 3.0:
      return 4
    case 2.7:
      return 5
    case 2.3:
      return 6
    case 2.0:
      return 7
    case 1.7:
      return 8
    case 1.3:
      return 9
    case 1.0:
      return 10
    case 0.7:
      return 11
    case 0.0:
      return 12
  }
}

const DraggableCourse: React.FC<DraggableCourseProps> = ({
  index,
  id,
  draggableId,
  course,
  description,
  credit,
  classId,
  meetings,
  viewOnly,
  onCourseGradeChange = (a, b, c) => {
    /* dummy */
  },
}) => {
  const [meetingState, setMeetings] = useState<Array<Meeting> | undefined>(
    meetings,
  )

  const { currentUser } = useAuth()
  const remote = new RemoteUserdata()
  const [userData, setUserData] = useState<UserData>(new LocalUserData())
  const [grade, setGrade] = useState<number | null>(null)
  const [gradeValue, setGradeValue] = useState(pointOptions[0])
  const [gradeInputValue, setGradeInputValue] = useState(pointOptions[0].label)

  useEffect(() => {
    userData.get('course_grades').then((s) => {
      // console.log(s)
      if (s && s[id]) {
        const g = s[id][1]
        setGrade(g)
        // console.log(pointOptions[gradeToOption(g)])
        setGradeValue(pointOptions[gradeToOption(g)])
        setGradeInputValue(pointOptions[gradeToOption(g)].label)
        onCourseGradeChange(id, credit, g)
      }
    })
  }, [])

  useEffect(() => {
    if (currentUser) {
      setUserData(remote)
      remote.get('course_grades').then((s) => {
        if (s && s[id]) {
          const g = s[id][1]
          setGrade(g)
          setGradeValue(pointOptions[gradeToOption(g)])
          setGradeInputValue(pointOptions[gradeToOption(g)].label)
          onCourseGradeChange(id, credit, g)
        }
      })
    }
  }, [currentUser])

  useEffect(() => {
    setMeetings(meetings)
  }, [meetings, classId])

  const handleButtonClick = async () => {
    console.log('meetingState: ', meetingState)
    if (!meetingState) {
      const fetchedMeetings = await queryMeetings(classId)
      setMeetings(fetchedMeetings)
      console.log('Meetings fetched and set: ', fetchedMeetings)
    }
  }

  return (
    <Draggable
      style={{ zIndex: 9999 }}
      draggableId={draggableId || id}
      index={index}
      isDragDisabled={viewOnly}
    >
      {(provided) => (
        <div
          className='course'
          style={{ zIndex: 9999 }}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <Popup
            trigger={<button className='courseDetailBtn'>{course}</button>}
            modal
            nested
            onOpen={handleButtonClick}
          >
            {(close) => (
              <div className='popupModal' style={{ zIndex: 9999 }}>
                <button className='close' onClick={close}>
                  &times;
                </button>
                <div className='header' style={{ zIndex: 9999 }}>
                  {course}
                </div>
                <div className='content' style={{ zIndex: 9999 }}>
                  Course Description: <br />
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--textPrimary)',
                      zIndex: 9999,
                    }}
                  >
                    {description} <br />
                  </div>
                  <br />
                  Credit Hours: {credit}
                  <br />
                  {!viewOnly && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <>Expected/Earned Grade:</>
                      <Autocomplete
                        disablePortal
                        disableClearable
                        value={gradeValue}
                        inputValue={gradeInputValue}
                        onChange={(event: any, newValue) => {
                          const { label, val } = newValue
                          setGradeValue(newValue)
                          onCourseGradeChange(id, credit, val)
                        }}
                        onInputChange={(event, newInputValue) => {
                          setGradeInputValue(newInputValue)
                        }}
                        id='combo-box-demo'
                        options={pointOptions}
                        defaultValue={pointOptions[0]}
                        sx={{ width: 200, marginLeft: '0.5em' }}
                        renderInput={(params) => (
                          <TextField {...params} label='Grade' />
                        )}
                      />
                    </div>
                  )}
                </div>
                <div className='sessionText' style={{ zIndex: 9999 }}>
                  <h3>Course Sessions:</h3>
                </div>
                <div className='sessionsList' style={{ zIndex: 9999 }}>
                  {meetingState ? (
                    <div style={{ overflowY: 'scroll', height: '100px' }}>
                      {meetingState.map((meeting, index) => (
                        <div key={index}>
                          Instructor(s): {meeting.instructors.join(', ')}
                          <br />
                          Location: {meeting.building} Room {meeting.room}
                          <br />
                          Time: {meeting.daysOfWeek} at {meeting.startTime}
                          <br />
                          Duration: {meeting.duration}
                          <br />
                          <br />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>No meeting information available.</div>
                  )}
                </div>
              </div>
            )}
          </Popup>
        </div>
      )}
    </Draggable>
  )
}

export default DraggableCourse
