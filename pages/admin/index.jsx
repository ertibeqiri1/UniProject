import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import Link from 'next/link'
import { BookOpen, Users, MessageSquare, ArrowRight, Shield } from 'lucide-react'

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) return { redirect: { destination: '/auth/signin', permanent: false } }
  if (session.user.role !== 'admin') return { redirect: { destination: '/dashboard', permanent: false } }

  try {
    const protocol = ctx.req.headers['x-forwarded-proto'] || 'http'
    const host = ctx.req.headers.host
    const res = await fetch(`${protocol}://${host}/api/admin/stats`, {
      headers: { cookie: ctx.req.headers.cookie || '' },
    })
    const data = res.ok ? await res.json() : {}
    return { props: { stats: data } }
  } catch {
    return { props: { stats: {} } }
  }
}

export default function AdminIndexPage({ stats }) {
  const statCards = [
    {
      label:   'Total Courses',
      value:   stats.totalCourses ?? 0,
      icon:    BookOpen,
      color:   'bg-blue-50 text-blue-600',
      href:    '/admin/courses',
      linkLabel: 'Manage Courses',
    },
    {
      label:   'Total Users',
      value:   stats.totalUsers ?? 0,
      icon:    Users,
      color:   'bg-purple-50 text-purple-600',
      href:    '/admin/users',
      linkLabel: 'Manage Users',
    },
    {
      label:   'Messages',
      value:   stats.totalMessages ?? 0,
      icon:    MessageSquare,
      color:   'bg-amber-50 text-amber-600',
      href:    null,
      linkLabel: null,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm">Manage your EduFlow platform</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, href, linkLabel }) => (
          <div key={label} className="card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
            {href && (
              <Link
                href={href}
                className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:underline"
              >
                {linkLabel} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/courses"
          className="card p-6 flex items-center gap-4 hover:border-primary-200 transition-colors"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Manage Courses</h3>
            <p className="text-sm text-gray-500">Create, edit, publish and delete courses</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
        </Link>

        <Link
          href="/admin/users"
          className="card p-6 flex items-center gap-4 hover:border-primary-200 transition-colors"
        >
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-500">View all users and manage their roles</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
        </Link>
      </div>
    </div>
  )
}
