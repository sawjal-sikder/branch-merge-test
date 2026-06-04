export interface Address {
  city: string
  state: string
  country: string
}

export interface Student {
  id: number
  rollNo: string
  name: string
  email: string
  phone: string
  age: number
  gender: string
  course: string
  year: number
  section: string
  cgpa: number
  address: Address
  subjects: string[]
  active: boolean
}
