import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Western Keyboard Classes
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Learn keyboard from beginner to advanced.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="https://wa.me/919479966175"
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Join on WhatsApp
          </a>

          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Open Dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}