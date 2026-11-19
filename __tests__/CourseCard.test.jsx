import { render, screen } from '@testing-library/react'
import CourseCard from '@/src/components/courses/CourseCard'

jest.mock('next/link', () => {
  const Link = ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
  return Link
})

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null }),
}))

jest.mock('@/src/context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}))

jest.mock('@/src/context/WishlistContext', () => ({
  useWishlist: () => ({
    isInWishlist: () => false,
    addToWishlist: () => {},
    removeFromWishlist: () => {},
  }),
}))

const course = {
  _id: '1',
  slug: 'intro-to-react',
  title: 'Intro to React',
  instructorName: 'Jane Doe',
  category: 'development',
  level: 'beginner',
  price: 49,
}

describe('CourseCard', () => {
  it('renders the course title', () => {
    render(<CourseCard course={course} />)
    expect(screen.getByRole('heading', { name: 'Intro to React' })).toBeInTheDocument()
  })
})
