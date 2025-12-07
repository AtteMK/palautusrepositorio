import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)

  const sorted = [...anecdotes].sort((a, b) => b.votes - a.votes)

  const vote = anecdote => {
    dispatch(voteAnecdote(anecdote)) // <-- ASYNC VOTE
  }

  return (
    <div>
      {sorted.map(a => (
        <div key={a.id}>
          <div>{a.content}</div>
          <div>
            has {a.votes}
            <button onClick={() => vote(a)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
