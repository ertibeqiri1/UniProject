import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import dbConnect from '@/src/lib/dbConnect'
import User from '@/src/models/User'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ message: 'Unauthorized' })

  await dbConnect()

  if (req.method === 'GET') {
    const user = await User.findOne({ email: session.user.email }).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    return res.status(200).json({ user })
  }

  if (req.method === 'PUT') {
    const { name, bio } = req.body
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' })

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { name: name.trim(), bio: bio || '' },
      { new: true, runValidators: true }
    ).select('-password')

    return res.status(200).json({ message: 'Profile updated', user })
  }

  res.status(405).json({ message: 'Method not allowed' })
}
