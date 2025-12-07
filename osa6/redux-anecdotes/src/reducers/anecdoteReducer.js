import { createSlice } from '@reduxjs/toolkit'
import {setNotification} from '../reducers/notificationReducer'

const baseUrl = 'http://localhost:3001/anecdotes'

const slice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    updateAnecdote(state, action) {
      const updated = action.payload
      return state.map(a => a.id === updated.id ? updated : a)
    }
  }
})

export const { setAnecdotes, appendAnecdote, updateAnecdote } = slice.actions
export default slice.reducer

export const initializeAnecdotes = () => {
  return async dispatch => {
    const response = await fetch(baseUrl)
    const data = await response.json()
    dispatch(setAnecdotes(data))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = { content, votes: 0 }
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAnecdote)
    })
    const data = await response.json()
    dispatch(appendAnecdote(data))
    dispatch(setNotification(`created '${content}'`, 5))
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const updated = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const response = await fetch(`${baseUrl}/${anecdote.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })

    const data = await response.json()

    dispatch(updateAnecdote(data))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }
}
