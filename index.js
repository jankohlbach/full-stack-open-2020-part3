/* globals process */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const Person = require('./models/person');


const app = express();

app.use(express.static('build'));

app.use(express.json());

app.use(cors());

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {stream: console.log()}));


app.get('/info', (req, res) => {
  Person.find({})
    .then(people => res.send(`
      Phonebook has info for ${people.length} people<br>
      ${new Date(Date.now())}
    `));
});

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(people => res.json(people));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      person
        ? res.json(person)
        : res.status(404).end();
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => res.status(204).end())
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
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

  person.save()
    .then(person => res.json(person))
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const {body} = req;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error));
});


const unknownEndpoint = (request, response) => response.status(404).send({error: 'unknown endpoint'});

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if(error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({error: 'malformatted id'});
  } else if(error.name === 'ValidationError') {
    return res.status(400).json({error: error.message});
  }

  next(error);
};

// handler of errors
app.use(errorHandler);


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
