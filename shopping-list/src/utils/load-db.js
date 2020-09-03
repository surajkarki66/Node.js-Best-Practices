"use strict";

import fs from "fs";

import logger from "./logger";
import utils from "./utils";

/**
 * Loads the specified file name and returns its contents
 * in the resolved promise. If an error occurs, the Promise
 * is rejected with that err object.
 *
 * @param {String} filename - the name of the file to be read
 * @return {Promise}
 */
function loadFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

/**
 * The cache of unread data. Not all data can be processed
 * for a single chunk, which is most certainly going to cross
 * record boundaries, leaving us with an incomplete record
 * at the end of the chunk. So we cache that here, then add
 * it to the front of the next chunk. And so it goes.
 */
let chunkCache = "";

/**
 * Loads the data from the Grocery database CSV files
 * @param {String} fileName - the name of the SQL file containing
 * the load statements
 * @param {Function} handleTableRecord - the function to handle a single record
 *
 * @return {Promise}
 */
function loadData(fileName, handleTableRecord) {
  return new Promise((resolve, reject) => {
    logger.info("Loading data files...", "loadData()");
    // Read the brand data
    const readableStream = fs.createReadStream(fileName, {
      highWaterMark: 64 * 1024,
    });
    readableStream
      .on("open", (fd) => {
        logger.info(
          "Opened file: " + fileName,
          "loadData():readableStream.on(open)"
        );
      })
      .on("data", (chunk) => {
        logger.debug(
          "Got chunk of data (size): " + chunk.length,
          "loadData():readableStream.on(data)"
        );
        let actualChunk = chunkCache + chunk;
        logger.debug(
          "Passing a chunk of size (includes leftovers): " + actualChunk.length,
          "loadData()"
        );
        let lines = utils.transformChunkIntoLines(actualChunk);
        for (let aa = 0; aa < lines.fieldsArray.length; aa++) {
          handleTableRecord(lines.fieldsArray[aa]);
        }
        chunkCache = lines.leftOvers;
        logger.debug("Leftovers: " + chunkCache, "loadData()");
      })
      .on("error", (err) => {
        logger.error(
          "Error: " + err.message,
          "loadData():readableStream.on(error)"
        );
        reject(err);
      })
      .on("close", () => {
        logger.info(
          "Closed file: " + fileName,
          "loadData():readableStream.on(close)"
        );
        resolve();
      });
  });
}

module.exports.loadFile = loadFile;
module.exports.loadData = loadData;
