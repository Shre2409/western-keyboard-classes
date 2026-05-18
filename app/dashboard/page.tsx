'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAccess() {
      // Get current logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // If not logged in, go to login page
      if (!user) {
        router.push('/login')
        return
      }

      // Get role from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      // If not a teacher, send to student dashboard
      if (profile?.role !== 'teacher') {
        router.push('/student-dashboard')
        return
      }

      // Teacher is allowed
      setLoading(false)
    }

    checkAccess()
  }, [router])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/students" className="p-6 bg-white rounded-xl shadow">
          Manage Students
        </Link>

        <Link href="/attendance" className="p-6 bg-white rounded-xl shadow">
          Track Classes
        </Link>

        <Link href="/payments" className="p-6 bg-white rounded-xl shadow">
          Fee Management
        </Link>
      </div>
    </main>
  )
}