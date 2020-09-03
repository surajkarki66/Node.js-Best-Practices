import logger from "../utils/logger";

let parts;
const DEFAULT_SORT = [["name", -1]];
export default class PartsDAO {
  static async injectDB(conn) {
    if (parts) {
      return;
    }
    try {
      parts = await conn.db(process.env.NS).collection("parts");
      logger.info(
        `Connected to parts collection of ${process.env.NS} database.`,
        "PartsDAO.injectDB()"
      );
    } catch (e) {
      logger.error(
        `Error while injecting DB: ${e.message}`,
        "PartsDAO.injectDB()"
      );
      throw e;
    }
  }

  static async create(partInfo) {
    try {
      const result = await parts.insertOne(partInfo);
      return { data: { createdId: result.insertedId }, statusCode: 201 };
    } catch (e) {
      logger.error("Error occurred: " + e.message, "create()");
      throw e;
    }
  }

  static async getParts({ filters = null, page = 0, partsPerPage = 10 } = {}) {
    let queryParams = {};
    let { query = {}, project = {}, sort = DEFAULT_SORT } = queryParams;
    let cursor;
    try {
      cursor = await parts.find(query).project(project).sort(sort);
    } catch (e) {
      logger.error(`Unable to issue find command, ${e.message}`);
      return {
        data: [],
        totalNumParts: 0,
        statusCode: 404,
      };
    }
    const displayCursor = cursor
      .skip(parseInt(page) * parseInt(partsPerPage))
      .limit(parseInt(partsPerPage));
    try {
      const documents = await displayCursor.toArray();
      const totalNumParts =
        parseInt(page) === 0 ? await parts.countDocuments(query) : 0;
      return {
        data: documents,
        totalNumParts,
        statusCode: documents.length > 0 ? 200 : 404,
      };
    } catch (e) {
      logger.error(
        `Unable to convert cursor to array or problem counting documents, ${e.message}`
      );
      throw e;
    }
  }
}
