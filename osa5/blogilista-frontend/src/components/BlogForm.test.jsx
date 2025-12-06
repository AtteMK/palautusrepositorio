import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('BlogForm component', () => {
  it('calls createBlog with the right details when a new blog is created', async () => {
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    const user = userEvent.setup()

    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const submitButton = screen.getByText('create')

    await user.type(titleInput, 'Testi blogi')
    await user.type(authorInput, 'Testi Tero')
    await user.type(urlInput, 'random url test')
    await user.click(submitButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Testi blogi',
      author: 'Testi Tero',
      url: 'random url test'
    })
  })
})