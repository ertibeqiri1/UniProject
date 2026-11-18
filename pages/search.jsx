import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import CourseCard from '@/src/components/courses/CourseCard'
import { Search, ArrowLeft } from 'lucide-react'

export default function SearchPage({ courses, query, total }) {
  const router   = useRouter()
  const [input, setInput] = useState(query || '')

  const handleSearch = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    router.push(`/search?q=${encodeURIComponent(input.trim())}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/courses" className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Browse all courses
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Courses</h1>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search for courses, topics, skills..."
                className="input-field pl-10"
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary px-6">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {query ? (
          <>
            <p className="text-sm text-gray-500 mb-6">
              {total > 0
                ? <>Found <span className="font-semibold text-gray-900">{total}</span> results for &ldquo;<span className="font-semibold text-gray-900">{query}</span>&rdquo;</>
                : <>No results for &ldquo;<span className="font-semibold text-gray-900">{query}</span>&rdquo;</>}
            </p>

            {courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No courses found.</p>
                <p className="text-gray-400 text-sm mt-2">Try different keywords or browse all courses.</p>
                <Link href="/courses" className="mt-4 inline-block text-primary-500 hover:underline text-sm">
                  Browse all courses
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500">Enter a search term to find courses.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const q = query.q?.trim() || ''

  if (!q) {
    return { props: { courses: [], query: '', total: 0 } }
  }

  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const res  = await fetch(`${baseUrl}/api/courses?search=${encodeURIComponent(q)}&limit=24`)
    const data = await res.json()
    return {
      props: {
        courses: data.courses || [],
        query:   q,
        total:   data.total || data.courses?.length || 0,
      },
    }
  } catch {
    return { props: { courses: [], query: q, total: 0 } }
  }
}
