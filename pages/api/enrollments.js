import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import dbConnect from '@/src/lib/dbConnect'
import User from '@/src/models/User'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ message: 'Unauthorized' })

  await dbConnect()

  if (req.method === 'GET') {
    const user = await User.findOne({ email: session.user.email })
      .populate('enrolledCourses', 'title slug thumbnail category level enrollmentCount averageRating instructorName')
    if (!user) return res.status(404).json({ message: 'User not found' })

    const enrollments = (user.enrolledCourses || []).map((course) => ({
      course,
      status: 'in-progress',
    }))

    return res.status(200).json({ enrollments })
  }

  if (req.method === 'POST') {
    const { courseId } = req.body
    if (!courseId) return res.status(400).json({ message: 'courseId is required' })

    await User.findOneAndUpdate(
      { email: session.user.email },
      { $addToSet: { enrolledCourses: courseId } }
    )
    return res.status(200).json({ message: 'Enrolled successfully' })
  }

  res.status(405).json({ message: 'Method not allowed' })
}
