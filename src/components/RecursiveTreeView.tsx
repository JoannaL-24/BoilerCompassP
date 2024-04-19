import {
  Course,
  CourseCriterion,
  Requirement,
  RequirementCriterion,
} from 'models/BoilerCompass'
import { CS } from 'models/CS'
import React, { useState } from 'react'
import './RecursiveTreeView.css'

type ListItemProps = {
  course: Course
}

function ListItem({ course }: ListItemProps) {
  return (
    <li style={{ cursor: 'pointer' }}>
      {course.subject + ' ' + course.number}
    </li>
  )
}

type ListFolderProps = {
  name: string
  criteria: (CourseCriterion | RequirementCriterion)[]
  numNeeded: number
}

function ListFolder({ name, criteria, numNeeded }: ListFolderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  return (
    <li style={{ cursor: 'pointer' }}>
      <div onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? "▶" : "▼"}
        {" " + name + ` (${numNeeded} needed)`}
      </div>
      <ul
        style={{
          display: isCollapsed ? 'none' : 'block',
          borderLeft: '1px dotted black',
        }}
      >
        {criteria.map((crit, index) =>
          crit.type == 'requirement' ? (
            <ListFolder
              name={crit.requirement.name}
              criteria={crit.requirement.criteria}
              numNeeded={crit.requirement.numNeeded}
            />
          ) : (
            <ListItem course={crit.course} />
          ),
        )}
      </ul>
    </li>
  )
}

type RecursiveTreeViewProps = {
  req: Requirement
}

export default function RecursiveTreeView({ req }: RecursiveTreeViewProps) {
  console.log(req)
  return (
    <ListFolder
      name={req.name}
      criteria={req.criteria}
      numNeeded={req.numNeeded}
    />
  )
}
