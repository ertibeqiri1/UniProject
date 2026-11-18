import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, Shield, User } from 'lucide-react'

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) return { redirect: { destination: '/auth/signin', permanent: false } }
  if (session.user.role !== 'admin') return { redirect: { destination: '/dashboard', permanent: false } }

  try {
    const protocol = ctx.req.headers['x-forwarded-proto'] || 'http'
    const host = ctx.req.headers.host
    const res = await fetch(`${protocol}://${host}/api/admin/users`, {
      headers: { cookie: ctx.req.headers.cookie || '' },
    })
    const data = res.ok ? await res.json() : { users: [] }
    return { props: { session, initialUsers: data.users || [] } }
  } catch {
    return { props: { session, initialUsers: [] } }
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export default function AdminUsersPage({ session: adminSession, initialUsers }) {
  const [users, setUsers] = useState(initialUsers)
  const [loadingId, setLoadingId] = useState(null)

  const handleToggleRole = async (user) => {
    if (user.email === adminSession.user.email) {
      alert("You can't change your own role.")
      return
    }
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    const confirmed = confirm(`Change ${user.name}'s role to "${newRole}"?`)
    if (!confirmed) return

    setLoadingId(user._id)
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      const json = await res.json()
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, role: json.user.role } : u))
        )
      } else {
        alert(json.message || 'Failed to update role.')
      }
    } catch {
      alert('Something went wrong.')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-500 text-sm">{users.length} registered users</p>
          </div>
        </div>
      </div>

      {/* Table */}
      {users.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">User</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Role</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Joined</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => {
                  const initials = (user.name || 'U')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                  const isSelf = user.email === adminSession.user.email

                  return (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {initials}
                          </div>
                          <span className="font-medium text-gray-900">
                            {user.name}
                            {isSelf && <span className="ml-1 text-xs text-gray-400">(you)</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{user.email}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                          user.role === 'admin'
                            ? 'bg-primary-50 text-primary-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.role === 'admin'
                            ? <Shield className="w-3 h-3" />
                            : <User className="w-3 h-3" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleToggleRole(user)}
                          disabled={loadingId === user._id || isSelf}
                          title={isSelf ? 'Cannot change your own role' : `Switch to ${user.role === 'admin' ? 'user' : 'admin'}`}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                            user.role === 'admin'
                              ? 'border border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50'
                              : 'border border-gray-300 text-gray-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50'
                          }`}
                        >
                          {loadingId === user._id
                            ? 'Saving…'
                            : user.role === 'admin'
                              ? 'Remove Admin'
                              : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
