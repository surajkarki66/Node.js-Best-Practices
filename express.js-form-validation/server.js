const express = require("express");

const app = express();
const route = require("./routes/user");
const handleErrors = require("./middleware/handleErrors");

const port = 3000;

// Body parser middleware
app.use(express.json());

// routes
app.use("/", route);
app.use(handleErrors);



app.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}`);
});
