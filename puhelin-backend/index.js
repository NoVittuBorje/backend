const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
morgan.token('content', function(req, res) {return JSON.stringify(req.body)});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": "1"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": "4"
    }
  ]
app.get("/info",(request,response) => {
  let pituus = persons.length
  var mydate = new Date();
  response.send(
    `<p>Phonebook has info on ${pituus} people <p/> ${mydate} `
  
  )
})

app.get('/api/persons/:id', (request, response) => {
      const id = request.params.id
      const person = persons.find(note => note.id === id)
      if (!person) {
        return response.status(400).json({
            error: "no person with that id"
        })}
      response.json(person)})

app.get("/api/persons",(request,response) => {
  response.json(persons)
})

app.post("/api/persons", (request,response) => {
  const body = request.body
  let nimilista = persons.map(person => person.name)
  if (!body.name) {
    return response.status(400).json({ 
      error: "name missing"})}

  if (!body.number) {
    return response.status(400).json({ 
      error: "number missing"})}

  if (nimilista.includes(body.name,0)) {
    return response.status(400).json({ 
      error: "name already in phonebook"})}

  const person = {
    "name": body.name,
    "number": body.number,
    "id": getRandomInt(0,99999)
  }
  persons = persons.concat(person)
  response.json(person)
})
app.delete('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id)
  persons = persons.filter(note => {
    return note.id != id})
  response.json(persons)
})
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})