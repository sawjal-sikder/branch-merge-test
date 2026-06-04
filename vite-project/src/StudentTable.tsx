import React, { useEffect, useState } from 'react'
import './StudentTable.css'
import AddStudentForm from './AddStudentForm'
import type { Student } from './types'

const StudentTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/student.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load data (${res.status})`)
        return res.json()
      })
      .then((data) => {
        setStudents(data.students ?? [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const handleAdd = async (student: Student) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Save failed (${res.status})`)
      }
      const saved: Student = await res.json()
      setStudents((prev) => [...prev, saved])
    } catch (err) {
      alert(`Could not save student: ${(err as Error).message}`)
    }
  }

  if (loading) return <p className="status">Loading students…</p>
  if (error) return <p className="status error">Error: {error}</p>

  return (
    <div className="student-table-wrapper">
      <h2>Student Information</h2>

      <AddStudentForm onAdd={handleAdd} />

      {students.length === 0 ? (
        <p className="status">No students found.</p>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Course</th>
              <th>Year</th>
              <th>Section</th>
              <th>CGPA</th>
              <th>City</th>
              <th>Subjects</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.rollNo}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{s.age}</td>
                <td>{s.gender}</td>
                <td>{s.course}</td>
                <td>{s.year}</td>
                <td>{s.section}</td>
                <td>{s.cgpa}</td>
                <td>{s.address.city}</td>
                <td>{s.subjects.join(', ')}</td>
                <td>
                  <span className={s.active ? 'badge active' : 'badge inactive'}>
                    {s.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default StudentTable
