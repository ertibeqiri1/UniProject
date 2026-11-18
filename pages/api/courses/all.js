import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import dbConnect from '@/src/lib/dbConnect'
import Course from '@/src/models/Course'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })

  const session = await getServerSession(req, res, authOptions)
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }

  await dbConnect()

  const courses = await Course.find({})
    .sort({ createdAt: -1 })
    .select('title slug category isPublished enrollmentCount createdAt')

  return res.status(200).json({ courses })
}
