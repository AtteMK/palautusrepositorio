import { useState } from 'react'

const Button = (props) => {
  const { onClick, text } = props
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const Statistics = (props) => {
  const { good, neutral, bad, all } = props
  if (all==0) {
    return (
      <>
        No feedback given
      </>
    )
  }
  return (
    <table>
      <tbody>
        <tr>
          <td>good</td>
          <td>{good}</td>
        </tr>
        <tr>
          <td>neutral</td>
          <td>{neutral}</td>
        </tr>
        <tr>
          <td>bad</td>
          <td>{bad}</td>
        </tr>
        <tr>
          <td>all</td>
          <td>{all}</td>
        </tr>
        <tr>
          <td>average</td>
          <td>{(good - bad) / (all)}</td>
        </tr>
        <tr>
          <td>positive</td>
          <td>{(good / all) * 100}%</td>
        </tr>
      </tbody>
    </table>
  )
}

const Display = (props) => <><h1>{props.header}</h1></>

const StatisticLine = (props) => {
  const { text, value } = props
  return(
    <>{text}: {value}</>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const header1 = 'give feedback'
  const header2 = 'statistics'

  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    setAll(updatedGood + neutral + bad )
  }

  const handleNeutralClick = () => {
    const updatedNeurtal = neutral + 1
    setNeutral(updatedNeurtal)
    setAll(updatedNeurtal + good + bad )
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    setAll(updatedBad + good + neutral )
  }

  return (
    <div>
      <Display header={header1} />
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
      <Display header={header2} />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} />
    </div>
  )
}

export default App