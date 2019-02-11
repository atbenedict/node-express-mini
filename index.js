// implement your API here
const express = require("express");
const db = require("./data/db");

const server = express();

server.use(express.json());

server.get("/api/users", (req, res) => {
  db.find()
    .then(db => {
      res.status(200).json({ success: true, db });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

server.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  db.findById(userId)
    .then(db => {
      res.status(200).json({ success: true, db });
    })
    .catch(err => {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    });
});

server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  const newUser = { name, bio };
  if (!name || !bio) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
  db.insert(newUser)
    .then(userId => {
      const { id } = userId;
      db.findById(id).then(user => {
        console.log(user);
        if (!user) {
          return res
            .status(422)
            .send({ Error: `User does not exist by that id ${id}` });
        }
        res.status(201).json(user);
      });
    })
    .catch(err => console.error(err));
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id).then(user => {
    if (!user) {
      return res
        .status(404)
        .send({ Error: `User does not exist by that id ${id}` });
    }
    db.remove(id)
      .then(deleted => {
        res.status(204).end();
      })

      .catch(err => {
        res.status(500).json({ error: "The user could not be removed" });
      });
  });
});

server.put("/api/users/:id", (req, res) => {
  const { name, bio } = req.body;
  const updateUser = { name, bio };
  const { id } = req.params;
  if (!name || !bio) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
  db.findById(id).then(exists => {
    if (!exists) {
      return res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    }
  });
  db.update(id, updateUser)
    .then(updated => {
      res.status(200).json({ success: true, updated });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be modified." });
    });
});

server.listen(4000, () => {
  console.log("\n*** Running on port 4000 ***\n");
});
