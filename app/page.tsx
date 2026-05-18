import Link from 'next/link'

const features = [
  {
    title: 'Beginner to Advanced',
    description: 'Structured Western keyboard lessons for every skill level.',
    icon: '🎹',
  },
  {
    title: 'One-to-One Classes',
    description: 'Personal attention with customized lesson plans.',
    icon: '👨‍🏫',
  },
  {
    title: 'Flexible Scheduling',
    description: 'Choose class timings that fit your routine.',
    icon: '🕒',
  },
  {
    title: 'Online & Offline',
    description: 'Learn from home or attend in-person sessions.',
    icon: '💻',
  },
]

const levels = [
  'Beginner – Notes, Finger Exercises, Basic Songs',
  'Intermediate – Chords, Scales, Both-Hand Coordination',
  'Advanced – Music Theory, Improvisation, Performance Skills',
]

const testimonials = [
  {
    name: 'Aarav Sharma',
    text: 'I started as a complete beginner and can now play my favorite songs confidently.',
  },
  {
    name: 'Priya Verma',
    text: 'The classes are structured, engaging, and very easy to follow.',
  },
  {
    name: 'Rohan Mehta',
    text: 'Excellent teaching style with personalized guidance.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold text-blue-700">🎹 Western Keyboard Classes</div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-blue-700">Features</a>
            <a href="#courses" className="hover:text-blue-700">Courses</a>
            <a href="#testimonials" className="hover:text-blue-700">Reviews</a>
            <a href="#contact" className="hover:text-blue-700">Contact</a>
          </div>

          <a
            href="https://wa.me/919479966175"
            target="_blank"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            WhatsApp
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              🎵 Learn Western Keyboard Professionally
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 md:text-7xl">
              Master the
              <span className="block text-blue-700">Keyboard with Confidence</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
              Personalized Western keyboard lessons for beginners to advanced students.
              Learn notes, chords, scales, music theory, and your favorite songs.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="https://wa.me/919479966175"
                target="_blank"
                className="rounded-xl bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-green-700"
              >
                Join on WhatsApp
              </a>

              <Link
  href="/login"
  className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-700"
>
  Login
</Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span>✅ One-to-One Guidance</span>
              <span>✅ Flexible Timings</span>
              <span>✅ Online & Offline</span>
              <span>✅ Performance Preparation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold">Why Students Love These Classes</h2>
            <p className="mt-4 text-gray-600">
              A structured and engaging approach to Western keyboard learning.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg"
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Course Levels</h2>
            <p className="mt-4 text-gray-600">
              Progress step by step with a clear learning roadmap.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {levels.map((level, index) => (
              <div
                key={level}
                className="rounded-2xl bg-white p-8 shadow-sm"
              >
                <div className="mb-4 text-sm font-bold uppercase tracking-wide text-blue-600">
                  Level {index + 1}
                </div>
                <p className="text-lg font-medium text-gray-800">{level}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold">What Students Say</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <p className="text-gray-600">“{testimonial.text}”</p>
                <div className="mt-4 font-semibold text-gray-900">
                  {testimonial.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="bg-blue-700 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold">Start Your Musical Journey Today</h2>
          <p className="mt-4 text-lg text-blue-100">
            Join Western keyboard classes and learn to play with confidence.
          </p>

          <a
            href="https://wa.me/919479966175"
            target="_blank"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-700 shadow-lg hover:bg-gray-100"
          >
            Contact on WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-500">
           © 2026 Western Keyboard Classes. All rights reserved.
        </div>
      </footer>
    </main>
  )
}