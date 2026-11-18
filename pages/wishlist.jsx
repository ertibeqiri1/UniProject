import Link from 'next/link'
import { Heart, BookOpen } from 'lucide-react'
import { useAuth } from '@/src/context/AuthContext'
import { useWishlist } from '@/src/context/WishlistContext'
import CourseCard from '@/src/components/courses/CourseCard'

export default function WishlistPage() {
  const { user, loading } = useAuth()
  const { wishlist } = useWishlist()

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-48" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-primary-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to view your wishlist</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Save courses you&apos;re interested in and come back to them anytime.
          </p>
          <Link href="/auth/signin" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
          <Heart className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-500 text-sm">
            {wishlist.length} {wishlist.length === 1 ? 'course' : 'courses'} saved
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6 text-sm">
            Browse our courses and click the heart icon to save ones you like.
          </p>
          <Link href="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((course) =>
            course && course._id ? (
              <CourseCard key={course._id} course={course} />
            ) : null
          )}
        </div>
      )}
    </div>
  )
}
