import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle, AlertCircle, User } from 'lucide-react'
import Image from 'next/image'

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) return { redirect: { destination: '/auth/signin', permanent: false } }

  try {
    const protocol = ctx.req.headers['x-forwarded-proto'] || 'http'
    const host = ctx.req.headers.host
    const res = await fetch(`${protocol}://${host}/api/users/profile`, {
      headers: { cookie: ctx.req.headers.cookie || '' },
    })
    const data = res.ok ? await res.json() : {}
    return { props: { session, profile: data.user || null } }
  } catch {
    return { props: { session, profile: null } }
  }
}

export default function ProfilePage({ session, profile }) {
  const user = profile || session.user
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name || '',
      bio:  user.bio  || '',
    },
  })

  const initials = (user.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const onSubmit = async (data) => {
    setStatus(null)
    setLoading(true)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      setStatus(res.ok ? 'success' : { error: json.message || 'Update failed' })
    } catch {
      setStatus({ error: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="card p-8">
        {/* Avatar + identity */}
        <div className="flex items-center gap-5 mb-8">
          {user.image ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
              <Image src={user.image} alt={user.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {initials}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className="inline-block mt-1 text-xs font-medium bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full capitalize">
              {user.role || 'user'}
            </span>
          </div>
        </div>

        {/* Success / error banner */}
        {status === 'success' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-6 text-sm">
            <CheckCircle className="w-4 h-4 shrink-0" />
            Profile updated successfully!
          </div>
        )}
        {status?.error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {status.error}
          </div>
        )}

        {/* Edit form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className={`input-field pl-10 ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              rows={4}
              placeholder="Tell others a little about yourself…"
              className={`input-field resize-none ${errors.bio ? 'border-red-400 focus:ring-red-400' : ''}`}
              {...register('bio', {
                maxLength: { value: 300, message: 'Bio must be 300 characters or fewer' },
              })}
            />
            {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="input-field bg-gray-50 text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
