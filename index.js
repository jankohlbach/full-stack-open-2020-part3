const express = require('express');
const morgan = require('morgan');

morgan.token('body', (req) => JSON.stringify(req.body));

const app = express();

app.use(express.json());

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
  res.json(persons);
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

  if(persons.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 50000),
  };

  persons = persons.concat(person);
  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
