'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Student = {
  id: string
  name: string
  phone: string | null
  email: string | null
  course: string | null
  monthly_fee: number | null
  joining_date: string | null
  active: boolean | null
  created_at: string
}

type StudentForm = {
  name: string
  phone: string
  course: string
  monthly_fee: string
}

const emptyForm: StudentForm = {
  name: '',
  phone: '',
  course: 'Beginner',
  monthly_fee: '',
}

export default function StudentsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [form, setForm] = useState<StudentForm>(emptyForm)
  const [message, setMessage] = useState('')

  // Protect page: only teacher can access
  useEffect(() => {
    async function checkAccess() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'teacher') {
        router.replace('/student-dashboard')
        return
      }

      await loadStudents()
      setLoading(false)
    }

    checkAccess()
  }, [router])

  // Load students
  async function loadStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading students:', error.message)
      return
    }

    setStudents(data || [])
  }

  // Open Add Student modal
  function openAddModal() {
    setEditingStudent(null)
    setMessage('')
    setShowModal(true)
  }

  // Open Edit Student modal
  function openEditModal(student: Student) {
    setEditingStudent(student)
    setForm({
      name: student.name || '',
      phone: student.phone || '',
      course: student.course || 'Beginner',
      monthly_fee: student.monthly_fee?.toString() || '',
    })
    setMessage('')
    setShowModal(true)
  }

  // Save student (Add or Update)
  async function saveStudent() {
    if (!form.name.trim()) {
      setMessage('Student name is required.')
      return
    }

    setSaving(true)
    setMessage('')

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      
      course: form.course.trim() || null,
      monthly_fee: form.monthly_fee
        ? Number(form.monthly_fee)
        : null,
    }

    if (editingStudent) {
      const { error } = await supabase
        .from('students')
        .update(payload)
        .eq('id', editingStudent.id)

      if (error) {
        setMessage(error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('students')
        .insert([payload])

      if (error) {
        setMessage(error.message)
        setSaving(false)
        return
      }
    }

    await loadStudents()
    setSaving(false)
    setShowModal(false)
    setForm(emptyForm)
    setEditingStudent(null)
  }

  // Delete student
  async function deleteStudent(studentId: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this student?'
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId)

    if (error) {
      alert(error.message)
      return
    }

    await loadStudents()
  }

  // Toggle active/inactive
  async function toggleStudentStatus(student: Student) {
    const { error } = await supabase
      .from('students')
      .update({
        active: !student.active,
      })
      .eq('id', student.id)

    if (error) {
      alert(error.message)
      return
    }

    await loadStudents()
  }

  // Filter students
  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase().trim()

    if (!q) return students

    return students.filter((student) => {
      return (
        student.name?.toLowerCase().includes(q) ||
        student.phone?.toLowerCase().includes(q) ||
        student.email?.toLowerCase().includes(q)
      )
    })
  }, [students, search])

  // Statistics
  const totalStudents = students.length
  const activeStudents = students.filter(
    (s) => s.active !== false
  ).length
  const inactiveStudents = students.filter(
    (s) => s.active === false
  ).length

  const newThisMonth = students.filter((student) => {
    if (!student.joining_date) return false

    const joiningDate = new Date(student.joining_date)
    const now = new Date()

    return (
      joiningDate.getMonth() === now.getMonth() &&
      joiningDate.getFullYear() === now.getFullYear()
    )
  }).length

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-medium text-gray-700">
          Loading students...
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Manage Students
            </h1>
            <p className="mt-2 text-gray-600">
              Add, edit, and manage all your students.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow hover:bg-blue-700"
          >
            + Add Student
          </button>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            icon="👨‍🎓"
            label="Total Students"
            value={totalStudents}
          />
          <StatCard
            icon="✅"
            label="Active Students"
            value={activeStudents}
          />
          <StatCard
            icon="⏸️"
            label="Inactive Students"
            value={inactiveStudents}
          />
          <StatCard
            icon="🆕"
            label="New This Month"
            value={newThisMonth}
          />
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Student Cards */}
        {filteredStudents.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <p className="text-gray-500">
              No students found.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
  <div className="flex items-center gap-2">
    <h3 className="text-xl font-bold text-gray-900">
      {student.name}
    </h3>

    {student.phone && (
      <a
        href={`https://wa.me/${student.phone.replace(/\\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl"
        title="Chat on WhatsApp"
      >
        💬
      </a>
    )}
  </div>

  <p className="text-sm text-gray-500">
    {student.course || 'No course assigned'}
  </p>
</div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      student.active === false
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {student.active === false
                      ? 'Inactive'
                      : 'Active'}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                 <p>
  📱 {student.phone || 'WhatsApp not provided'}
</p>
                  <p>
                    📧 {student.email || 'Not provided'}
                  </p>
                  <p>
                    💰 ₹
                    {student.monthly_fee != null
                      ? student.monthly_fee
                      : 'Not set'}
                  </p>
                  <p>
                    📅 Joined:{' '}
                    {student.joining_date || 'Not set'}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2">
  {/* Edit Button */}
  <button
    onClick={() => openEditModal(student)}
    className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
  >
    Edit
  </button>

  {/* WhatsApp Button */}
  {student.phone ? (
    <a
      href={`https://wa.me/${student.phone.replace(/\D/g, '')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 text-center"
    >
      WhatsApp
    </a>
  ) : (
    <button
      disabled
      className="rounded-lg bg-gray-300 px-3 py-2 text-sm font-medium text-gray-500 cursor-not-allowed"
    >
      WhatsApp
    </button>
  )}

  {/* Activate / Deactivate Button */}
  <button
    onClick={() => toggleStudentStatus(student)}
    className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-600"
  >
    {student.active === false ? 'Activate' : 'Deactivate'}
  </button>

  {/* Attendance Button */}
  <button
    onClick={() =>
      router.push(`/attendance?student=${student.id}`)
    }
    className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700"
  >
    Attendance
  </button>

  {/* Delete Button */}
  <button
    onClick={() => deleteStudent(student.id)}
    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 col-span-2"
  >
    Delete
  </button>
</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              {editingStudent ? 'Edit Student' : 'Add Student'}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Student Name *"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
              />

              <input
  type="text"
  placeholder="WhatsApp Number (e.g. 919876543210)"
  value={form.phone}
  onChange={(e) =>
    setForm({
      ...form,
      phone: e.target.value,
    })
  }
  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
/>

              

              <select
                value={form.course}
                onChange={(e) =>
                  setForm({
                    ...form,
                    course: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>

              <input
                type="number"
                placeholder="Monthly Fee (₹)"
                value={form.monthly_fee}
                onChange={(e) =>
                  setForm({
                    ...form,
                    monthly_fee: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
              />

              {message && (
                <p className="text-sm font-medium text-red-600">
                  {message}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={saveStudent}
                  disabled={saving}
                  className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : editingStudent
                    ? 'Update Student'
                    : 'Add Student'}
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg bg-gray-200 py-3 font-semibold text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-4xl">{icon}</span>
        <span className="text-3xl font-bold text-gray-900">
          {value}
        </span>
      </div>
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>
    </div>
  )
}