import { Redis } from '@upstash/redis'

// Serverless backend for production (Vercel). Local dev still uses server.mjs.
// Storage: a single Redis key holding the students array. Seeded on first read
// from the static /data/student.json that ships with the deployment.
const redis = Redis.fromEnv()
const KEY = 'students'

async function seedFromStaticFile() {
  const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''
  try {
    const res = await fetch(`${base}/data/student.json`)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data.students) ? data.students : []
  } catch {
    return []
  }
}

async function getStudents() {
  // @upstash/redis transparently JSON-encodes/decodes values.
  const stored = await redis.get(KEY)
  if (Array.isArray(stored)) return stored

  const seeded = await seedFromStaticFile()
  await redis.set(KEY, seeded)
  return seeded
}

function normalize(body, id) {
  return {
    id,
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
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const students = await getStudents()
      return res.status(200).json({ students })
    }

    if (req.method === 'POST') {
      const body = req.body ?? {}
      if (!body.rollNo?.toString().trim() || !body.name?.toString().trim()) {
        return res.status(400).json({ error: 'rollNo and name are required' })
      }

      const students = await getStudents()
      const nextId = students.reduce((max, s) => Math.max(max, s.id || 0), 0) + 1
      const student = normalize(body, nextId)

      students.push(student)
      await redis.set(KEY, students)
      return res.status(201).json(student)
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
