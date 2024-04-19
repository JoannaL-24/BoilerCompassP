import {
  Course,
  CourseCriterion,
  getSatisfied,
  Requirement,
  RequirementCriterion,
} from 'models/BoilerCompass'
import { CS } from 'models/CS'
import React, { useState } from 'react'
import './RecursiveTreeView.css'
import './CoursePopup/CoursePopup.css'
import SearchIcon from '@mui/icons-material/Search';

type ListItemProps = {
  course: Course
  completed: boolean
  onReqSearch: (name: string, searchedCourses: string[]) => void
}

const SearchButton = ({ onclick }) => {
  return <SearchIcon sx={{maxHeight: "0.75em"}} onClick={onclick} />
}


function ListItem({ course, completed, onReqSearch }: ListItemProps) {
  const [showSearch, setShowSearch] = useState(false)
  const handleMagClick = () => {
    onReqSearch(`${course.subject} ${course.number}`, [course.id])
  }
  return (
    <li
      style={{
        cursor: 'pointer',
        width: 'max-content',
        textDecoration: completed ? 'line-through' : '',
        display: 'flex'
      }}
      onMouseEnter={() => setShowSearch(true)}
      onMouseLeave={() => setShowSearch(false)}
    >
      {course.subject + ' ' + course.number}
      {showSearch && <SearchButton onclick={handleMagClick} />}
    </li>
  )
}

type ListFolderProps = {
  name: string
  req: Requirement
  numNeeded: number
  completedCourses: string[]
  onReqSearch: (name: string, searchedCourses: string[]) => void
}

function ListFolder({
  name,
  req,
  numNeeded,
  completedCourses,
  onReqSearch,
}: ListFolderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [done, total] = getSatisfied(req, new Set(completedCourses))
  const [showSearch, setShowSearch] = useState(false)
  const completion = ((done / total) * 100).toFixed(2)
  const handleClick = () => {
    setIsCollapsed(!isCollapsed)
  }
  const handleMagClick = () => {
    const s = new Set<string>()
    const rec = (crits: (CourseCriterion | RequirementCriterion)[]) => {
      crits.forEach((crit) => {
        if (crit.type == 'course') s.add(crit.course.id)
        else rec(crit.requirement.criteria)
      })
    }
    rec(req.criteria)
    onReqSearch(name, [...s])
  }
  return (
    <li
      onMouseEnter={() => setShowSearch(true)}
      onMouseLeave={() => setShowSearch(false)}
    >
      <div
        style={{ display: 'flex', cursor: 'pointer', width: 'max-content' }}
        className='content'
        onClick={handleClick}
      >
        {isCollapsed ? '▶' : '▼'}
        {' ' + name + ` (${numNeeded} needed) ${completion}%`}
        {showSearch && <SearchButton onclick={handleMagClick} />}
      </div>
      <ul
        style={{
          display: isCollapsed ? 'none' : 'block',
          borderLeft: '1px dotted black',
        }}
      >
        {req.criteria.map((crit, index) =>
          crit.type == 'requirement' ? (
            <ListFolder
              key={index}
              name={crit.requirement.name}
              req={crit.requirement}
              completedCourses={completedCourses}
              numNeeded={crit.requirement.numNeeded}
              onReqSearch={onReqSearch}
            />
          ) : (
            <ListItem
              course={crit.course}
              completed={new Set(completedCourses).has(crit.course.id)}
              onReqSearch={onReqSearch}
            />
          ),
        )}
      </ul>
    </li>
  )
}

type RecursiveTreeViewProps = {
  req: Requirement
  completedCourses: string[]
  onReqSearch: (name: string, searchedCourses: string[]) => void
}

export default function RecursiveTreeView({
  req,
  completedCourses,
  onReqSearch,
}: RecursiveTreeViewProps) {
  return (
    <ListFolder
      name={req.name}
      req={req}
      numNeeded={req.numNeeded}
      completedCourses={completedCourses}
      onReqSearch={onReqSearch}
    />
  )
}
