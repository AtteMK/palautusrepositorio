const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const res = await fetch(baseUrl)
  if (!res.ok) throw new Error('server error')
  return res.json()
}

export const createAnecdote = async (content) => {
  const newAnecdote = { content, votes: 0 }

  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAnecdote)
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'failed to create anecdote')
  }

  return res.json()
}

export const voteAnecdote = async (anecdote) => {
  const updated = { ...anecdote, votes: anecdote.votes + 1 }

  const res = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ votes: updated.votes })
  })

  if (!res.ok) throw new Error('vote failed')

  return res.json()
}
