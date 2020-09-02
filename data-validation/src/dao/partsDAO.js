import { ObjectId } from "bson";
let parts;
const DEFAULT_SORT = [["name", -1]];
export default class PartsDAO {
  static async injectDB(conn) {
    if (parts) {
      return;
    }
    try {
      parts = await conn.db(process.env.NS).collection("parts");
    } catch (e) {
      console.error(`Unable to establish collection handles in partDAO: ${e}`);
    }
  }

  static async create(partInfo) {
    try {
      await parts.insertOne(partInfo);
      return { success: true };
    } catch (e) {
      return { error: e };
    }
  }

  static async getParts({ filters = null, page = 0, partsPerPage = 10 } = {}) {
    let queryParams = {};
    let { query = {}, project = {}, sort = DEFAULT_SORT } = queryParams;
    let cursor;
    try {
      cursor = await parts.find(query).project(project).sort(sort);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { partsList: [], totalNumParts: 0 };
    }
    const displayCursor = cursor
      .skip(parseInt(page) * parseInt(partsPerPage))
      .limit(parseInt(partsPerPage));
    try {
      const partsList = await displayCursor.toArray();
      const totalNumParts =
        parseInt(page) === 0 ? await parts.countDocuments(query) : 0;
      return { partsList, totalNumParts };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { partsList: [], totalNumParts: 0 };
    }
  }
}
