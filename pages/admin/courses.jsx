import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import Modal from '@/src/components/ui/Modal'
import { Plus, Pencil, Trash2, Eye, EyeOff, BookOpen, ArrowLeft } from 'lucide-react'

export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) return { redirect: { destination: '/auth/signin', permanent: false } }
  if (session.user.role !== 'admin') return { redirect: { destination: '/dashboard', permanent: false } }

  try {
    const protocol = ctx.req.headers['x-forwarded-proto'] || 'http'
    const host = ctx.req.headers.host
    const res = await fetch(`${protocol}://${host}/api/courses/all`, {
      headers: { cookie: ctx.req.headers.cookie || '' },
    })
    const data = res.ok ? await res.json() : { courses: [] }
    return { props: { initialCourses: data.courses || [] } }
  } catch {
    return { props: { initialCourses: [] } }
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

export default function AdminCoursesPage({ initialCourses }) {
  const [courses, setCourses] = useState(initialCourses)
  const [modal, setModal] = useState({ open: false, mode: 'create', course: null })
  const [deleteId, setDeleteId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const openCreate = () => {
    reset({ title: '', description: '', category: 'other', isPublished: false })
    setModal({ open: true, mode: 'create', course: null })
    setError('')
  }

  const openEdit = (course) => {
    reset({
      title:       course.title,
      description: course.description || '',
      category:    course.category,
      isPublished: course.isPublished,
    })
    setModal({ open: true, mode: 'edit', course })
    setError('')
  }

  const closeModal = () => {
    setModal({ open: false, mode: 'create', course: null })
    setError('')
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    try {
      if (modal.mode === 'create') {
        const payload = {
          ...data,
          slug: slugify(data.title),
          isPublished: data.isPublished === true || data.isPublished === 'true',
        }
        const res = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!res.ok) { setError(json.message || 'Failed to create course'); return }
        setCourses((prev) => [json.course, ...prev])
      } else {
        const payload = {
          ...data,
          isPublished: data.isPublished === true || data.isPublished === 'true',
        }
        const res = await fetch(`/api/courses/${modal.course._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!res.ok) { setError(json.message || 'Failed to update course'); return }
        setCourses((prev) => prev.map((c) => (c._id === modal.course._id ? json.course : c)))
      }
      closeModal()
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this course? This action cannot be undone.')) return
    setDeleteId(id)
    try {
      await fetch(`/api/courses/${id}`, { method: 'DELETE' })
      setCourses((prev) => prev.filter((c) => c._id !== id))
    } catch {
      alert('Failed to delete course.')
    } finally {
      setDeleteId(null)
    }
  }

  const handleTogglePublished = async (course) => {
    try {
      const res = await fetch(`/api/courses/${course._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !course.isPublished }),
      })
      const json = await res.json()
      if (res.ok) {
        setCourses((prev) => prev.map((c) => (c._id === course._id ? json.course : c)))
      }
    } catch {
      alert('Failed to update published status.')
    }
  }

  const CATEGORIES = ['development', 'design', 'business', 'science', 'marketing', 'other']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-500 text-sm">{courses.length} total courses</p>
          </div>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Course
        </button>
      </div>

      {/* Table */}
      {courses.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No courses yet. Create your first one!</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Title</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Category</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Enrollments</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-900 max-w-xs truncate">
                      {course.title}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize font-medium">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        course.isPublished
                          ? 'bg-primary-50 text-primary-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {course.enrollmentCount ?? 0}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleTogglePublished(course)}
                          title={course.isPublished ? 'Unpublish' : 'Publish'}
                          className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          {course.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openEdit(course)}
                          title="Edit"
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          disabled={deleteId === course._id}
                          title="Delete"
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={modal.mode === 'create' ? 'New Course' : 'Edit Course'}
      >
        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              className={`input-field ${errors.title ? 'border-red-400' : ''}`}
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              rows={3}
              className={`input-field resize-none ${errors.description ? 'border-red-400' : ''}`}
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="input-field" {...register('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              className="w-4 h-4 text-primary-500 rounded border-gray-300"
              {...register('isPublished')}
            />
            <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
              Publish immediately
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
              {loading ? 'Saving…' : modal.mode === 'create' ? 'Create' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
