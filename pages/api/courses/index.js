import dbConnect from '@/src/lib/dbConnect'
import Course from '@/src/models/Course'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'GET') {
    const { category, level, search, page = 1, limit = 12 } = req.query
    const filter = { isPublished: true }
    if (category && category !== 'all') filter.category = category
    if (level    && level    !== 'all') filter.level    = level
    if (search) filter.$or = [
      { title:       { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags:        { $in: [new RegExp(search, 'i')] } },
    ]

    const skip  = (Number(page) - 1) * Number(limit)
    const total = await Course.countDocuments(filter)
    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('instructor', 'name image')

    return res.status(200).json({ courses, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    if (!session || session.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }

    const { title, slug, description, shortDescription, price, thumbnail, category, level, tags, duration, curriculum } = req.body
    if (!title || !slug || !description) {
      return res.status(400).json({ message: 'Title, slug, and description are required' })
    }

    const course = await Course.create({
      title, slug, description, shortDescription, price: price || 0,
      thumbnail, category, level, tags: tags || [], duration,
      curriculum: curriculum || [], instructor: session.user.id,
      instructorName: session.user.name, isPublished: false,
    })
    return res.status(201).json({ course })
  }

  res.status(405).json({ message: 'Method not allowed' })
}
