import dbConnect from '@/src/lib/dbConnect'
import Review from '@/src/models/Review'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  await dbConnect()
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ message: 'Unauthorized' })

  const { id } = req.query
  const review = await Review.findById(id)
  if (!review) return res.status(404).json({ message: 'Review not found' })

  const isOwner = review.user.toString() === session.user.id
  const isAdmin = session.user.role === 'admin'
  if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' })

  if (req.method === 'DELETE') {
    await Review.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Review deleted' })
  }

  res.status(405).json({ message: 'Method not allowed' })
}
