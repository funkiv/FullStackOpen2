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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

//Person Model
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
  Person.countDocuments({}).then(count => {
    response.send(
      `<p>Phonebook has info for ${count} people</p>
      </br>
      <p>${request.requestTime}</p>
      `)  
  })
})

//Get all persons
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json((persons))
  })
  .catch(error => next(error))
})

//Get persons by ID
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//Delete person by ID
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(person => {
    response.json(person)
  })
  .catch(error => next(error))
})

//Add new person
app.post('/api/persons', (request, response, next) => {
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
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

//Used when endpoint of a requested route is unknown 
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'})
}
//handles all routes not handled by previous routes
//should be the last middleware 
app.use(unknownEndpoint)

app.use(errorHandler)

//Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})