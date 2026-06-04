import express from 'express'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, 'public', 'data', 'student.json')

const app = express()
app.use(express.json())

async function readStudents() {
  const raw = await readFile(DATA_FILE, 'utf-8')
  const data = JSON.parse(raw || '{"students":[]}')
  return Array.isArray(data.students) ? data.students : []
}

async function writeStudents(students) {
  await writeFile(DATA_FILE, JSON.stringify({ students }, null, 2) + '\n', 'utf-8')
}

// GET all students
app.get('/api/students', async (_req, res) => {
  try {
    res.json({ students: await readStudents() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST a new student -> appended to student.json
app.post('/api/students', async (req, res) => {
  try {
    const body = req.body ?? {}
    if (!body.rollNo?.trim() || !body.name?.trim()) {
      return res.status(400).json({ error: 'rollNo and name are required' })
    }

    const students = await readStudents()
    const nextId = students.reduce((max, s) => Math.max(max, s.id || 0), 0) + 1

    const student = {
      id: nextId,
      rollNo: String(body.rollNo).trim(),
      name: String(body.name).trim(),
      email: String(body.email ?? '').trim(),
      phone: String(body.phone ?? '').trim(),
      age: Number(body.age) || 0,
      gender: body.gender ?? 'Other',
      course: String(body.course ?? '').trim(),
      year: Number(body.year) || 1,
      section: String(body.section ?? '').trim(),
      cgpa: Number(body.cgpa) || 0,
      address: {
        city: String(body.address?.city ?? '').trim(),
        state: String(body.address?.state ?? '').trim(),
        country: String(body.address?.country ?? '').trim(),
      },
      subjects: Array.isArray(body.subjects) ? body.subjects : [],
      active: body.active !== false,
    }

    students.push(student)
    await writeStudents(students)
    res.status(201).json(student)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
