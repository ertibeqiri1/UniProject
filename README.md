# EduFlow — Online Course Marketplace

EduFlow is a full-stack online learning platform where students can browse, enroll in, and review courses across multiple categories. Instructors and admins can manage course content through a dedicated admin panel. The platform supports social login via Google and Facebook, wishlist functionality, and a personalized student dashboard.

## Team

| Developer | Role | Responsibilities |
|-----------|------|-----------------|
| Erti Beqiri | UI/UX & Frontend | Home page, courses listing, course detail, search, core components |
| Orges Shala | Authentication & Dashboard | Sign in, register, dashboard, profile, admin panel, about, contact, wishlist |
| Enis Mamusha | Backend & Database | MongoDB models, all API routes, seed script, enrollments |
| Eriona Kolica | Testing & Components | Jest tests, Badge, Spinner components |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14.2.5 (Pages Router) |
| Language | JavaScript (ES6+) |
| Styling | Tailwind CSS v3 |
| Database | MongoDB Atlas + Mongoose v8 |
| Authentication | NextAuth v4 |
| Form Validation | React Hook Form + Zod |
| Icons | Lucide React |
| Testing | Jest 29 + React Testing Library |
| Deployment | Vercel |

---

## Features

### For Students
- Browse all courses filtered by category, level, and keyword
- Full-text search with server-side rendering
- View detailed course pages with curriculum, reviews, and instructor info
- Create an account with email/password or sign in with Google or Facebook
- Enroll in courses for free
- Save courses to a personal wishlist
- Write reviews and rate courses
- Manage profile information from the dashboard

### For Admins
- Access a dedicated admin panel at `/admin`
- View platform statistics (total courses, users, enrollments)
- Create, edit, and delete courses
- Manage user roles (promote to admin or demote to user)
- View all registered users

### Platform
- Fully responsive design — works on mobile, tablet, and desktop
- ISR (Incremental Static Regeneration) for fast page loads
- SSR (Server-Side Rendering) for real-time search results
- Static paths generation for all course detail pages
- Protected routes via Next.js middleware

---

## Pages

| Page | Route | Rendering | Description |
|------|-------|-----------|-------------|
| Home | `/` | ISR (60s) | Hero, featured courses, stats, how it works |
| Courses | `/courses` | ISR (30s) | Browse all courses with filters |
| Course Detail | `/courses/[slug]` | getStaticPaths + ISR | Full course info, curriculum, reviews |
| Search | `/search` | SSR | Search results driven by `?q=` query param |
| Sign In | `/auth/signin` | Static | Email/password + OAuth login |
| Register | `/auth/register` | Static | New account creation |
| Dashboard | `/dashboard` | SSR | Student's enrolled courses and progress |
| Profile | `/profile` | SSR | Edit name, bio, and account info |
| Wishlist | `/wishlist` | Client | Saved courses from WishlistContext |
| About | `/about` | Static | Team info and platform mission |
| Contact | `/contact` | Static | Contact form that saves to MongoDB |
| Admin | `/admin` | SSR | Admin dashboard with stats |
| Admin Courses | `/admin/courses` | SSR | Manage all courses |
| Admin Users | `/admin/users` | SSR | Manage all users and roles |
| 404 | `*` | Static | Custom not-found page |

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/api/courses` | List courses with filters / create course |
| GET/PUT/DELETE | `/api/courses/[id]` | Get, update, delete a course by ID |
| GET | `/api/courses/slug/[slug]` | Get course by slug |
| GET | `/api/courses/all` | Get all courses (admin) |
| GET/POST | `/api/reviews` | List reviews / post a new review |
| POST | `/api/enrollments` | Enroll in a course |
| POST | `/api/contact` | Submit contact form |
| GET/POST/DELETE | `/api/users/wishlist` | Get, add, remove wishlist items |
| GET/PUT | `/api/users/profile` | Get and update user profile |
| GET | `/api/admin/stats` | Platform statistics |
| GET | `/api/admin/users` | List all users |
| PUT | `/api/admin/users/[id]` | Update user role |
| GET | `/api/test-db` | Test MongoDB connection |

---

## Database Models

### User
- `name`, `email`, `password` (hashed), `image`, `role` (user/admin), `bio`, `provider`, `enrolledCourses[]`, `wishlist[]`

### Course
- `title`, `slug`, `description`, `shortDescription`, `price`, `thumbnail`, `category`, `level`, `tags[]`, `instructor`, `instructorName`, `enrollmentCount`, `averageRating`, `reviewCount`, `isPublished`, `duration`, `curriculum[]`

### Review
- `course`, `user`, `userName`, `rating` (1–5), `comment`, `isVerifiedEnrollment`

### Contact
- `name`, `email`, `subject`, `message`, `isRead`

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or use the shared team URI)

### Installation

```bash
git clone https://github.com/ertibeqiri1/UniProject.git
cd UniProject
npm install
```

### Environment Variables

Create a `.env.local` file in the project root with the following:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
```

> `.env.local` is listed in `.gitignore` and is never committed to GitHub. Share it with teammates privately.

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Seed the database

Populates MongoDB with 8 sample courses and 2 user accounts (1 admin, 1 student):

```bash
node src/lib/seed.js
```

### Run tests

```bash
npm test
```

---

## Project Structure

```
UniProject/
├── pages/
│   ├── api/
│   │   ├── auth/           # NextAuth handler
│   │   ├── courses/        # Course CRUD API
│   │   ├── reviews/        # Reviews API
│   │   ├── admin/          # Admin API routes
│   │   └── users/          # User API routes
│   ├── admin/              # Admin panel pages
│   ├── auth/               # Sign in & register pages
│   ├── courses/            # Course listing & detail
│   ├── _app.jsx            # App wrapper with providers
│   ├── index.jsx           # Home page
│   ├── dashboard.jsx       # Student dashboard
│   ├── profile.jsx         # Profile page
│   ├── wishlist.jsx        # Wishlist page
│   ├── about.jsx           # About page
│   ├── contact.jsx         # Contact page
│   ├── search.jsx          # Search page
│   └── 404.jsx             # Custom 404 page
├── src/
│   ├── components/
│   │   ├── layout/         # Header, Footer, Layout
│   │   ├── courses/        # CourseCard
│   │   └── ui/             # Button, Card, Modal, Badge, Spinner
│   ├── context/
│   │   ├── AuthContext.js      # useAuth() hook
│   │   └── WishlistContext.js  # useWishlist() hook
│   ├── hooks/
│   │   └── useCourses.js       # Custom courses hook
│   ├── lib/
│   │   ├── dbConnect.js        # MongoDB connection singleton
│   │   └── seed.js             # Database seed script
│   └── models/
│       ├── User.js
│       ├── Course.js
│       ├── Review.js
│       └── Contact.js
├── __tests__/              # Jest test files
├── styles/
│   └── globals.css         # Tailwind + global styles
├── middleware.js            # Route protection
├── tailwind.config.js
├── jsconfig.json           # @/ import alias
└── .env.local              # Environment variables (not committed)
```

---

## Deployment

The project is deployed on **Vercel**. Each push to `main` triggers an automatic deployment.

Live URL: [https://uni-project-ten-zeta.vercel.app](https://uni-project-ten-zeta.vercel.app)

---

## University Project

Built for the **Client-Side Web Development** course at **UBT — University for Business and Technology**.

This project demonstrates:
- Next.js Pages Router with SSR, SSG, ISR, and getStaticPaths
- Full CRUD operations via REST API routes
- JWT-based authentication with OAuth providers
- React Context API and custom hooks
- MongoDB database integration with Mongoose
- Responsive UI design with Tailwind CSS
- Unit testing with Jest and React Testing Library
