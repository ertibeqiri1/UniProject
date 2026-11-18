import mongoose from 'mongoose'

const ContactSchema = new mongoose.Schema(
  {
    name:    { type: String, required: [true, 'Name is required'], trim: true },
    email:   { type: String, required: [true, 'Email is required'], trim: true },
    subject: { type: String, required: [true, 'Subject is required'], trim: true },
    message: { type: String, required: [true, 'Message is required'], maxlength: 2000 },
    isRead:  { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'eduflow_contacts' }
)

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema)
