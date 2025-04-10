const express = require("express");

const morgan = require("morgan");

const app = express();

const cors = require("cors");

app.use(cors());

app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body"
  )
);

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Phonebook API</h1><p>Try /api/persons</p>");
});

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/info", (req, res) => {
  const date = new Date();
  const count = persons.length;

  res.send(`
    <div>
    <p>Phonebook has info for ${count} people </p>
    <p>${date}</p>
    </div>
    `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  }
  else {
    res.status(404).send({ error: "Person not found" });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();

});

app.post("/api/persons", (req, res) => {
  console.log(req.body);

  const body = req.body;

  if (!body.name || !body.number) {
  return  res.status(400).json({ error: "name and number are required"})
  };

  const existingPerson = persons.find(person => person.name === body.name);

if (existingPerson) {
  return res.status(400).json({ error: "name must be unique"});
}
const id = Math.floor(Math.random() * 100000);

const newPerson = {
  id,
  name: body.name,
  number: body.number
};
persons.push(newPerson);

res.status(201).json(newPerson);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
