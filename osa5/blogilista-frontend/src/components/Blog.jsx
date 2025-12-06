import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    try {
      const updatedBlog = { ...blog, likes: likes + 1 }
      await blogService.update(blog.id, updatedBlog)
      setLikes(likes + 1)
      if (updateBlog) updateBlog(blog.id, likes + 1) // optional: update parent state
    } catch (error) {
      console.error('Error liking blog:', error)
    }
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        if (removeBlog) removeBlog(blog.id)
      } catch (error) {
        console.error('Error removing blog:', error)
      }
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const canRemove = user && blog.user && user.username === blog.user.username

  return(
    <div className="blog" id={`blog-${blog.id}`} style={blogStyle}>
      <div>
        {blog.title} by: {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            Likes: {blog.likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>Added by: {blog.user && blog.user.name}</div>
          {canRemove && <button onClick={handleRemove}>remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog