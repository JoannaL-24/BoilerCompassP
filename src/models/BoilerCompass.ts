export type Course = {
  id: string
  subject: string
  number: number
  credit_hours: number
  prerequisite_course_ids?: number[]
  distribution?: string
}

// export type Requirement = {
//   id: number
//   name: string
//   credit_hours: number
//   is_required: boolean
//   is_fulfilled: boolean
// }
//
export interface RequireSec extends Requirement {
  requirements: Requirement[]
}

export interface RequireCourse extends Requirement {
  requirements: Course[]
}

export type Semester = {
  id: number
  year: number
  term: string
  course_list: Course[]
}

export type Degree = {
  id: number
  name: string
  college: string
  school: string
  credit_hours: number
}

export type Schedule = {
  name: string
  start_term: Date
  end_term: Date
  semester_blocks: Semester[]
  majors: Degree[]
  minors: RequireSec[]
}

export type Group = {
  id: number
  name: string
  host: Student
  members: User[]
}

export type User = {
  name: string
  purdue_email: string
  dark_mode: boolean
  groups: Group[]
}

export interface Student extends User {
  prefer_majors: Degree[]
  prefer_minor: RequireSec[]
  start_term: Date
  end_term: Date
  advisors: Advisor[]
  groups: Group[]
  completed_courses: string[]
}

export interface Advisor extends User {
  department: string
  office: string
  students: Student[]
}

export interface CourseCriterion {
  type: 'course'
  course: Course
}

export interface RequirementCriterion {
  type: 'requirement'
  requirement: Requirement
}

/* Requirement interface
 * A requirement consists of a list of "criteria": either a list of actual
 * courses or a list of requirements, plus a number of the listed element that
 * needs to be satisfied in order for the requirement itself to be satisfied.
 *
 * A "pick N of the following" requirement can be achieved with a numNeeded of
 * N, and a "must satisfy all" requirement can be achieved with a numNeeded
 * equal to the size of the list of criteria.
 */
export interface Requirement {
  numNeeded: number
  criteria: (CourseCriterion | RequirementCriterion)[]
}

export function getSatisfied(
  req: Requirement,
  completedCourseIds: Set<string>,
): [number, number] {
  const crits: Array<Array<number>> = []
  req.criteria.forEach((criterion) => {
    if (criterion.type === 'course') {
      let c = [0, 1]
      if (completedCourseIds.has(criterion.course.id)) c[0] = 1
      crits.push(c)
    }

    if (criterion.type === 'requirement') {
      let c = getSatisfied(criterion.requirement, completedCourseIds)
      crits.push(c)
    }
  })

  crits.sort((a, b) => {
    return a[0] / a[1] - b[0] / b[1]
  })

  let completedCt = 0
  let totalCt = 0
  for (let i = 0; i < req.numNeeded; ++i) {
    let crit = crits.pop()
    completedCt += crit[0]
    totalCt += crit[1]
  }

  return [completedCt, totalCt]
}
