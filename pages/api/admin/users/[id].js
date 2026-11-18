import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import dbConnect from '@/src/lib/dbConnect'
import User from '@/src/models/User'

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' })

  const session = await getServerSession(req, res, authOptions)
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }

  const { id } = req.query
  const { role } = req.body

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' })
  }

  await dbConnect()

  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password')
  if (!user) return res.status(404).json({ message: 'User not found' })

  return res.status(200).json({ message: 'Role updated', user })
}
