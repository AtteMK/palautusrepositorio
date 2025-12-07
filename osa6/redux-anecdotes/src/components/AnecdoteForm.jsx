import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { useState } from 'react'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const [content, setContent] = useState('')

  const addAnecdote = event => {
    event.preventDefault()
    dispatch(createAnecdote(content))
    setContent('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
