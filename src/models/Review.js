import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema(
  {
    course:              { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    user:                { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName:            { type: String, default: '' },
    rating:              { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
    comment:             { type: String, required: [true, 'Comment is required'], maxlength: 1000 },
    isVerifiedEnrollment: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'eduflow_reviews' }
)

ReviewSchema.index({ course: 1, user: 1 }, { unique: true })

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema)
