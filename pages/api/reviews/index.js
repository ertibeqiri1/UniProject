import dbConnect from '@/src/lib/dbConnect'
import Review from '@/src/models/Review'
import Course from '@/src/models/Course'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'GET') {
    const { courseId } = req.query
    if (!courseId) return res.status(400).json({ message: 'courseId is required' })
    const reviews = await Review.find({ course: courseId }).sort({ createdAt: -1 })
    return res.status(200).json({ reviews })
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: 'Sign in to leave a review' })

    const { courseId, rating, comment } = req.body
    if (!courseId || !rating || !comment) {
      return res.status(400).json({ message: 'courseId, rating and comment are required' })
    }

    const existing = await Review.findOne({ course: courseId, user: session.user.id })
    if (existing) return res.status(409).json({ message: 'You already reviewed this course' })

    const review = await Review.create({
      course:   courseId,
      user:     session.user.id,
      userName: session.user.name,
      rating:   Number(rating),
      comment,
    })

    const reviews = await Review.find({ course: courseId })
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await Course.findByIdAndUpdate(courseId, { averageRating: avg.toFixed(1), reviewCount: reviews.length })

    return res.status(201).json({ review })
  }

  res.status(405).json({ message: 'Method not allowed' })
}
