const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample User Object Structure:
let users = [
  {
    id: "1",
    firstName: "Anshika",
    lastName: "Agarwal",
    hobby: "Teaching",
  },
  {
    id: "2",
    firstName: "shashikant",
    lastName: "sahu",
    hobby: "cricket",
  },
  {
    id: "3",
    firstName: "vivek",
    lastName: "kumar",
    hobby: "nothing",
  },
];

// Middleware for logging requests
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
    console.log("next middleware");
  });
  next();
});

// validation middleware
function validateUser(req, res, next) {
  const { firstName, lastName, hobby } = req.body;
  if (!firstName || !lastName || !hobby) {
    return res.status(400).json({ error: "All fields are required" });
  }
  next();
}

// GET /users – Fetch the list of all users.
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

// GET /users/:id – Fetch details of a specific user by ID.
app.get("/users/:id", (req, res) => {
  const userId = req.params.id; //for dynamic routing.
  const user = users.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found with this id" });
  }
  res.status(200).json(user);
});

// POST /user – Add a new user.
app.post("/user", validateUser, (req, res) => {
  const lastId = users.length > 0 ? parseInt(users[users.length - 1].id) : 0;
  const newUser = {
    id: (lastId + 1).toString(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    hobby: req.body.hobby,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /user/:id – Update details of an existing user.
app.put("/user/:id", validateUser, (req, res) => {
  const userId = req.params.id;
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found with this id" });
  }
  users[userIndex] = { id: userId, ...req.body };
  res.status(200).json(users[userIndex]);
});

// DELETE /user/:id – Delete a user by ID.
app.delete("/user/:id", (req, res) => {
  const userId = req.params.id;
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found with this id" });
  }
  const deletedUser = users.splice(userIndex, 1);
  res.status(200).json(deletedUser[0]);
});

//start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
