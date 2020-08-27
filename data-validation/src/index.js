import dotenv from "dotenv";
import { MongoClient } from "mongodb";

import app from "./server";
import BlogsDAO from "./dao/blogsDAO";
import StudentsDAO from "./dao/studentsDAO";
const port = process.env.PORT || 8000;

dotenv.config();
MongoClient.connect(process.env.DB_URI, {
  wtimeout: 2500,
  w: "majority",
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await BlogsDAO.injectDB(client);
    await StudentsDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
