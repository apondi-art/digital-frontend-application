import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Input from './Input'

describe('Input', () => {
  it('renders with a label', () => {
    render(<Input label="Email Address" name="email" />)
    expect(screen.getByText('Email Address')).toBeInTheDocument()
  })

  it('renders an input element', () => {
    render(<Input label="Email" name="email" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('shows error message when error prop is provided', () => {
    render(<Input label="Email" name="email" error="Email is required" />)
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('sets aria-invalid="true" when error is provided', () => {
    render(<Input label="Email" name="email" error="Required" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not set aria-invalid when no error', () => {
    render(<Input label="Email" name="email" />)
    const input = screen.getByRole('textbox')
    expect(input).not.toHaveAttribute('aria-invalid', 'true')
  })

  it('shows hint text when no error', () => {
    render(<Input label="Email" name="email" hint="We will never share your email" />)
    expect(screen.getByText('We will never share your email')).toBeInTheDocument()
  })

  it('hides hint text when error is shown', () => {
    render(<Input label="Email" name="email" hint="Hint text" error="Error text" />)
    expect(screen.queryByText('Hint text')).not.toBeInTheDocument()
    expect(screen.getByText('Error text')).toBeInTheDocument()
  })
})
