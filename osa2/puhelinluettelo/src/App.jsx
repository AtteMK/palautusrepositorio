import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import Notification from './components/Notification'
import './index.css'

const Person = ({ person, setPersons, setErrorMessage, setErrorType }) => {
  console.log('Important', person.id)
  const deletePerson = (id) => {
    const personId = id
    if (confirm(`Delete ${person.name}`)) {
      personService
        .remove(personId)
        .then(() => {
          setPersons(prev => prev.filter(person => person.id !== personId))
          setErrorType('success')
          setErrorMessage(`${person.name} was deleted successfully`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 2500)
        })
        .catch(error => {
          setErrorType('error')
          setErrorMessage(error.response.data)
          setTimeout(() => {
            setErrorMessage(null)
          }, 2500)
        })
    }
  }
  return (
    <li>
      {person.name} {person.number} 
      <button onClick={() => deletePerson(person.id)}>delete</button>
    </li>
  )
}

const PersonForm = ({ persons, setPersons, newName, setNewName, newNumber, setNewNumber, handleNameChange, handleNumberChange, setErrorMessage, setErrorType }) => {
  const changeNumber = (id) => {
    const person = persons.find(n => n.id === id)
    const changedNumber = { ...person, number: newNumber }
    personService
      .update(id, changedNumber)
      .then(response => {
        setPersons(persons.map(person => person.id !== id ? person : response.data))
        setErrorType('success')
        setErrorMessage(`Successfully updated number for ${response.data.name}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 2500)
      })
      .catch(error => {
        setErrorType('error')
        setErrorMessage(error.response.data)
        setTimeout(() => {
          setErrorMessage(null)
        }, 2500)
      })
  }
  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = {
      name: newName,
      number: newNumber,
    }
    let dublicateFound = false
    let personId = ''
    persons.forEach((person) => {
      if (person.name === newName) {
        personId = person.id
        dublicateFound = true
      }
    })
    if (dublicateFound) {
      if (confirm(`${newName} is already added to phonebook, replace the old number with new one`)) {
        changeNumber(personId)
      }
      setNewName('')
      setNewNumber('')
    } else {
      personService
        .create(personObject)
          .then(returnedPerson => {
          setErrorType('success')
          setErrorMessage(`Successfully added ${returnedPerson.name}`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 2500)
          setNewName('')
          setNewNumber('')
          setPersons(persons.concat(returnedPerson))
        })
        .catch(error => {
          setErrorType('error')
          setErrorMessage(error.response.data)
          setTimeout(() => {
            setErrorMessage(null)
          }, 2500)
        })
        setNewName('')
        setNewNumber('')
    }
  }
  return(
    <form onSubmit={addPerson}>
      <div>name: <input value={newName} onChange={handleNameChange} /></div>
      <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with <input value={filter} onChange={handleFilterChange} />
  </div>
)

const Persons = ({ persons, setPersons, setErrorMessage, setErrorType }) => {
  if (!Array.isArray(persons)) return null
  return(
    <div>
      {persons.map(person => 
        <Person 
          key={person.id} 
          person={person} 
          setPersons={setPersons} 
          setErrorMessage={setErrorMessage} 
          setErrorType={setErrorType} 
        />
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState('error')

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.log('fail')
      })
  }, [])

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const filteredPersons = Array.isArray(persons) ?
    (filter === ''
      ? persons
      : persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    )
    : []

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type={errorType} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm 
      persons={persons} 
      setPersons={setPersons}
      newName={newName} 
      setNewName={setNewName}
      newNumber={newNumber} 
      setNewNumber={setNewNumber}
      handleNameChange={handleNameChange} 
      handleNumberChange={handleNumberChange} 
      setErrorMessage={setErrorMessage}
      setErrorType={setErrorType}
      />
      <h3>Numbers</h3>
      <Persons 
      persons={filteredPersons}
      setPersons={setPersons}
      setErrorMessage={setErrorMessage}
      setErrorType={setErrorType}  />
    </div>
  )

}

export default App