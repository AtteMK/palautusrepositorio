import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, voteAnecdote } from './requests'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotification } from './NotificationContext'

let timeoutId = null

const App = () => {
  const queryClient = useQueryClient()
  const [, dispatch] = useNotification()

  const notify = (msg, ms = 5000) => {
    dispatch({ type: "SET", payload: msg })
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      dispatch({ type: "CLEAR" })
      timeoutId = null
    }, ms)
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  const voteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries(['anecdotes'])
    }
  })

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote)
    notify(`you voted '${anecdote.content}'`)
  }

  if (isLoading) return <div>loading data...</div>
  if (isError)
    return <div>anecdote service not available due to problems in server</div>

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm notify={notify} />

      {[...data]
        .sort((a, b) => b.votes - a.votes)
        .map(a => (
          <div key={a.id}>
            <div>{a.content}</div>
            <div>
              has {a.votes}
              <button onClick={() => handleVote(a)}>vote</button>
            </div>
            <br />
          </div>
        ))}
    </div>
  )
}

export default App
