import dbConnect from '@/src/lib/dbConnect'
import Course from '@/src/models/Course'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })

  await dbConnect()
  const { slug } = req.query
  const course = await Course.findOne({ slug, isPublished: true }).populate('instructor', 'name image bio')
  if (!course) return res.status(404).json({ message: 'Course not found' })
  return res.status(200).json({ course })
}
