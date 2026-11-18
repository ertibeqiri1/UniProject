import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import dbConnect from '@/src/lib/dbConnect'
import Course from '@/src/models/Course'
import User from '@/src/models/User'
import Contact from '@/src/models/Contact'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })

  const session = await getServerSession(req, res, authOptions)
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }

  await dbConnect()

  const [totalCourses, totalUsers, totalMessages] = await Promise.all([
    Course.countDocuments(),
    User.countDocuments(),
    Contact.countDocuments(),
  ])

  return res.status(200).json({ totalCourses, totalUsers, totalMessages })
}
