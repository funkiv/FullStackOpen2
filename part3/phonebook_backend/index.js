require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

//Middleware
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :response-time ms - :body'))
app.use(express.static('dist'))

morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

//Person Model
let persons = []
const Person = require('./models/person')

//Root route
app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

//Info Route
app.get('/info', (request, response) => {
  console.log(new Date());
  request.requestTime = new Date();
  console.log(request.requestTime);
  response.send(
    `<p>Phonebook has info for ${Person.length} people</p>
    </br>
    <p>${request.requestTime}</p>
    `)  
})

//Get all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json((persons))
  })
})

//Get persons by ID
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id == id)
  if (person) {
    response.json(person)
  } else {
      response.status(404).end()
  }
})

//Delete person by ID
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(person => {
    response.json(person)
  })
})

//Add new person
app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name || !body.number) {
    response.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

//Used when endpoint of a requested route is unknown 
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'})
}
//handles all routes not handled by previous routes
//should be the last middleware 
app.use(unknownEndpoint)

//Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})