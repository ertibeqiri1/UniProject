import { render, screen } from '@testing-library/react'
import Card from '@/src/components/ui/Card'

describe('Card', () => {
  it('renders its children', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('accepts a custom className', () => {
    render(
      <Card className="my-custom-class">
        <p>Card content</p>
      </Card>
    )
    expect(screen.getByText('Card content').parentElement).toHaveClass('my-custom-class')
  })
})
