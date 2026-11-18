import { useState, useMemo } from 'react'
import CourseCard from '@/src/components/courses/CourseCard'
import { Search, SlidersHorizontal } from 'lucide-react'

const CATEGORIES = ['all', 'development', 'design', 'business', 'science', 'marketing', 'other']
const LEVELS     = ['all', 'beginner', 'intermediate', 'advanced']

export default function CoursesPage({ courses }) {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('all')
  const [level,    setLevel]    = useState('all')

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch   = c.title.toLowerCase().includes(search.toLowerCase()) ||
                            c.shortDescription?.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === 'all' || c.category === category
      const matchLevel    = level    === 'all' || c.level    === level
      return matchSearch && matchCategory && matchLevel
    })
  }, [courses, search, category, level])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
          <p className="text-gray-500">Explore {courses.length} courses across all categories</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search + filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Level filter */}
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="input-field sm:w-40 capitalize"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l} className="capitalize">
                  {l === 'all' ? 'All Levels' : l.charAt(0).toUpperCase() + l.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 self-center" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                  category === cat
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing <span className="font-semibold text-gray-900">{filtered.length}</span> courses
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No courses match your filters.</p>
            <button
              onClick={() => { setSearch(''); setCategory('all'); setLevel('all') }}
              className="mt-4 text-primary-500 hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export async function getStaticProps() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const res  = await fetch(`${baseUrl}/api/courses?limit=100`)
    const data = await res.json()
    return {
      props: { courses: data.courses || [] },
      revalidate: 30,
    }
  } catch {
    return { props: { courses: [] }, revalidate: 30 }
  }
}
