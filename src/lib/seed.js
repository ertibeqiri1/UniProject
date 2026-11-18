// Seed script — run with: node -e "require('./src/lib/seed.js')"
// Uses CommonJS (require) so it runs directly with Node without transpiling

require('dotenv').config({ path: '.env.local' })

const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

// ─── Schemas (inline, CommonJS) ───────────────────────────────────────────────

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

// ─── Main seed function ────────────────────────────────────────────────────────

async function seed() {
  const uri = process.env.MONGODB_URI
  if (!uri || uri === 'placeholder_replace_later') {
    console.error('❌  MONGODB_URI is not set in .env.local — update it first!')
    process.exit(1)
  }

  await mongoose.connect(uri)
  console.log('✅  Connected to MongoDB')

  // Clear existing data
  await User.deleteMany({})
  await Course.deleteMany({})
  console.log('🗑️   Cleared existing users and courses')

  // ── Users ──────────────────────────────────────────────────────────────────

  const adminPassword   = await bcrypt.hash('admin123',   10)
  const studentPassword = await bcrypt.hash('student123', 10)

  const [admin, student] = await User.insertMany([
    {
      name:     'Admin User',
      email:    'admin@eduflow.com',
      password: adminPassword,
      role:     'admin',
      bio:      'Platform administrator and lead instructor.',
    },
    {
      name:     'John Student',
      email:    'student@eduflow.com',
      password: studentPassword,
      role:     'user',
      bio:      'Lifelong learner passionate about technology.',
    },
  ])

  console.log('👤  Created users:', admin.email, '|', student.email)

  // ── Courses ─────────────────────────────────────────────────────────────────

  const courses = [
    {
      title:            'JavaScript Full Course',
      slug:             'javascript-full-course',
      description:      'A complete beginner-to-intermediate JavaScript course covering variables, functions, DOM manipulation, async programming, and ES6+ features with hands-on projects.',
      shortDescription: 'Learn JavaScript from scratch with real-world projects.',
      price:            0,
      category:         'development',
      level:            'beginner',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail:        'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop',
      averageRating:    4.8,
      reviewCount:      142,
      enrollmentCount:  980,
      duration:         '12h 30m',
      tags:             ['javascript', 'web development', 'programming'],
    },
    {
      title:            'React & Next.js Masterclass',
      slug:             'react-nextjs-masterclass',
      description:      'Master React hooks, context, and Next.js 14 with the App Router. Build full-stack applications with server components, API routes, and MongoDB integration.',
      shortDescription: 'Build modern full-stack apps with React and Next.js 14.',
      price:            49,
      category:         'development',
      level:            'intermediate',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail:        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
      averageRating:    4.9,
      reviewCount:      218,
      enrollmentCount:  1340,
      duration:         '18h 45m',
      tags:             ['react', 'nextjs', 'full-stack'],
    },
    {
      title:            'UI/UX Design Fundamentals',
      slug:             'ui-ux-design-fundamentals',
      description:      'Learn the core principles of user interface and user experience design. Covers design thinking, wireframing, prototyping, color theory, typography, and usability testing.',
      shortDescription: 'Master the fundamentals of UI/UX design and design thinking.',
      price:            29,
      category:         'design',
      level:            'beginner',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail:        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
      averageRating:    4.7,
      reviewCount:      95,
      enrollmentCount:  620,
      duration:         '8h 15m',
      tags:             ['ui', 'ux', 'design'],
    },
    {
      title:            'Figma for Beginners',
      slug:             'figma-for-beginners',
      description:      'Get started with Figma, the industry-standard design tool. Learn components, auto-layout, prototyping, and collaboration features to design beautiful interfaces.',
      shortDescription: 'Learn Figma from zero and design stunning UIs.',
      price:            0,
      category:         'design',
      level:            'beginner',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail:        'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&auto=format&fit=crop',
      averageRating:    4.6,
      reviewCount:      78,
      enrollmentCount:  540,
      duration:         '5h 20m',
      tags:             ['figma', 'design', 'prototyping'],
    },
    {
      title:            'Digital Marketing Strategy',
      slug:             'digital-marketing-strategy',
      description:      'Build and execute a complete digital marketing strategy. Covers SEO, social media marketing, email campaigns, PPC advertising, and analytics to grow your online presence.',
      shortDescription: 'Build a complete digital marketing strategy from scratch.',
      price:            39,
      category:         'marketing',
      level:            'intermediate',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail:        'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop',
      averageRating:    4.5,
      reviewCount:      61,
      enrollmentCount:  390,
      duration:         '7h 10m',
      tags:             ['marketing', 'seo', 'social media'],
    },
    {
      title:            'Python for Data Science',
      slug:             'python-for-data-science',
      description:      'Start your data science journey with Python. Learn NumPy, Pandas, Matplotlib, and Scikit-learn to analyse datasets, build visualisations, and create machine learning models.',
      shortDescription: 'Learn Python and essential libraries for data science.',
      price:            49,
      category:         'science',
      level:            'beginner',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail:        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop',
      averageRating:    4.8,
      reviewCount:      187,
      enrollmentCount:  1120,
      duration:         '15h 00m',
      tags:             ['python', 'data science', 'machine learning'],
    },
    {
      title:            'Business Communication',
      slug:             'business-communication',
      description:      'Develop professional communication skills for the modern workplace. Covers written communication, presentation skills, negotiation, active listening, and cross-cultural communication.',
      shortDescription: 'Master professional communication skills for the workplace.',
      price:            19,
      category:         'business',
      level:            'beginner',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail:        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop',
      averageRating:    4.4,
      reviewCount:      43,
      enrollmentCount:  275,
      duration:         '4h 30m',
      tags:             ['business', 'communication', 'soft skills'],
    },
    {
      title:            'Advanced Node.js & APIs',
      slug:             'advanced-nodejs-apis',
      description:      'Deep dive into Node.js for building production-grade REST APIs. Covers Express, authentication with JWT, MongoDB with Mongoose, error handling, testing, and deployment.',
      shortDescription: 'Build production-ready REST APIs with Node.js and Express.',
      price:            59,
      category:         'development',
      level:            'advanced',
      isPublished:      true,
      instructor:       admin._id,
      instructorName:   'Admin User',
      thumbnail:        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
      averageRating:    4.9,
      reviewCount:      104,
      enrollmentCount:  720,
      duration:         '14h 20m',
      tags:             ['nodejs', 'api', 'backend'],
    },
  ]

  await Course.insertMany(courses)
  console.log('📚  Created 8 courses')

  console.log('\n✅  Seed complete!')
  console.log('─────────────────────────────────')
  console.log('Login credentials:')
  console.log('  Admin:   admin@eduflow.com   / admin123')
  console.log('  Student: student@eduflow.com / student123')
  console.log('─────────────────────────────────\n')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})
