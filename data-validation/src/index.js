import dotenv from "dotenv";
import { MongoClient } from "mongodb";

import app from "./server";
import logger from "./utils/logger";
import BlogsDAO from "./dao/blogsDAO";
import StudentsDAO from "./dao/studentsDAO";
import UsersDAO from "./dao/usersDAO";
import PartsDAO from "./dao/partsDAO";
import ProductsDAO from "./dao/productsDAO";
import AccountsDAO from "./dao/accountsDAO";
const port = process.env.PORT || 8000;

dotenv.config();
MongoClient.connect(process.env.DB_URI, {
  wtimeout: 2500,
  w: "majority",
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .catch((err) => {
    logger.error(`Error connecting to the MongoDB URI: ${err.stack}`);
    process.exit(1);
  })
  .then(async (client) => {
    await BlogsDAO.injectDB(client);
    await StudentsDAO.injectDB(client);
    await UsersDAO.injectDB(client);
    await PartsDAO.injectDB(client);
    await ProductsDAO.injectDB(client);
    await AccountsDAO.injectDB(client);
    app.listen(port, () => {
      logger.info(`Listening on PORT ${port}`);
    });
  });
