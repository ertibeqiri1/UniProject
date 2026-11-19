/**
 * @jest-environment node
 */
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/courses/index'
import Course from '@/src/models/Course'

jest.mock('@/src/lib/dbConnect', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}))

// The handler imports next-auth for the POST branch; stub it so GET tests stay isolated.
jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }))
jest.mock('@/pages/api/auth/[...nextauth]', () => ({ authOptions: {} }))

jest.mock('@/src/models/Course', () => ({
  __esModule: true,
  default: { find: jest.fn(), countDocuments: jest.fn() },
}))

const sampleCourses = [
  { _id: '1', title: 'Intro to React', slug: 'intro-to-react', isPublished: true },
  { _id: '2', title: 'Advanced Node', slug: 'advanced-node', isPublished: true },
]

// The handler chains .sort().skip().limit().populate() and awaits the result.
function mockFindChain(result) {
  const chain = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    populate: jest.fn().mockResolvedValue(result),
  }
  return chain
}

describe('GET /api/courses', () => {
  beforeEach(() => {
    Course.find.mockReturnValue(mockFindChain(sampleCourses))
    Course.countDocuments.mockResolvedValue(sampleCourses.length)
  })

  it('returns status 200', async () => {
    const { req, res } = createMocks({ method: 'GET' })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(200)
  })

  it('returns a courses array in the response', async () => {
    const { req, res } = createMocks({ method: 'GET' })
    await handler(req, res)
    const data = res._getJSONData()
    expect(Array.isArray(data.courses)).toBe(true)
    expect(data.courses).toHaveLength(2)
  })
})
