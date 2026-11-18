import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import dbConnect from '@/src/lib/dbConnect'
import User from '@/src/models/User'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })

  const session = await getServerSession(req, res, authOptions)
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }

  await dbConnect()

  const users = await User.find({})
    .sort({ createdAt: -1 })
    .select('name email role createdAt provider')

  return res.status(200).json({ users })
}
