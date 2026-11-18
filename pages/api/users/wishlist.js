import dbConnect from '@/src/lib/dbConnect'
import User from '@/src/models/User'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ message: 'Unauthorized' })

  await dbConnect()
  const userId = session.user.id

  if (req.method === 'GET') {
    const user = await User.findById(userId).populate('wishlist')
    return res.status(200).json(user?.wishlist || [])
  }

  if (req.method === 'POST') {
    const { courseId } = req.body
    if (!courseId) return res.status(400).json({ message: 'courseId is required' })
    await User.findByIdAndUpdate(userId, { $addToSet: { wishlist: courseId } })
    return res.status(200).json({ message: 'Added to wishlist' })
  }

  if (req.method === 'DELETE') {
    const { courseId } = req.body
    if (!courseId) return res.status(400).json({ message: 'courseId is required' })
    await User.findByIdAndUpdate(userId, { $pull: { wishlist: courseId } })
    return res.status(200).json({ message: 'Removed from wishlist' })
  }

  res.status(405).json({ message: 'Method not allowed' })
}
