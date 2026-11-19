import { render, screen } from '@testing-library/react'
import Button from '@/src/components/ui/Button'

describe('Button', () => {
  it('renders with the correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('is disabled when the disabled prop is passed', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeDisabled()
  })
})
