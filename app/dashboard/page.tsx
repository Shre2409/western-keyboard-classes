import Link from 'next/link'

export default function Dashboard() {
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