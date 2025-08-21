require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const PhoneBook = require("./models/phoneBooks");
const { errorHandler, unknownEndpoint } = require("./middleware");

app.use(express.static("dist"));

app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", async (request, response) => {
  await PhoneBook.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/info", (request, response, next) => {
  PhoneBook.countDocuments({})
    .then((count) => {
      response.send(
        `<p>Phonebook has info for ${count} people</p>
                 <p>${new Date()}</p>`
      );
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", async (request, response) => {
  const id = request.params.id;
  await PhoneBook.findById(id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
});

app.delete("/api/persons/:id", async (request, response) => {
  const id = String(request.params.id);
  const result = await PhoneBook.findByIdAndDelete(id);

  if (!result) {
    return response.status(404).send({ error: `error: Person not found` });
  } else {
    response.status(204).end();
  }
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const { name, number } = request.body;

  PhoneBook.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return response.status(404).json({ error: `error: Person not found` });
      }
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(404).json({
      error: `error: Name or number is missing`,
    });
  }
  PhoneBook.findOne({ name: body.name }).then((existingContact) => {
    if (existingContact) {
      return response.status(404).json({
        error: `error: Name must be unique`,
      });
    }
    const person = new PhoneBook({
      name: body.name,
      number: body.number,
    });
    person
      .save()
      .then((savedPerson) => {
        response.json(savedPerson);
      })
      .catch((error) => next(error));
  });
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
