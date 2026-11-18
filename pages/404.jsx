import Link from 'next/link'
import { GraduationCap, Home, BookOpen } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Big 404 */}
        <div className="text-[120px] sm:text-[160px] font-black leading-none text-primary-100 select-none mb-2">
          404
        </div>

        {/* Icon */}
        <div className="flex justify-center -mt-6 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Looks like this lesson doesn&apos;t exist. The page you&apos;re looking for may have been moved
          or deleted.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/courses"
            className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <BookOpen className="w-4 h-4" />
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  )
}
