"use strict";

import mongodb from "mongodb";

import logger from "./logger";
import appSettings from "../config/app-settings";

/**
 * The DB connection variable
 */
let db;
let mongodbClient;

/**
 * Initializes the MongoDB.
 *
 * @return {Promise}
 */
function dbConnect() {
  return new Promise((resolve, reject) => {
    logger.debug("Connecting to MongoDB Atlas:", "utils.dbConnect()");
    if (db) {
      logger.debug(
        "MongoDB already connected, returning open connection.",
        "utils.dbConnect()"
      );
      resolve(db);
    } else {
      logger.debug(
        "MongoDB not connected. Creating new MongoDB connection.",
        "utils.dbConnect()"
      );
      mongodb.MongoClient.connect(
        appSettings.mongodb_url,
        { useNewUrlParser: true },
        function (err, client) {
          if (err) {
            logger.error(
              "Error connecting to the MongoDB URL: " + appSettings.mongodb_url
            );
            reject(err);
          }
          logger.debug("MongoDB connected.", "utils.dbConnect()");
          mongodbClient = client;
          db = mongodbClient.db(appSettings.mongodb_db_name);
          // Make sure connection closes when Node exits
          process.on("exit", (code) => {
            logger.debug(
              `Closing MongoDB connection (node exit code ${code})...`,
              "dbConnect()"
            );
            dbClose();
            logger.debug(`MongoDB connection closed.`, "dbConnect()");
          });
          resolve(db);
        }
      );
    }
  });
}

/**
 * Closes the MongoDB client connection
 */
function dbClose() {
  if (mongodbClient && mongodbClient.isConnected()) {
    logger.debug("Closing MongoDB connection...");
    mongodbClient.close();
    logger.debug("MongoDB connection closed.");
  }
}

module.exports.dbConnect = dbConnect;
module.exports.dbClose = dbClose;
