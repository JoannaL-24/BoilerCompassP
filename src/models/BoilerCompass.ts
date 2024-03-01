export type Course = {
  id: number
  subject: string
  number: number
  credit_hours: number
  prerequisite_course_ids: number[]
  distribution: string
}

export type Requirement = {
  id: number
  name: string
  credit_hours: number
  is_required: boolean
  is_fulfilled: boolean
}

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
