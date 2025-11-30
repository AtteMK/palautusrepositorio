const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
morgan.token('body', function (req, res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  },
  {
    id: "5",
    name: "Atte Mäki-Kerttula",
    number: "050-2333223"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body
  if (!name || !number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  } 
  if (persons.find(person => person.name === name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }
  const person = {
    id: Math.floor(Math.random() * 10001).toString(),
    name,
    number
  }
  persons = persons.concat(person)
  response.json(person)
})

app.get('/info', (request, response) => {
  const timestamp = new Date().toString()
  const personsCount = persons.length
  response.send(`Phonebook has info for ${personsCount} people<br><br>${timestamp}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)