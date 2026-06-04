import React, { useState } from 'react'
import type { Student } from './types'

interface Props {
  onAdd: (student: Student) => void
}

const empty = {
  rollNo: '',
  name: '',
  email: '',
  phone: '',
  age: '',
  gender: 'Male',
  course: '',
  year: '1',
  section: '',
  cgpa: '',
  city: '',
  state: '',
  country: 'India',
  subjects: '',
  active: true,
}

const AddStudentForm: React.FC<Props> = ({ onAdd }) => {
  const [form, setForm] = useState(empty)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.rollNo.trim() || !form.name.trim()) {
      alert('Roll No and Name are required.')
      return
    }

    const newStudent: Student = {
      id: Date.now(),
      rollNo: form.rollNo.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      age: Number(form.age) || 0,
      gender: form.gender,
      course: form.course.trim(),
      year: Number(form.year) || 1,
      section: form.section.trim(),
      cgpa: Number(form.cgpa) || 0,
      address: {
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
      },
      subjects: form.subjects
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      active: form.active,
    }

    onAdd(newStudent)
    setForm(empty)
  }

  return (
    <form className="add-student-form" onSubmit={handleSubmit}>
      <h3>Add Student</h3>
      <div className="form-grid">
        <input name="rollNo" placeholder="Roll No *" value={form.rollNo} onChange={handleChange} />
        <input name="name" placeholder="Name *" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input name="course" placeholder="Course" value={form.course} onChange={handleChange} />
        <input name="year" type="number" placeholder="Year" value={form.year} onChange={handleChange} />
        <input name="section" placeholder="Section" value={form.section} onChange={handleChange} />
        <input name="cgpa" type="number" step="0.1" placeholder="CGPA" value={form.cgpa} onChange={handleChange} />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
        <input name="state" placeholder="State" value={form.state} onChange={handleChange} />
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} />
        <input name="subjects" placeholder="Subjects (comma separated)" value={form.subjects} onChange={handleChange} />
        <label className="checkbox">
          <input name="active" type="checkbox" checked={form.active} onChange={handleChange} />
          Active
        </label>
      </div>
      <button type="submit">Add Student</button>
    </form>
  )
}

export default AddStudentForm
