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
  term: Date
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
  id: number
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

export function isSatisfied(
  req: Requirement,
  completedCourseIds: Set<string>,
): boolean {
  let ct = 0

  req.criteria.forEach((criterion) => {
    if (criterion.type === 'course') {
      if (completedCourseIds.has(criterion.course.id) && ++ct >= req.numNeeded)
        return
    }

    if (criterion.type === 'requirement') {
      if (
        isSatisfied(criterion.requirement, completedCourseIds) &&
        ++ct >= req.numNeeded
      )
        return
    }
  })

  return ct >= req.numNeeded
}
