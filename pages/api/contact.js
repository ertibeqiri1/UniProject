import dbConnect from '@/src/lib/dbConnect'
import Contact from '@/src/models/Contact'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { name, email, subject, message } = req.body

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const emailRegex = /^\S+@\S+\.\S+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' })
  }

  try {
    await dbConnect()
    await Contact.create({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() })
    return res.status(201).json({ message: 'Your message has been sent. We will get back to you soon!' })
  } catch (error) {
    console.error('Contact error:', error)
    return res.status(500).json({ message: 'Server error. Please try again.' })
  }
}
