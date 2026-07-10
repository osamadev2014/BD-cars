import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

function DialogTest() {
  return (
    <Dialog>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test Title</DialogTitle>
          <DialogDescription>Test Description</DialogDescription>
        </DialogHeader>
        <div>Dialog body content</div>
        <DialogFooter>
          <button>Cancel</button>
          <button>Confirm</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

describe('Dialog', () => {
  it('renders trigger button', () => {
    render(<DialogTest />)
    expect(screen.getByRole('button', { name: 'Open Dialog' })).toBeInTheDocument()
  })

  it('opens dialog when trigger is clicked', async () => {
    const user = userEvent.setup()
    render(<DialogTest />)

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }))

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Dialog body content')).toBeInTheDocument()
  })

  it('renders dialog header', async () => {
    const user = userEvent.setup()
    render(<DialogTest />)

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }))

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('renders footer content', async () => {
    const user = userEvent.setup()
    render(<DialogTest />)

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }))

    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Confirm')).toBeInTheDocument()
  })

  it('has close button', async () => {
    const user = userEvent.setup()
    render(<DialogTest />)

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }))

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })
})
