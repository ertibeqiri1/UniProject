import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import Link from 'next/link'
import { BookOpen, Clock, CheckCircle, GraduationCap, ArrowRight } from 'lucide-react'

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) return { redirect: { destination: '/auth/signin', permanent: false } }

  try {
    const protocol = ctx.req.headers['x-forwarded-proto'] || 'http'
    const host = ctx.req.headers.host
    const res = await fetch(`${protocol}://${host}/api/enrollments`, {
      headers: { cookie: ctx.req.headers.cookie || '' },
    })
    const data = res.ok ? await res.json() : { enrollments: [] }
    return { props: { session: JSON.parse(JSON.stringify(session)), enrollments: data.enrollments || [] } }
  } catch {
    return { props: { session: JSON.parse(JSON.stringify(session)), enrollments: [] } }
  }
}

export default function DashboardPage({ session, enrollments }) {
  const user = session.user
  const total = enrollments.length
  const inProgress = enrollments.filter((e) => e.status === 'in-progress').length
  const completed = enrollments.filter((e) => e.status === 'completed').length

  const stats = [
    { label: 'Enrolled',    value: total,      icon: BookOpen,     color: 'bg-blue-50 text-blue-600' },
    { label: 'In Progress', value: inProgress,  icon: Clock,        color: 'bg-amber-50 text-amber-600' },
    { label: 'Completed',   value: completed,   icon: CheckCircle,  color: 'bg-primary-50 text-primary-600' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s a summary of your learning journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Enrolled courses */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
        <Link href="/courses" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
          Browse more <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-500 mb-6">Start your journey by enrolling in a course.</p>
          <Link href="/courses" className="btn-primary inline-block">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrollments.map(({ course, status }) => (
            <Link
              key={course._id}
              href={`/courses/${course.slug}`}
              className="card overflow-hidden group"
            >
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-primary-400" />
                </div>
              )}
              <div className="p-4">
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full capitalize">
                  {course.category}
                </span>
                <h3 className="font-semibold text-gray-900 mt-2 leading-snug line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{course.instructorName}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                    status === 'completed'
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
