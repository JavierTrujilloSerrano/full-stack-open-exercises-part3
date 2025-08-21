const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "error:malformatted id" });
  }

  if (error.name === "ValidationError") {
    if (error.errors.name) {
      return response.status(400).json({ error: `error:${error.errors.name.message}` });
    }
  }
  if (error.errors.number) {
    return response.status(400).json({ error: `error:${error.errors.number.message}` });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

module.exports = { errorHandler, unknownEndpoint };

