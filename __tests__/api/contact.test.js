/**
 * @jest-environment node
 */
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/contact'

jest.mock('@/src/lib/dbConnect', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}))

// The handler persists via Contact.create; save is mocked too for model-instance usage.
jest.mock('@/src/models/Contact', () => ({
  __esModule: true,
  default: {
    create: jest.fn().mockResolvedValue({}),
    save: jest.fn().mockResolvedValue({}),
  },
}))

describe('POST /api/contact', () => {
  it('returns 201 for valid data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        subject: 'Hello',
        message: 'I have a question about a course.',
      },
    })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(201)
  })

  it('returns 400 when fields are missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { name: 'Jane Doe' },
    })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(400)
  })
})
