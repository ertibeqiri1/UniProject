import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Star, Users, Clock, BookOpen, ChevronDown, ChevronUp, Heart, ArrowLeft } from 'lucide-react'
import { useWishlist } from '@/src/context/WishlistContext'
import dbConnect from '@/src/lib/dbConnect'
import Course from '@/src/models/Course'
import Review from '@/src/models/Review'

const categoryColors = {
  development: 'bg-blue-100 text-blue-700',
  design:      'bg-purple-100 text-purple-700',
  business:    'bg-yellow-100 text-yellow-700',
  science:     'bg-green-100 text-green-700',
  marketing:   'bg-pink-100 text-pink-700',
  other:       'bg-gray-100 text-gray-700',
}

export default function CourseDetailPage({ course, reviews: initialReviews }) {
  const { data: session } = useSession()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [reviews, setReviews]           = useState(initialReviews)
  const [openSection, setOpenSection]   = useState(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating]             = useState(5)
  const [comment, setComment]           = useState('')
  const [submitting, setSubmitting]     = useState(false)
  const [enrolled, setEnrolled]         = useState(false)

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Course not found.</p>
        <Link href="/courses" className="text-primary-500 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to courses
        </Link>
      </div>
    )
  }

  const inWishlist = isInWishlist(course._id)

  const handleEnroll = async () => {
    if (!session) return
    try {
      await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course._id }),
      })
      setEnrolled(true)
    } catch {}
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!session) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course._id, rating, comment }),
      })
      if (res.ok) {
        const { review } = await res.json()
        setReviews((prev) => [review, ...prev])
        setShowReviewForm(false)
        setComment('')
        setRating(5)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Link href="/courses" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: info */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${categoryColors[course.category] || categoryColors.other}`}>
                  {course.category}
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 text-white capitalize">
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">{course.title}</h1>
              <p className="text-gray-300 text-lg mb-6">{course.shortDescription}</p>

              {/* Meta row */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-white">{course.averageRating || '0.0'}</span>
                  <span>({course.reviewCount || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{course.enrollmentCount || 0} students</span>
                </div>
                {course.duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                )}
                {course.curriculum?.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.curriculum.length} sections</span>
                  </div>
                )}
              </div>

              <p className="text-gray-400 text-sm">
                Instructor: <span className="text-white font-medium">{course.instructorName}</span>
              </p>
            </div>

            {/* Right: enroll card */}
            <div className="lg:col-span-1">
              <div className="bg-white text-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full aspect-video object-cover" />
                ) : (
                  <div className="w-full aspect-video bg-primary-100 flex items-center justify-center">
                    <span className="text-5xl font-bold text-primary-400">{course.title?.charAt(0)}</span>
                  </div>
                )}
                <div className="p-6">
                  <p className="text-3xl font-bold text-gray-900 mb-5">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </p>

                  {session ? (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolled}
                      className="w-full btn-primary mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {enrolled ? 'Enrolled!' : 'Enroll Now'}
                    </button>
                  ) : (
                    <Link href="/auth/signin" className="block w-full text-center btn-primary mb-3">
                      Sign in to Enroll
                    </Link>
                  )}

                  <button
                    onClick={() => inWishlist ? removeFromWishlist(course._id) : addToWishlist(course._id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-sm font-medium text-gray-600"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                    {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            {/* Description */}
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this course</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{course.description}</p>
            </section>

            {/* Curriculum */}
            {course.curriculum?.length > 0 && (
              <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Curriculum</h2>
                <div className="space-y-2">
                  {course.curriculum.map((section, i) => (
                    <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setOpenSection(openSection === i ? null : i)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                      >
                        <span className="font-medium text-gray-900 text-sm">{section.title}</span>
                        {openSection === i
                          ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                      </button>
                      {openSection === i && section.lessons?.length > 0 && (
                        <div className="px-4 pb-4 pt-0 space-y-1.5">
                          {section.lessons.map((lesson, j) => (
                            <div key={j} className="flex items-center gap-2 text-sm text-gray-500 py-1">
                              <BookOpen className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
                              {lesson}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Reviews <span className="text-gray-400 font-normal text-base">({reviews.length})</span>
                </h2>
                {session && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-sm font-medium text-primary-500 hover:underline"
                  >
                    {showReviewForm ? 'Cancel' : 'Write a review'}
                  </button>
                )}
              </div>

              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className="focus:outline-none"
                        >
                          <Star className={`w-6 h-6 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Share your experience..."
                      required
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary text-sm">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {reviews.length > 0 ? (
                <div className="space-y-5">
                  {reviews.map((review, i) => (
                    <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-900">{review.userName}</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
              )}
            </section>
          </div>

          {/* Sidebar: tags */}
          {course.tags?.length > 0 && (
            <aside className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  try {
    await dbConnect()
    const courses = await Course.find({ isPublished: true }).select('slug').lean()
    const paths = courses.map((c) => ({ params: { slug: c.slug } }))
    return { paths, fallback: 'blocking' }
  } catch {
    return { paths: [], fallback: 'blocking' }
  }
}

export async function getStaticProps({ params }) {
  try {
    await dbConnect()

    const course = await Course.findOne({ slug: params.slug, isPublished: true }).lean()
    if (!course) return { notFound: true }

    const reviews = await Review.find({ course: course._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()

    return {
      props: {
        course:  JSON.parse(JSON.stringify(course)),
        reviews: JSON.parse(JSON.stringify(reviews)),
      },
      revalidate: 60,
    }
  } catch {
    return { notFound: true }
  }
}
