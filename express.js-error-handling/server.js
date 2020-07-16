const express = require("express");

const app = express();
const handleErrors = require("./middleware/handleErrors");
const { BadRequest } = require("./utils/errors");

const port = 3000;

// Body parser middleware
app.use(express.json());

// Routes
app.post("/post", async (req, res, next) => {
  const { title, author } = req.body;
  try {
    if (!title || !author) {
      throw new BadRequest("Missing required fields: title or author");
    }
    const post = await db.post.insert({ title, author });
    res.json(post);
  } catch (error) {
    next(error);
  }
});

// Defining Error handling middleware
app.use(handleErrors);

app.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}`);
});
