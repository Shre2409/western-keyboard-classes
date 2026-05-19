'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Stats = {
  totalStudents: number
  totalClasses: number
  missedClasses: number
  pendingFees: number
}

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [teacherName, setTeacherName] = useState('Teacher')
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalClasses: 0,
    missedClasses: 0,
    pendingFees: 0,
  })

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          router.replace('/login')
          return
        }

        // Get profile and verify teacher role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .single()

        if (profileError || !profile) {
          router.replace('/login')
          return
        }

        if (profile.role !== 'teacher') {
          router.replace('/student-dashboard')
          return
        }

        setTeacherName(profile.full_name || 'Teacher')

        // Load statistics
        const [{ count: studentCount }, { count: classCount }, { count: missedCount }, { count: pendingCount }] =
          await Promise.all([
            supabase
              .from('students')
              .select('*', { count: 'exact', head: true }),

            supabase
              .from('classes')
              .select('*', { count: 'exact', head: true }),

            supabase
              .from('classes')
              .select('*', { count: 'exact', head: true })
              .eq('status', 'Absent'),

            supabase
              .from('payments')
              .select('*', { count: 'exact', head: true })
              .eq('status', 'Pending'),
          ])

        setStats({
          totalStudents: studentCount || 0,
          totalClasses: classCount || 0,
          missedClasses: missedCount || 0,
          pendingFees: pendingCount || 0,
        })

        setLoading(false)
      } catch (error) {
        console.error('Dashboard error:', error)
        router.replace('/login')
      }
    }

    loadDashboard()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-medium text-gray-700">Loading dashboard...</p>
      </main>
    )
  }

  const statCards = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: '👨‍🎓',
    },
    {
      label: 'Classes Conducted',
      value: stats.totalClasses,
      icon: '🎹',
    },
    {
      label: 'Missed Classes',
      value: stats.missedClasses,
      icon: '📅',
    },
    {
      label: 'Pending Fees',
      value: stats.pendingFees,
      icon: '💰',
    },
  ]

  const actionCards = [
    {
      title: 'Manage Students',
      description: 'Add, edit, and view all student records.',
      href: '/students',
      icon: '👥',
    },
    {
      title: 'Attendance Tracker',
      description: 'Record every class and mark attendance.',
      href: '/attendance',
      icon: '📝',
    },
    {
      title: 'Fee Management',
      description: 'Track payments and pending dues.',
      href: '/payments',
      icon: '💳',
    },
    {
      title: 'Student Accounts',
      description: 'Create login accounts for students.',
      href: '/student-accounts',
      icon: '🔐',
    },
    {
      title: 'Reports & Analytics',
      description: 'View performance and revenue reports.',
      href: '/reports',
      icon: '📊',
    },
    {
      title: 'Notes & Materials',
      description: 'Upload PDFs and practice resources.',
      href: '/materials',
      icon: '📚',
    },
  ]

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🎹 Western Keyboard Classes
            </h1>
            <p className="text-sm text-gray-500">
              Admin Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-lg">
          <h2 className="text-4xl font-bold mb-2">
            Welcome back, {teacherName}! 👋
          </h2>
          <p className="text-blue-100 text-lg">
            Manage your students, classes, payments, and teaching materials.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{card.icon}</span>
                <span className="text-3xl font-bold text-gray-900">
                  {card.value}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500">
                {card.label}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h3>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {actionCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition"
              >
                <div className="text-5xl mb-4">{card.icon}</div>

                <h4 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  {card.title}
                </h4>

                <p className="text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}