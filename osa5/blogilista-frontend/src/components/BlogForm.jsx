import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <h3>create new</h3>
      <div>
        <label>
        title:
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="title"
          />
        </label>
      </div>
      <div>
        <label>
        author:
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="author"
          />
        </label>
      </div>
      <div>
        <label>
        url:
          <input
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder="url"
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm