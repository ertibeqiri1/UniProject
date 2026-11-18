// Seed script — run with: node src/lib/seed.js
require('dotenv').config({ path: '.env.local' })

const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

// ─── Schemas (inline CommonJS — models use ES modules so we define them here) ──

const UserSchema = new mongoose.Schema(
  {
    name:            { type: String, required: true, trim: true },
    email:           { type: String, required: true, unique: true, lowercase: true },
    password:        { type: String },
    image:           { type: String, default: '' },
    role:            { type: String, enum: ['user', 'admin'], default: 'user' },
    bio:             { type: String, default: '' },
    provider:        { type: String, default: 'credentials' },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    wishlist:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  },
  { timestamps: true, collection: 'eduflow_users' }
)

const CourseSchema = new mongoose.Schema(
  {
    title:            { type: String, required: true, trim: true },
    slug:             { type: String, required: true, unique: true, lowercase: true },
    description:      { type: String, required: true },
    shortDescription: { type: String, default: '' },
    price:            { type: Number, default: 0 },
    thumbnail:        { type: String, default: '' },
    category:         { type: String, enum: ['development', 'design', 'business', 'science', 'marketing', 'other'], default: 'other' },
    level:            { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    tags:             [{ type: String }],
    instructor:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    instructorName:   { type: String, default: '' },
    enrollmentCount:  { type: Number, default: 0 },
    averageRating:    { type: Number, default: 0 },
    reviewCount:      { type: Number, default: 0 },
    isPublished:      { type: Boolean, default: false },
    duration:         { type: String, default: '' },
  },
  { timestamps: true, collection: 'eduflow_courses' }
)

const User   = mongoose.models.User   || mongoose.model('User',   UserSchema)
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema)

// ─── Main ──────────────────────────────────────────────────────────────────────

async function seed() {
  const uri = process.env.MONGODB_URI
  if (!uri || uri === 'placeholder_replace_later') {
    console.error('❌  MONGODB_URI is not set in .env.local — update it first!')
    process.exit(1)
  }

  await mongoose.connect(uri)
  console.log('✅  Connected to MongoDB')

  // Clear existing data
  await Course.deleteMany({})
  await User.deleteMany({})
  console.log('🗑️   Cleared existing users and courses')

  // ── Users ──────────────────────────────────────────────────────────────────

  const adminHash   = await bcrypt.hash('admin123',   10)
  const studentHash = await bcrypt.hash('student123', 10)

  const [admin] = await User.insertMany([
    {
      name:     'Admin User',
      email:    'admin@eduflow.com',
      password: adminHash,
      role:     'admin',
      bio:      'Platform administrator and lead instructor.',
    },
    {
      name:     'John Student',
      email:    'student@eduflow.com',
      password: studentHash,
      role:     'user',
      bio:      'Lifelong learner passionate about technology.',
    },
  ])

  console.log('👤  Created 2 users')

  // ── Courses ────────────────────────────────────────────────────────────────

  const thumbnail = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'

  await Course.insertMany([
    {
      title:            'JavaScript Full Course',
      slug:             'javascript-full-course',
      description:      'A complete beginner-to-intermediate JavaScript course covering variables, functions, DOM manipulation, and ES6+ features. You will build real-world projects and learn modern JavaScript patterns used in the industry.',
      shortDescription: 'Learn JavaScript from scratch with real-world projects.',
      price:            0,
      category:         'development',
      level:            'beginner',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail,
      averageRating:    4.8,
      reviewCount:      142,
      enrollmentCount:  480,
    },
    {
      title:            'React & Next.js Masterclass',
      slug:             'react-nextjs-masterclass',
      description:      'Master React hooks, context, and Next.js 14 with the App Router. Build full-stack applications with server components, API routes, and MongoDB integration. Covers authentication, deployment, and performance optimisation.',
      shortDescription: 'Build modern full-stack apps with React and Next.js 14.',
      price:            49,
      category:         'development',
      level:            'intermediate',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail,
      averageRating:    4.9,
      reviewCount:      218,
      enrollmentCount:  450,
    },
    {
      title:            'UI/UX Design Fundamentals',
      slug:             'uiux-design-fundamentals',
      description:      'Learn the core principles of user interface and user experience design. Covers design thinking, wireframing, prototyping, and usability testing. By the end you will be able to design intuitive and beautiful digital products.',
      shortDescription: 'Master the fundamentals of UI/UX design and design thinking.',
      price:            29,
      category:         'design',
      level:            'beginner',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail,
      averageRating:    4.7,
      reviewCount:      95,
      enrollmentCount:  320,
    },
    {
      title:            'Figma for Beginners',
      slug:             'figma-for-beginners',
      description:      'Get started with Figma, the industry-standard design tool. Learn components, auto-layout, prototyping, and collaboration features. You will design beautiful interfaces from scratch by the end of the course.',
      shortDescription: 'Learn Figma from zero and design stunning user interfaces.',
      price:            0,
      category:         'design',
      level:            'beginner',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail,
      averageRating:    4.6,
      reviewCount:      78,
      enrollmentCount:  290,
    },
    {
      title:            'Digital Marketing Strategy',
      slug:             'digital-marketing-strategy',
      description:      'Build and execute a complete digital marketing strategy covering SEO, social media, email campaigns, and PPC advertising. Learn how to measure and analyse results using Google Analytics and other tools.',
      shortDescription: 'Build a complete digital marketing strategy from scratch.',
      price:            39,
      category:         'marketing',
      level:            'intermediate',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail,
      averageRating:    4.5,
      reviewCount:      61,
      enrollmentCount:  180,
    },
    {
      title:            'Python for Data Science',
      slug:             'python-for-data-science',
      description:      'Start your data science journey with Python and essential libraries like NumPy, Pandas, and Matplotlib. Learn to analyse datasets, build visualisations, and create basic machine learning models with Scikit-learn.',
      shortDescription: 'Learn Python and essential libraries for data science.',
      price:            49,
      category:         'science',
      level:            'beginner',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail,
      averageRating:    4.8,
      reviewCount:      187,
      enrollmentCount:  500,
    },
    {
      title:            'Business Communication',
      slug:             'business-communication',
      description:      'Develop professional communication skills for the modern workplace. Covers written communication, presentations, negotiation, and cross-cultural communication. Perfect for anyone looking to advance their career.',
      shortDescription: 'Master professional communication skills for the workplace.',
      price:            19,
      category:         'business',
      level:            'beginner',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail,
      averageRating:    4.4,
      reviewCount:      43,
      enrollmentCount:  150,
    },
    {
      title:            'Advanced Node.js & APIs',
      slug:             'advanced-nodejs-apis',
      description:      'Deep dive into Node.js for building production-grade REST APIs with Express, JWT authentication, and MongoDB. Covers error handling, testing, security best practices, and deployment to cloud platforms.',
      shortDescription: 'Build production-ready REST APIs with Node.js and Express.',
      price:            59,
      category:         'development',
      level:            'advanced',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail,
      averageRating:    4.9,
      reviewCount:      104,
      enrollmentCount:  260,
    },
  ])

  console.log('📚  Created 8 courses')
  console.log('\n✅  Seed complete! Database has 8 courses and 2 users.')
  console.log('─────────────────────────────────────────────────')
  console.log('Login credentials:')
  console.log('  Admin:   admin@eduflow.com   / admin123')
  console.log('  Student: student@eduflow.com / student123')
  console.log('─────────────────────────────────────────────────\n')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})
