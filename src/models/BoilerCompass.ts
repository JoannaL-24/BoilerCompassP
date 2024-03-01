type Course = {
  id: number
  subject: string
  number: number
  credit_hours: number
  prerequisite_course_ids: number[]
  distribution: string
}

type Requirement = {
  id: number
  name: string
  credit_hours: number
  is_required: boolean
  is_fulfilled: boolean
}

interface RequireSec extends Requirement {
  requirements: Requirement[]
}

interface RequireCourse extends Requirement {
  requirements: Course[]
}

type Semester = {
  term: Date
  course_list: Course[]
}

type Degree = {
  id: number
  name: string
  college: string
  school: string
  credit_hours: number
}

type Schedule = {
  id: number
  name: string
  start_term: Date
  end_term: Date
  semester_blocks: Semester[]
  majors: Degree[]
  minors: RequireSec[]
}

type Group = {
  id: number
  name: string
  host: Student
  members: User[]
}

type User = {
  name: string
  purdue_email: string
  dark_mode: boolean
  groups: Group[]
}

interface Student extends User {
  prefer_majors: Degree[]
  prefer_minor: RequireSec[]
  start_term: Date
  end_term: Date
  advisors: Advisor[]
  groups: Group[]
}

interface Advisor extends User {
  department: string
  office: string
  students: Student[]
}
