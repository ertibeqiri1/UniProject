import dbConnect from '@/src/lib/dbConnect'

export default async function handler(req, res) {
  try {
    await dbConnect()
    res.status(200).json({ message: '✅ MongoDB connected successfully!' })
  } catch (error) {
    res.status(500).json({ message: '❌ MongoDB connection failed', error: error.message })
  }
}
