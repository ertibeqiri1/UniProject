import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name:     { type: String, required: [true, 'Name is required'], trim: true },
    email:    { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    image:    { type: String, default: '' },
    role:     { type: String, enum: ['user', 'admin'], default: 'user' },
    bio:      { type: String, default: '', maxlength: 300 },
    provider: { type: String, default: 'credentials' },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    wishlist:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  },
  { timestamps: true, collection: 'eduflow_users' }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
