'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Student = {
  id: string
  name: string
  created_at: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Load all students from Supabase
  async function loadStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading students:', error.message)
      setMessage('Error loading students.')
      return
    }

    setStudents(data || [])
  }

  // Add a new student
  async function addStudent() {
    if (!name.trim()) {
      setMessage('Please enter a student name.')
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase
      .from('students')
      .insert([{ name: name.trim() }])

    setLoading(false)

    if (error) {
      console.error('Error adding student:', error.message)
      setMessage(`Error: ${error.message}`)
      return
    }

    setName('')
    setMessage('Student added successfully!')
    await loadStudents()
  }

  // Load students when page opens
  useEffect(() => {
    loadStudents()
  }, [])

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Students</h1>

      {/* Add Student Form */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter student name"
          className="border p-2 rounded w-full"
        />

        <button
          onClick={addStudent}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <p className="mb-4 text-sm text-gray-600">
          {message}
        </p>
      )}

      {/* Students List */}
      {students.length === 0 ? (
        <p className="text-gray-500">No students added yet.</p>
      ) : (
        <div className="space-y-2">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white p-4 rounded shadow border"
            >
              {student.name}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}