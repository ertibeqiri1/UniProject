import Link from 'next/link'
import { Star, Users, Heart } from 'lucide-react'
import { useWishlist } from '@/src/context/WishlistContext'
import { useAuth } from '@/src/context/AuthContext'

const categoryColors = {
  development: 'bg-blue-100 text-blue-700',
  design:      'bg-purple-100 text-purple-700',
  business:    'bg-yellow-100 text-yellow-700',
  science:     'bg-green-100 text-green-700',
  marketing:   'bg-pink-100 text-pink-700',
  other:       'bg-gray-100 text-gray-700',
}

const levelColors = {
  beginner:     'bg-green-50 text-green-600',
  intermediate: 'bg-yellow-50 text-yellow-600',
  advanced:     'bg-red-50 text-red-600',
}

export default function CourseCard({ course }) {
  const { user } = useAuth()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const inWishlist = isInWishlist(course._id)

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!user) return
    inWishlist ? await removeFromWishlist(course._id) : await addToWishlist(course._id)
  }

  return (
    <Link href={`/courses/${course.slug}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden h-full flex flex-col">

        {/* Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-400">
                {course.title?.charAt(0)}
              </span>
            </div>
          )}

          {/* Price badge */}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              course.price === 0
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-900 shadow-sm'
            }`}>
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </span>
          </div>

          {/* Wishlist button */}
          {user && (
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
            >
              <Heart
                className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${categoryColors[course.category] || categoryColors.other}`}>
              {course.category}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${levelColors[course.level] || levelColors.beginner}`}>
              {course.level}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
            {course.title}
          </h3>

          {/* Instructor */}
          <p className="text-xs text-gray-500 mb-3">by {course.instructorName}</p>

          {/* Short description */}
          {course.shortDescription && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">
              {course.shortDescription}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-700">
                {course.averageRating || '0.0'}
              </span>
              <span className="text-xs text-gray-400">({course.reviewCount || 0})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs">{course.enrollmentCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
