const express = require("express");

const app = express();

const port = 3000;

// Body parser middleware
app.use(express.json());


app.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}`);
});
