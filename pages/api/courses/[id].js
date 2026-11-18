import dbConnect from '@/src/lib/dbConnect'
import Course from '@/src/models/Course'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  await dbConnect()
  const { id } = req.query

  if (req.method === 'GET') {
    const course = await Course.findById(id).populate('instructor', 'name image bio')
    if (!course) return res.status(404).json({ message: 'Course not found' })
    return res.status(200).json({ course })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }

  if (req.method === 'PUT') {
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!course) return res.status(404).json({ message: 'Course not found' })
    return res.status(200).json({ course })
  }

  if (req.method === 'DELETE') {
    await Course.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Course deleted' })
  }

  res.status(405).json({ message: 'Method not allowed' })
}
