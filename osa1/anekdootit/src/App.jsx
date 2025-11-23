import { useState } from 'react'

const Button = (props) => {
  const { onClick, text } = props
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
   
  const [selected, setSelected] = useState(0)

  const [mostVotes, setMostVotes] = useState(0)

  const handleClick = () => {
    const updatedSelected = Math.floor(Math.random() * 8)
    setSelected(updatedSelected)
    console.log(updatedSelected)
  }

  const handleVoteClick = () => {
    const updatedVotes = [...votes]
    updatedVotes[selected] += 1
    setVotes(updatedVotes)
    for (let i = 0; i < updatedVotes.length; i++) {
        if (updatedVotes[i] > updatedVotes[mostVotes]) {
            setMostVotes(i)
        }
    }
    console.log(updatedVotes)
    console.log(mostVotes)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]} < br/>
      has {votes[selected]} votes < br/>
      <Button onClick={handleVoteClick} text='vote' />
      <Button onClick={handleClick} text='next anecdote' />
      <h1>Anecdote with the most votes</h1>
      {anecdotes[mostVotes]}
    </div>
  )
}

export default App