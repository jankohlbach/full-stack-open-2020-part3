require('dotenv').config()

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const Person = require('./models/person');


morgan.token('body', (req) => JSON.stringify(req.body));

const app = express();

app.use(express.json());

app.use(express.static('build'));

app.use(cors());

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  stream: console.log(),
}));


let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
];

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => res.json(people));
});

app.get('/info', (req, res) => {
  res.send(`
    Phonebook has info for ${persons.length} people<br>
    ${new Date(Date.now())}
  `);
});

app.get('/api/person/:id', (req, res) => {
  const person = persons.find((person) => person.id === Number(req.params.id));
  person ? res.json(person) : res.status(404).end();
});

app.delete('/api/person/:id', (req, res) => {
  persons = persons.filter((person) => person.id !== Number(req.params.id));
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const {body} = req;

  if(!body.name) {
    return res.status(400).json({
      error: 'required field name is missing',
    });
  }

  if(!body.number) {
    return res.status(400).json({
      error: 'required field number is missing',
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then(person => res.json(person));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
