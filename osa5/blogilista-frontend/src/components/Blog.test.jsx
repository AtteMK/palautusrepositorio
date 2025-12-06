import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('Blog component', () => {
  vi.mock('../services/blogs', () => {
    return {
      default: {
        update: vi.fn().mockResolvedValue({}),
      },
    }
  })

  const blog = {
    title: 'Testi blogi',
    author: 'Testi Tero',
    url: 'random url test',
    likes: 10,
    user: { username: 'tester', name: 'Test Tester' }
  }

  it('renders title and author, but not URL or likes by default', () => {
    render(<Blog blog={blog} />)
    expect(screen.getByText('Testi blogi by: Testi Tero')).toBeInTheDocument()
    expect(screen.queryByText('random url test')).not.toBeInTheDocument()
    expect(screen.queryByText('Likes: 10')).not.toBeInTheDocument()
  })

  it('displays URL, likes, and user when the view button is clicked', async () => {
    render(<Blog blog={blog} />)
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    expect(screen.getByText('random url test')).toBeInTheDocument()
    expect(screen.getByText('Likes: 10')).toBeInTheDocument()
    expect(screen.getByText('Added by: Test Tester')).toBeInTheDocument()
  })

  it('calls the like event handler twice when the like button is clicked twice', async () => {
    const mockHandler = vi.fn()
    render(<Blog blog={blog} updateBlog={mockHandler} />)
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})