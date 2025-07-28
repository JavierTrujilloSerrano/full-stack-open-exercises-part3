const http = require("http");
const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.static('dist'))

app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
                 <p>${new Date()}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const deletePerson = persons.find((person) => person.id === id);

  if (!deletePerson) {
    return response.status(404).end();
  } else {
    persons = persons.filter((person) => person.id !== id);
    response.status(204).end();
  }
});

const randomId = () => {
  let max = 1000000;
  const numberRandom = Math.ceil(Math.random() * max);
  return numberRandom;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: "name or number is missing",
    });
  }
  const namePerson = persons.find((person) => person.name === body.name);

  if (namePerson) {
    return response.status(404).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: randomId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.status(201).json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
