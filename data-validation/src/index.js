import app from "./server";
import { MongoClient } from "mongodb";

import dotenv from "dotenv";

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
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
