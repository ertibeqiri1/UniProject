import mongoose from 'mongoose'

const CourseSchema = new mongoose.Schema(
  {
    title:            { type: String, required: [true, 'Title is required'], trim: true },
    slug:             { type: String, required: true, unique: true, lowercase: true, trim: true },
    description:      { type: String, required: [true, 'Description is required'] },
    shortDescription: { type: String, default: '' },
    price:            { type: Number, default: 0, min: 0 },
    thumbnail:        { type: String, default: '' },
    category: {
      type: String,
      enum: ['development', 'design', 'business', 'science', 'marketing', 'other'],
      default: 'other',
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    tags:             [{ type: String }],
    instructor:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    instructorName:   { type: String, default: '' },
    enrollmentCount:  { type: Number, default: 0 },
    averageRating:    { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:      { type: Number, default: 0 },
    isPublished:      { type: Boolean, default: false },
    duration:         { type: String, default: '' },
    curriculum: [
      {
        title:    { type: String },
        duration: { type: String },
      },
    ],
  },
  { timestamps: true, collection: 'eduflow_courses' }
)

export default mongoose.models.Course || mongoose.model('Course', CourseSchema)
